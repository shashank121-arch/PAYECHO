import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

async function deployContract() {
    const deployerMnemonic = process.env.DEPLOYER_MNEMONIC;
    
    if (!deployerMnemonic) {
        console.error("Error: DEPLOYER_MNEMONIC environment variable is required for deployment.");
        process.exit(1);
    }

    setNetworkId(NetworkId.TestNet);
    
    console.log("Initializing Wallet Provider with mnemonic...");
    // For genuine deployment, we use the Testnet environment builder
    // @ts-ignore
    const { TestnetEnvironment } = await import('@midnight-ntwrk/testing').catch(() => {
        return { TestnetEnvironment: null };
    });

    if (!TestnetEnvironment) {
       throw new Error("TestnetEnvironment not available in this env. Cannot deploy.");
    }

    console.log("Deploying contract to Midnight Preview Testnet...");
    
    let contractAddress = "";
    let txHash = "";

    const env = await TestnetEnvironment.build({
        networkId: NetworkId.TestNet,
        seed: deployerMnemonic
    });
    const providers = await env.getProviders();
    
    const contract = await Contract.deploy(
        providers,
        payecho.contractInitialState,
        payecho.contractConfig
    );
    
    contractAddress = contract.deployTxData.public.contractAddress;
    txHash = contract.deployTxData.txHash;

    console.log(`\nDeployment Successful!`);
    console.log(`Contract Address: ${contractAddress}`);
    console.log(`Transaction Hash: ${txHash}`);
    
    const configDir = path.resolve(process.cwd(), 'src/config');
    const configPath = path.join(configDir, 'contract-config.json');
    
    if (!fs.existsSync(configDir)) {
        fs.mkdirSync(configDir, { recursive: true });
    }
    
    const configData = {
        contractAddress: contractAddress,
        txHash: txHash,
        network: "Preview Testnet",
        timestamp: new Date().toISOString()
    };
    
    fs.writeFileSync(configPath, JSON.stringify(configData, null, 2));
    console.log(`Saved contract config to ${configPath}`);
}

deployContract().catch(console.error);
