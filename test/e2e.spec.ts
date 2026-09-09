import { test, expect } from '@playwright/test';

// Global check for console errors to ensure console cleanliness
test.beforeEach(({ page }) => {
    page.on('pageerror', (err) => {
        console.error(`Uncaught exception: ${err.message}`);
        // Optionally fail test on unhandled exceptions
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
        const connectButton = page.locator('button', { hasText: /Connect 1AM Wallet/i });
        await expect(connectButton).toBeVisible();
        
        // Verify Dashboard Section Elements
        const dashboardSection = page.locator('#dashboard');
        await expect(dashboardSection).toBeVisible();
        
        const salaryInput = page.locator('input[type="number"]');
        await expect(salaryInput).toBeVisible();
        
        const generateProofBtn = page.locator('button', { hasText: /Generate ZK Proof/i });
        await expect(generateProofBtn).toBeVisible();
        await expect(generateProofBtn).toBeDisabled(); // Disabled when input is empty
    });

    test('Responsive Design Validation', async ({ page }) => {
        // Test Mobile Viewport
        await page.setViewportSize({ width: 375, height: 812 });
        await page.goto('/');
        let heroHeading = page.locator('h1');
        await expect(heroHeading).toBeVisible();
        
        // Test Tablet Viewport
        await page.setViewportSize({ width: 768, height: 1024 });
        await expect(heroHeading).toBeVisible();

        // Test Desktop Viewport
        await page.setViewportSize({ width: 1440, height: 900 });
        await expect(heroHeading).toBeVisible();
    });

    test('Wallet Integration - Mocked Connect Flow', async ({ page }) => {
        await page.goto('/');

        // Intercept window.midnight to simulate the extension being present during UI tests
        await page.evaluate(() => {
            (window as any).midnight = {
                mn1am: {
                    enable: async () => ({
                        state: () => ({
                            subscribe: (cb: any) => cb({ address: '0x1AM...MockConnected', status: 'connected' })
                        }),
                        privateStateProvider: {},
                        zkConfigProvider: {},
                        publicDataProvider: {},
                        proofProvider: {},
                        walletProvider: {}
                    })
                }
            };
        });

        // Click connect
        const connectButton = page.locator('button', { hasText: /Connect 1AM Wallet/i });
        await connectButton.click();

        // Verify Status changes to Connecting then Connected (Simulated instantly)
        await expect(page.locator('text=Wallet connected successfully!')).toBeVisible({ timeout: 5000 });
        
        // Verify button text updates to wallet address
        const connectedBtn = page.locator('button', { hasText: '0x1AM...cted' });
        await expect(connectedBtn).toBeVisible();
    });

    test('Transaction Execution - UI State Flow', async ({ page }) => {
        await page.goto('/');
        
        // Input a salary
        const salaryInput = page.locator('input[type="number"]');
        await salaryInput.fill('75000');
        
        const generateProofBtn = page.locator('button', { hasText: /Generate ZK Proof/i });
        await expect(generateProofBtn).toBeEnabled();

        // Since wallet isn't connected in this isolated test, clicking it should show error
        await generateProofBtn.click();
        
        // We expect an error boundary or status message
        await expect(page.locator('text=Contract not connected.')).toBeVisible();
    });

    test('Error Handling - Negative Salary Rejection', async ({ page }) => {
        await page.goto('/');
        
        const salaryInput = page.locator('input[type="number"]');
        await salaryInput.fill('-50000');
        
        const generateProofBtn = page.locator('button', { hasText: /Generate ZK Proof/i });
        await generateProofBtn.click();
        
        await expect(page.locator('text=Invalid salary amount.')).toBeVisible();
    });
});
