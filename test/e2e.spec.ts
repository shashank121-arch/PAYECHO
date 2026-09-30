import { test, expect } from '@playwright/test';

test.beforeEach(({ page }) => {
    page.on('pageerror', (err) => {
        console.error(`Uncaught exception: ${err.message}`);
    });
    
    page.on('console', msg => {
        if (msg.type() === 'error') {
            console.error(`Console Error: ${msg.text()}`);
        }
    });
});

test.describe('End-to-End Functional Verification & UI Alignment', () => {

    test('Visual Alignment & Element Existence', async ({ page }) => {
        await page.goto('/');

        // Verify Hero Section
        const heroHeading = page.locator('h1');
        await expect(heroHeading).toBeVisible();
        await expect(heroHeading).toContainText('Know your worth');

        // Verify Wallet Button Exists
        const connectButton = page.locator('button', { hasText: /Connect/i });
        await expect(connectButton.first()).toBeVisible();
        
        // Verify Dashboard Section Elements
        const dashboardSection = page.locator('#dashboard');
        await expect(dashboardSection).toBeVisible();
        
        const salaryInput = page.locator('input[type="number"]');
        await expect(salaryInput).toBeVisible();
        
        const generateProofBtn = page.locator('button', { hasText: /ZK Proof/i });
        await expect(generateProofBtn).toBeVisible();
        await expect(generateProofBtn).toBeDisabled(); // Disabled when input is empty
    });

    test('Responsive Design Validation', async ({ page }) => {
        // Mobile Viewport
        await page.setViewportSize({ width: 375, height: 812 });
        await page.goto('/');
        let heroHeading = page.locator('h1');
        await expect(heroHeading).toBeVisible();
        
        // Tablet Viewport
        await page.setViewportSize({ width: 768, height: 1024 });
        await expect(heroHeading).toBeVisible();

        // Desktop Viewport
        await page.setViewportSize({ width: 1440, height: 900 });
        await expect(heroHeading).toBeVisible();
    });

    test('Wallet Integration - Standard DApp Connector Flow', async ({ page }) => {
        await page.goto('/');

        // Inject standard Midnight DApp Connector Mock (Item 1 & 17)
        await page.evaluate(() => {
            (window as any).midnight = {
                mn1am: {
                    name: '1AM Wallet',
                    rdns: 'io.midnight.1am',
                    apiVersion: '1.0.0',
                    connect: async (networkId: string) => {
                        console.log('Connected to network:', networkId);
                        return {
                            getShieldedAddresses: async () => ({
                                shieldedAddress: 'mn_shield-addr_preview1testnetuser0001',
                                shieldedCoinPublicKey: '00'.repeat(32),
                                shieldedEncryptionPublicKey: '00'.repeat(32)
                            }),
                            getUnshieldedAddress: async () => ({
                                unshieldedAddress: 'mn_preview1testnetuser0001'
                            }),
                            getDustBalance: async () => ({
                                balance: 1200n,
                                cap: 5000n
                            }),
                            getUnshieldedBalances: async () => ({
                                tNight: 25n
                            })
                        };
                    }
                }
            };
        });

        // Click connect
        const connectButton = page.locator('button', { hasText: /Connect/i }).first();
        await connectButton.click();

        // Verify connected status and address snippet
        await expect(page.locator('text=mn_shiel...er0001')).toBeVisible({ timeout: 5000 });
        await expect(page.locator('text=1200 DUST')).toBeVisible();
    });

    test('Transaction Execution - ZK Lifecycle & Activity Verification', async ({ page }) => {
        await page.goto('/');
        
        const salaryInput = page.locator('input[type="number"]');
        await salaryInput.fill('75000');
        
        const generateProofBtn = page.locator('button', { hasText: /ZK Proof/i });
        await expect(generateProofBtn).toBeEnabled();

        // Click to generate proof
        await generateProofBtn.click();
        
        // Verify lifecycle progression to confirmed
        await expect(page.locator('text=Zero-knowledge proof validated!')).toBeVisible({ timeout: 10000 });
        
        // Verify on-chain activity feed shows transaction
        await expect(page.locator('text=$50k - $100k').first()).toBeVisible();
        await expect(page.locator('text=Explorer').first()).toBeVisible();
    });

    test('Error Handling - Negative Salary Rejection', async ({ page }) => {
        await page.goto('/');
        
        const salaryInput = page.locator('input[type="number"]');
        await salaryInput.fill('-50000');
        
        const generateProofBtn = page.locator('button', { hasText: /ZK Proof/i });
        await generateProofBtn.click();
        
        await expect(page.locator('text=Invalid salary amount')).toBeVisible();
    });
});
