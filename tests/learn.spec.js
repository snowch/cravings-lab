import { test, expect } from '@playwright/test';
import { lessons } from '../lessons.js';
import AxeBuilder from '@axe-core/playwright';

test('learn path explains each concept, gives feedback, and links to practice', async ({page}) => {
  await page.goto('/');
  await page.getByRole('link',{name:'Explore the lessons'}).click();
  await expect(page.getByRole('link',{name:'Read lesson'})).toHaveCount(6);
  await page.getByRole('link',{name:'Read lesson'}).first().click();
  for (const [i,lesson] of lessons.entries()) {
    await expect(page.getByRole('heading',{level:1})).toHaveText(lesson.title);
    await expect(page.locator('nav a[aria-current=page]')).toHaveText('Learn');
    await expect(page).toHaveTitle(lesson.title+' · Cravings Lab');
    const wrongIndex=(lesson.correct+1)%lesson.answers.length;
    await page.getByRole('button',{name:lesson.answers[wrongIndex],exact:true}).click();
    await expect(page.locator('#lesson-feedback')).toContainText('Consider another perspective.');
    await page.getByRole('button',{name:lesson.answers[lesson.correct],exact:true}).click();
    await expect(page.locator('#lesson-feedback')).toContainText('That fits the idea.');
    await expect(page.locator('#lesson-feedback')).toContainText(lesson.explanation);
    await expect(page.getByRole('link',{name:lesson.action,exact:true})).toHaveAttribute('href',lesson.href);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
    if(i<lessons.length-1) await page.getByRole('link',{name:'Next lesson'}).click();
  }
  const result=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
  expect(result.violations).toEqual([]);
  await page.getByRole('link',{name:'Previous lesson'}).click();
  await expect(page.getByRole('heading',{level:1})).toHaveText(lessons[4].title);
  await page.goto('/#lesson/thoughts-and-choice');
  await page.getByRole('link',{name:'Try cognitive defusion',exact:true}).click();
  await expect(page.getByRole('heading',{name:'Catch the thought'})).toBeVisible();
});

test('support stays directly accessible and practice links explain the ideas', async ({page}) => {
  await page.goto('/#tools');
  await page.getByRole('link',{name:'Learn the idea first'}).nth(1).click();
  await expect(page.getByRole('heading',{level:1})).toHaveText('A thought is not an instruction');
  await page.getByRole('link',{name:'Support',exact:true}).click();
  await expect(page.getByRole('heading',{name:'When to speak to someone'})).toBeVisible();
  await expect(page.getByRole('heading',{name:'Sources & scope'})).toBeVisible();
});
