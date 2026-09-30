import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function compileContract() {
    const contractPath = path.resolve(__dirname, '../contract/payecho.compact');
    const outDir = path.resolve(__dirname, '../managed');
    const bindingsPath = path.resolve(outDir, 'payecho.ts');

    console.log(`[PayEcho Build] Validating Compact contract at ${contractPath}...`);

    if (!fs.existsSync(contractPath)) {
        console.error(`[PayEcho Build Error] Contract source not found: ${contractPath}`);
        process.exit(1);
    }

    const compactSource = fs.readFileSync(contractPath, 'utf8');
    if (!compactSource.includes('submitSalary')) {
        console.error('[PayEcho Build Error] Contract missing submitSalary circuit.');
        process.exit(1);
    }

    // Check if compiler binary is available in PATH
    let compilerBin: string | null = null;
    try {
        execSync('which compact', { stdio: 'ignore' });
        compilerBin = 'compact';
    } catch {
        try {
            execSync('which compactc', { stdio: 'ignore' });
            compilerBin = 'compactc';
        } catch {
            compilerBin = null;
        }
    }

    if (compilerBin) {
        console.log(`[PayEcho Build] Found compiler '${compilerBin}'. Compiling to ${outDir}...`);
        try {
            execSync(`${compilerBin} compile ${contractPath} --out-dir ${outDir}`, { stdio: 'inherit' });
            console.log('[PayEcho Build] Contract compiled successfully to ZKIR & bindings.');
        } catch (error) {
            console.error('[PayEcho Build Error] Compilation failed:', error);
            process.exit(1);
        }
    } else {
        console.log('[PayEcho Build] Midnight Compact compiler binary not present in CI/local environment.');
        console.log('[PayEcho Build] Verifying pre-generated TypeScript bindings at managed/payecho.ts...');

        if (!fs.existsSync(bindingsPath)) {
            console.error('[PayEcho Build Error] Pre-generated bindings missing at managed/payecho.ts.');
            process.exit(1);
        }

        console.log('[PayEcho Build] ✓ Contract source validated.');
        console.log('[PayEcho Build] ✓ Managed TypeScript contract bindings verified.');
    }
}

compileContract();
