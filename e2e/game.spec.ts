import { test as base, expect } from '@playwright/test';
import { addCoverageReport } from 'monocart-reporter';
type CoverageFixture = {
  autoTestFixture: void;
};

const test = base.extend<CoverageFixture>({
  autoTestFixture: [
    async ({ page }, use) => {
      const isChromium = test.info().project.name === 'chromium' || test.info().project.name === 'Google Chrome';

     if (isChromium) {
        await Promise.all([
          page.coverage.startJSCoverage({ resetOnNavigation: false }),
          page.coverage.startCSSCoverage({ resetOnNavigation: false }),
        ]);
      }


      await use();


     if (isChromium) {
        const [jsCoverage, cssCoverage] = await Promise.all([
          page.coverage.stopJSCoverage(),
          page.coverage.stopCSSCoverage(),
        ]);

        const coverageList = [...jsCoverage, ...cssCoverage];
        await addCoverageReport(coverageList, test.info());
      }
    },
    { scope: 'test', auto: true },
  ],
});


test.describe('Horse Racing Game E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('initial state is correct', async ({ page }) => {
    await expect(page).toHaveTitle(/Horse Racing/i, { timeout: 5000 });

    await expect(page.getByTestId('horse-list-empty')).toBeVisible();

    const startBtn = page.getByTestId('start-btn');
    await expect(startBtn).toBeDisabled();
  });

  test('full game loop: generate -> start -> finish round', async ({ page }) => {
    const generateBtn = page.getByTestId('generate-btn');
    await generateBtn.click();

    await expect(page.locator('[data-test="horse-item"]')).toHaveCount(20);

    await expect(page.locator('[data-test="round-item"]')).toHaveCount(6);

    const startBtn = page.getByTestId('start-btn');
    await expect(startBtn).toBeEnabled();
    await startBtn.click();

    await expect(startBtn).toBeDisabled();
    await expect(startBtn).toHaveText(/Racing/i);

    await expect(page.locator('[data-test^="horse-runner-"]')).toHaveCount(10);

    const firstResult = page.locator('[data-test="result-card"]').first();
    await expect(firstResult).toBeVisible({ timeout: 15000 });

    await expect(startBtn).toBeEnabled();
    await expect(startBtn).toHaveText('Start Race');
  });
});
