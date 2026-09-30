/**
 * Midnight ZK PayEcho Deployment Script
 * 
 * Deployment on Midnight Network is managed through the connected wallet provider 
 * (Lace or 1AM) or via an authorized Midnight sequencer CLI.
 * 
 * Target Network: Midnight Preview Testnet
 * Contract: PayEcho (payecho.compact)
 */

import fs from 'fs';
import path from 'path';

async function main() {
    console.log("==========================================");
    console.log(" Midnight ZK PayEcho Contract Deployment");
    console.log(" Network: Midnight Preview Testnet");
    console.log("==========================================");
    console.log("\nDeployment is securely initiated via wallet signing flow.");
    console.log("Ensure your Lace or 1AM wallet is funded with Preview tNIGHT & DUST.");
    
    const configPath = path.resolve(process.cwd(), 'src/config/contract-config.json');
    if (fs.existsSync(configPath)) {
        const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        console.log("\nCurrent Active Configuration:");
        console.log(`Contract Address: ${config.contractAddress}`);
        console.log(`Transaction Hash: ${config.txHash}`);
        console.log(`Target Network:   ${config.network}`);
    }
}

main().catch(console.error);
