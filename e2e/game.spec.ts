import { test, expect } from '@playwright/test';

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

  
    const winnerName = page.locator('[data-test="result-winner"]').first();
    await expect(winnerName).not.toHaveText('');


    await expect(startBtn).toBeEnabled();
    await expect(startBtn).toHaveText('Start Race');
  });
});