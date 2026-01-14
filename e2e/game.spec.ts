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

  test('generate button is disabled during race', async ({ page }) => {
    const generateBtn = page.getByTestId('generate-btn');
    const startBtn = page.getByTestId('start-btn');

    await generateBtn.click();
    await startBtn.click();

    await expect(generateBtn).toBeDisabled();
    await expect(startBtn).toHaveText(/Racing/i);

    // Wait for race to finish
    await expect(page.locator('[data-test="result-card"]').first()).toBeVisible({ timeout: 15000 });

    await expect(generateBtn).toBeEnabled();
  });

  test('program highlights current round correctly', async ({ page }) => {
    const generateBtn = page.getByTestId('generate-btn');
    await generateBtn.click();

    // First round should be highlighted
    const firstRound = page.locator('[data-test="round-item"]').first();
    await expect(firstRound).toHaveClass(/bg-blue-50/);

    const startBtn = page.getByTestId('start-btn');
    await startBtn.click();

    // Wait for first round to complete
    await expect(page.locator('[data-test="result-card"]').first()).toBeVisible({ timeout: 15000 });

    // Second round should now be highlighted
    const secondRound = page.locator('[data-test="round-item"]').nth(1);
    await expect(secondRound).toHaveClass(/bg-blue-50/);

    // First round should be dimmed
    await expect(firstRound).toHaveClass(/opacity-50/);
  });

  test('results display winner with trophy', async ({ page }) => {
    const generateBtn = page.getByTestId('generate-btn');
    await generateBtn.click();

    const startBtn = page.getByTestId('start-btn');
    await startBtn.click();

    const resultCard = page.locator('[data-test="result-card"]').first();
    await expect(resultCard).toBeVisible({ timeout: 15000 });

    // Check that result contains winner with trophy
    await expect(resultCard).toContainText('🏆');
    await expect(resultCard).toContainText('Round 1');
  });

  test('race track displays horses during race', async ({ page }) => {
    const generateBtn = page.getByTestId('generate-btn');
    await generateBtn.click();

    const startBtn = page.getByTestId('start-btn');
    await startBtn.click();

    // Check that horses appear on track
    await expect(page.locator('[data-test^="horse-runner-"]')).toHaveCount(10);

    // Check that round info is displayed
    await expect(page.locator('[data-test="round-info"]')).toBeVisible();
    await expect(page.locator('[data-test="round-info"]')).toContainText('Round 1');
  });

  test('horse list displays all 20 horses', async ({ page }) => {
    const generateBtn = page.getByTestId('generate-btn');
    await generateBtn.click();

    await expect(page.locator('[data-test="horse-item"]')).toHaveCount(20);

    // Check that each horse has name and condition
    const firstHorse = page.locator('[data-test="horse-item"]').first();
    await expect(firstHorse).toBeVisible();
  });

  test('program shows correct distances for each round', async ({ page }) => {
    const generateBtn = page.getByTestId('generate-btn');
    await generateBtn.click();

    const expectedDistances = ['1200m', '1400m', '1600m', '1800m', '2000m', '2200m'];
    const rounds = page.locator('[data-test="round-item"]');

    for (let i = 0; i < 6; i++) {
      const round = rounds.nth(i);
      await expect(round.locator('[data-test="round-distance"]')).toContainText(expectedDistances[i]);
    }
  });

  test('results show all horses in finishing order', async ({ page }) => {
    const generateBtn = page.getByTestId('generate-btn');
    await generateBtn.click();

    const startBtn = page.getByTestId('start-btn');
    await startBtn.click();

    const resultCard = page.locator('[data-test="result-card"]').first();
    await expect(resultCard).toBeVisible({ timeout: 15000 });

    // Check that result contains ordered list
    const orderedList = resultCard.locator('ol');
    await expect(orderedList).toBeVisible();

    // Should have 10 horses in results
    const listItems = resultCard.locator('li');
    await expect(listItems).toHaveCount(10);
  });

  test('race track shows empty state initially', async ({ page }) => {
    await expect(page.locator('[data-test="empty-message"]').filter({ hasText: 'Track is empty' })).toBeVisible();
  });

  test('program shows empty state initially', async ({ page }) => {
    await expect(page.locator('[data-test="empty-message"]').filter({ hasText: 'No schedule generated' })).toBeVisible();
  });

  test('results show empty state initially', async ({ page }) => {
    await expect(page.locator('[data-test="results-empty"]')).toBeVisible();
    await expect(page.locator('[data-test="results-empty"]')).toContainText('Waiting for results');
  });
});
