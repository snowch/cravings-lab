import { test, expect } from '@playwright/test';

test('tab-only check-in, safe rendering, and supportive feedback', async ({page}) => {
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('/');
  await expect(page.getByRole('heading',{name:/A little more room/})).toBeVisible();
  await page.getByRole('link',{name:'Check in',exact:true}).click();
  await page.locator('#hunger').fill('8');
  await page.getByText('Add a little more context').click();
  await page.getByLabel('Anything else you noticed?').fill('<img src=x onerror=alert(1)>');
  await page.getByRole('button',{name:'Save check-in'}).click();
  await expect(page.getByText(/Eating something satisfying may/)).toBeVisible();
  await page.getByRole('link',{name:'See my reflections'}).click();
  await expect(page.getByText('<img src=x onerror=alert(1)>',{exact:true})).toBeVisible();
  await expect(page.locator('main img')).toHaveCount(0);
  await page.reload();
  await expect(page.getByRole('heading',{name:'A picture grows one moment at a time.'})).toBeVisible();
  expect(errors).toEqual([]);
});

test('device saving, export, switch to tab-only, and deletion', async ({page}) => {
  await page.goto('/');
  await page.getByRole('button',{name:'Save on this device'}).click();
  await page.getByRole('link',{name:'Check in',exact:true}).click();
  await page.getByText('Add a little more context').click();
  await page.getByText('Hard to stop',{exact:true}).click();
  await page.getByRole('button',{name:'Save check-in'}).click();
  await expect(page.getByRole('link',{name:'Explore support',exact:true})).toBeVisible();
  await page.goto('/#reflect');await page.reload();
  await expect(page.getByText('Some eating felt hard to stop.')).toBeVisible();
  await page.goto('/#privacy');
  const downloadPromise=page.waitForEvent('download');
  await page.getByRole('button',{name:'Export my data'}).click();
  const download=await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/^cravings-lab-.*\.json$/);
  const stream=await download.createReadStream();const chunks=[];for await(const chunk of stream) chunks.push(chunk);
  const data=JSON.parse(Buffer.concat(chunks).toString());expect(data.entries).toHaveLength(1);
  await page.getByRole('button',{name:'Switch to tab-only mode'}).click();
  expect(await page.evaluate(()=>localStorage.length)).toBe(0);
  await page.goto('/#reflect');await expect(page.getByText('Some eating felt hard to stop.')).toBeVisible();
  await page.goto('/#privacy');
  await page.getByRole('button',{name:'Delete all my data'}).click();
  await page.getByRole('button',{name:'Keep my data'}).click();
  await page.getByRole('button',{name:'Delete all my data'}).click();
  await page.getByRole('button',{name:'Delete everything'}).click();
  await page.goto('/#reflect');await expect(page.getByRole('heading',{name:'A picture grows one moment at a time.'})).toBeVisible();
});

test('experiment lifecycle and reflection', async ({page}) => {
  await page.goto('/#experiments');
  await page.getByRole('button',{name:/Make room for a regular meal/}).click();
  await page.getByRole('button',{name:'Start this experiment'}).click();
  await expect(page.getByText('YOUR CURRENT EXPERIMENT')).toBeVisible();
  await page.getByLabel('What have you noticed?').fill('Lunch helped me feel more settled.');
  await page.getByRole('button',{name:'Save & finish experiment'}).click();
  await expect(page.getByText('Lunch helped me feel more settled.')).toBeVisible();
  await page.getByRole('button',{name:/Design my own experiment/}).click();
  await page.getByLabel('Experiment name').fill('A short break');
  await page.getByLabel('What small change will you try?').fill('Step outside after work.');
  await page.getByLabel('What would you like to notice?').fill('Whether I feel less stressed.');
  await page.getByRole('button',{name:'Start this experiment'}).click();
  await page.getByRole('button',{name:'Stop without a review'}).click();
  await expect(page.getByText('STOPPED',{exact:true})).toBeVisible();
});

test('guided practices and optional timer', async ({page}) => {
  await page.goto('/#tool/defusion');
  for(let i=0;i<2;i++) await page.getByRole('button',{name:'Continue'}).click();
  await page.getByRole('button',{name:'Reflect',exact:false}).click();
  await page.getByText('A little',{exact:true}).click();
  await page.getByRole('button',{name:'Save reflection',exact:true}).click();
  await expect(page.getByText('Felt helpful: A little')).toBeVisible();
  await page.getByLabel('What have you learned, and what would support you next?').fill('A thought can stay while I choose.');
  await page.getByRole('button',{name:'Save reflection',exact:true}).click();
  await expect(page.getByText('A thought can stay while I choose.')).toBeVisible();
  await page.goto('/#tool/pause');
  await page.getByRole('button',{name:'Continue'}).click();
  await page.getByRole('button',{name:'Start optional timer'}).click();
  await expect(page.getByRole('button',{name:'Timer running'})).toBeDisabled();
  await page.getByRole('button',{name:'Continue'}).click();
  await expect(page.getByRole('heading',{name:'Decide deliberately'})).toBeVisible();
});

test('all routes fit viewport and work without storage', async ({page}) => {
  await page.addInitScript(()=>Object.defineProperty(window,'localStorage',{get(){throw new Error('Disabled');}}));
  for(const route of ['home','check-in','tools','experiments','reflect','learn','support','privacy']) {
    await page.goto('/#'+route);
    await expect(page.locator('main')).toBeVisible();
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  }
  await page.getByRole('button',{name:'Save on this device'}).click();
  await expect(page.getByRole('status')).toContainText('Device storage is unavailable');
});
