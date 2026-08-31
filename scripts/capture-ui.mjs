import { chromium } from 'playwright';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');
const assetsDir = path.join(rootDir, 'assets');

async function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function startServer() {
    console.log('Starting Vite server...');
    const server = spawn('npm', ['run', 'dev'], { cwd: rootDir, stdio: 'pipe' });
    
    return new Promise((resolve, reject) => {
        let isStarted = false;
        
        server.stdout.on('data', (data) => {
            const output = data.toString();
            if (output.includes('Local:') && !isStarted) {
                isStarted = true;
                const match = output.match(/http:\/\/localhost:(\d+)/);
                const port = match ? match[1] : 5173;
                console.log(`Server started on port ${port}`);
                resolve({ server, port });
            }
        });

        server.stderr.on('data', (data) => {});

        server.on('error', (err) => {
            reject(err);
        });

        setTimeout(() => {
            if (!isStarted) {
                reject(new Error('Server failed to start within 10 seconds'));
            }
        }, 10000);
    });
}

async function captureScreenshots(port) {
    console.log('Launching browser...');
    const browser = await chromium.launch();
    
    try {
        const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
        console.log(`Navigating to http://localhost:${port}...`);
        
        await page.goto(`http://localhost:${port}`, { waitUntil: 'networkidle' });
        await wait(2000);
        
        console.log('Capturing hero-landing.png...');
        await page.screenshot({ path: path.join(assetsDir, 'hero-landing.png') });
        
        console.log('Scrolling to ZK Dashboard...');
        await page.evaluate(() => {
            const dashboard = document.getElementById('dashboard');
            if (dashboard) {
                dashboard.scrollIntoView({ behavior: 'instant', block: 'center' });
            } else {
                window.scrollBy(0, window.innerHeight);
            }
        });
        await wait(1500);
        console.log('Capturing zk-dashboard.png...');
        await page.screenshot({ path: path.join(assetsDir, 'zk-dashboard.png') });
        
        console.log('Scrolling to Philosophy & Features...');
        await page.evaluate(() => {
            window.scrollBy(0, window.innerHeight * 1.5);
        });
        await wait(1500);
        console.log('Capturing philosophy-features.png...');
        await page.screenshot({ path: path.join(assetsDir, 'philosophy-features.png') });
        
        console.log('All screenshots captured successfully!');
    } finally {
        await browser.close();
    }
}

async function run() {
    let serverProcess;
    try {
        const { server, port } = await startServer();
        serverProcess = server;
        await captureScreenshots(port);
    } catch (err) {
        console.error('Error during execution:', err);
        process.exitCode = 1;
    } finally {
        if (serverProcess) {
            console.log('Shutting down server...');
            serverProcess.kill();
        }
    }
}

run();
