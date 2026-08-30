import { execSync } from 'child_process';
import path from 'path';

function compileContract() {
    const contractPath = path.resolve(__dirname, '../contract/payecho.compact');
    const outDir = path.resolve(__dirname, '../managed');

    console.log(`Compiling Compact contract from ${contractPath}...`);
    
    try {
        execSync(`npx compactc compile ${contractPath} --out-dir ${outDir}`, { stdio: 'inherit' });
        console.log('Contract compiled successfully to ZKIR.');
    } catch (error) {
        console.error('Failed to compile the contract. Ensure @midnight-ntwrk/compactc is installed.');
        process.exit(1);
    }
}

compileContract();
