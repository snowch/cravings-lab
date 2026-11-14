import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('core screens have no serious accessibility violations', async ({page}) => {
  for (const route of ['home','check-in','tools','tool/notice','experiments','reflect','learn','lesson/craving-habit-control','lesson/hunger-and-restriction','support','privacy']) {
    await page.goto('/#'+route);
    const result = await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
    expect(result.violations, route).toEqual([]);
  }
  await page.goto('/');
  await page.screenshot({path:`test-results/home-${test.info().project.name}.png`,fullPage:true});
});
