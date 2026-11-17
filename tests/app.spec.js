import { test, expect } from '@playwright/test';

test('tab-only check-in, safe rendering, and supportive feedback', async ({page}) => {
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('/');
  await expect(page.getByRole('heading',{name:'Explore your cravings'})).toBeVisible();
  await page.getByRole('link',{name:'Check in',exact:true}).click();
  await page.getByLabel('How physically hungry do you feel?').selectOption('8');
  await page.getByText('Mood, eating and notes').click();
  await page.getByLabel('Anything else you noticed?').fill('<img src=x onerror=alert(1)>');
  await page.getByRole('button',{name:'Save check-in'}).click();
  await expect(page.getByText(/you can eat something satisfying straight away/)).toBeVisible();
  await page.getByRole('link',{name:'View your check-ins'}).click();
  await expect(page.getByText('<img src=x onerror=alert(1)>',{exact:true})).toBeVisible();
  await expect(page.locator('main img')).toHaveCount(0);
  await page.reload();
  await expect(page.getByRole('heading',{name:'No check-ins or reflections yet'})).toBeVisible();
  expect(errors).toEqual([]);
});

test('a check-in can omit ratings and a keyboard skip keeps draft details', async ({page}) => {
  await page.goto('/#check-in');
  const hunger=page.getByLabel('How physically hungry do you feel?');
  const urge=page.getByLabel('How strong is the urge?');
  await expect(hunger).toHaveValue('');
  await expect(urge).toHaveValue('');
  await page.getByRole('button',{name:'Save check-in'}).click();
  await expect(page.locator('#check-in-feedback')).toHaveText('Choose a hunger or urge rating, or add a detail, before saving.');
  await page.getByText('Watching TV',{exact:true}).click();
  await page.getByText('Mood, eating and notes').click();
  const note=page.getByLabel('Anything else you noticed?');
  await note.fill('I noticed the start of the programme.');
  await page.getByRole('link',{name:'Skip to content'}).press('Enter');
  await expect(page).toHaveURL(/#check-in$/);
  await expect(page.locator('main')).toBeFocused();
  await expect(page.getByRole('radio',{name:'Watching TV'})).toBeChecked();
  await expect(note).toHaveValue('I noticed the start of the programme.');
  await page.getByRole('button',{name:'Save check-in'}).click();
  await page.getByRole('link',{name:'View your check-ins'}).click();
  await expect(page.getByText('Hunger: Not recorded · Urge: Not recorded',{exact:true})).toBeVisible();
  await expect(page.getByText('I noticed the start of the programme.',{exact:true})).toBeVisible();
});

test('older numeric ratings and new missing ratings survive reload', async ({page}) => {
  await page.addInitScript(()=>{
    const key='cravings-lab-v1';
    if (!localStorage.getItem(key)) {
      localStorage.setItem(key, JSON.stringify({
        version: 1,
        entries: [{id:'older', created:'2026-10-01T12:00:00Z', hunger:0, craving:5}],
        experiments: [],
        reviews: []
      }));
    }
  });
  await page.goto('/#check-in');
  await page.getByLabel('How strong is the urge?').selectOption('0');
  await page.getByRole('button',{name:'Save check-in'}).click();
  await page.getByRole('link',{name:'View your check-ins'}).click();
  await page.reload();
  await expect(page.getByText('Hunger: 0/10 · Urge: 5/10',{exact:true})).toBeVisible();
  await expect(page.getByText('Hunger: Not recorded · Urge: 0/10',{exact:true})).toBeVisible();
});

test('device saving, export, switch to tab-only, and deletion', async ({page}) => {
  await page.goto('/');
  await page.getByRole('link',{name:'Device saving options'}).click();
  await page.getByRole('button',{name:'Save on this device'}).click();
  await page.getByRole('link',{name:'Check in',exact:true}).click();
  await page.getByText('Mood, eating and notes').click();
  await page.getByText('Hard to stop',{exact:true}).click();
  await page.getByRole('button',{name:'Save check-in'}).click();
  await expect(page.getByRole('link',{name:'Find support',exact:true})).toBeVisible();
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
  await page.goto('/#reflect');await expect(page.getByRole('heading',{name:'No check-ins or reflections yet'})).toBeVisible();
});

test('experiment lifecycle and reflection', async ({page}) => {
  await page.goto('/#privacy');
  await page.getByRole('button',{name:'Save on this device'}).click();
  await page.getByRole('link',{name:'Experiments',exact:true}).click();
  await page.getByRole('button',{name:/Make time for a regular meal/}).click();
  await expect(page.getByLabel('What small change will you try?')).toHaveValue(/satisfying lunch/);
  await page.getByRole('button',{name:'Start this experiment'}).click();
  await expect(page.getByText('Current experiment')).toBeVisible();
  const review=page.getByLabel('What did you notice?');
  const plan=page.getByLabel('What small change will you try?');
  const edit=page.getByText('Edit plan',{exact:true});
  await review.fill('Review draft');
  await edit.press('Enter');
  await expect(plan).toHaveValue(/satisfying lunch/);
  await plan.fill('Make time for a satisfying breakfast.');
  await page.getByRole('button',{name:'Save plan'}).click();
  await expect(edit).toBeFocused();
  await expect(review).toHaveValue('Review draft');
  await expect(page.locator('#active-plan')).toHaveText('Make time for a satisfying breakfast.');
  await edit.click();
  await plan.fill('Uncommitted change');
  await page.getByRole('button',{name:'Cancel',exact:true}).click();
  await edit.click();
  await expect(plan).toHaveValue('Make time for a satisfying breakfast.');
  await page.reload();
  await expect(page.locator('#active-plan')).toHaveText('Make time for a satisfying breakfast.');
  await review.fill('Lunch helped me feel more settled.');
  await page.getByRole('button',{name:'Save review and finish'}).click();
  await expect(page.getByText('Lunch helped me feel more settled.')).toBeVisible();
  await page.getByRole('button',{name:/Design my own experiment/}).click();
  await page.getByLabel('Experiment name').fill('A short break');
  await page.getByLabel('What small change will you try?').fill('Step outside after work.');
  await page.getByLabel('What would you like to notice?').fill('Whether I feel less stressed.');
  await page.getByRole('button',{name:'Start this experiment'}).click();
  await page.getByRole('button',{name:'Stop without a review'}).click();
  await expect(page.getByText('STOPPED',{exact:true})).toBeVisible();
  await page.getByRole('link',{name:'Support',exact:true}).click();
  await expect(page.locator('#announcement')).toBeEmpty();
});

test('guided practices and optional timer', async ({page}) => {
  await page.goto('/#tool/defusion');
  for(let i=0;i<2;i++) await page.getByRole('button',{name:'Continue'}).click();
  await page.getByRole('button',{name:'Reflect',exact:false}).click();
  await page.getByText('A little',{exact:true}).click();
  await page.getByRole('button',{name:'Save reflection',exact:true}).click();
  await expect(page.getByText('Felt helpful: A little')).toBeVisible();
  await expect(page.locator('#announcement')).toContainText('Practice reflection added to Reflect.');
  await page.getByLabel('What did you notice, and what could help next?').fill('A thought can stay while I choose.');
  await page.getByRole('button',{name:'Save reflection',exact:true}).click();
  await expect(page.getByText('A thought can stay while I choose.')).toBeVisible();
  await page.clock.install();
  await page.goto('/#tool/pause');
  await page.getByRole('button',{name:'Continue'}).click();
  const start=page.getByRole('button',{name:'Start timer',exact:true});
  const stop=page.getByRole('button',{name:'Stop timer',exact:true});
  await expect(stop).toBeHidden();
  await start.press('Enter');
  await expect(stop).toBeFocused();
  await expect(start).toBeHidden();
  await page.clock.runFor(1000);
  await expect(page.getByRole('timer')).toHaveText('0:59');
  await stop.press('Enter');
  await expect(start).toBeFocused();
  await expect(page.getByRole('timer')).toHaveText('1:00');
  await start.click();
  await page.clock.runFor(60000);
  await expect(page.getByRole('timer')).toHaveText('0:00');
  await expect(start).toBeFocused();
  await start.click();
  await page.getByRole('button',{name:'Continue'}).click();
  await expect(page.getByRole('heading',{name:'Choose what you want now'})).toBeVisible();
  await expect(page.getByRole('timer')).toHaveCount(0);
});

test('all routes fit viewport and work without storage', async ({page}) => {
  await page.addInitScript(()=>{
    const browserStorage = localStorage;
    browserStorage.setItem('cravings-lab-v1', JSON.stringify({
      version:1,
      entries:[{id:'older',created:'2026-10-01T12:00:00Z',note:'Inaccessible saved check-in'}],
      experiments:[],reviews:[]
    }));
    window.existingBrowserCopy = () => JSON.parse(browserStorage.getItem('cravings-lab-v1'));
    Object.defineProperty(window,'localStorage',{get(){throw new Error('Disabled');}});
  });
  for(const route of ['home','check-in','tools','experiments','reflect','learn','support','privacy']) {
    await page.goto('/#'+route);
    await expect(page.locator('main')).toBeVisible();
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  }
  await page.getByRole('button',{name:'Save on this device'}).click();
  await expect(page.locator('#announcement')).toContainText('Device storage is unavailable');
  await page.getByRole('link',{name:'Check in',exact:true}).click();
  await page.getByLabel('How strong is the urge?').selectOption('3');
  await page.getByRole('button',{name:'Save check-in'}).click();
  await page.getByRole('link',{name:'Your data',exact:true}).click();
  await page.getByRole('button',{name:'Delete all my data'}).click();
  await page.getByRole('button',{name:'Delete everything'}).click();
  await expect(page.locator('#announcement')).toContainText('Tab entries deleted. This app could not check for a saved copy.');
  expect((await page.evaluate(()=>window.existingBrowserCopy())).entries[0].note).toBe('Inaccessible saved check-in');
  await page.getByRole('link',{name:'Reflect',exact:true}).click();
  await expect(page.getByRole('heading',{name:'No check-ins or reflections yet'})).toBeVisible();
});

test('a failed write identifies the older saved copy and keeps recovery controls', async ({page}) => {
  await page.addInitScript(() => {
    const key = 'cravings-lab-v1';
    localStorage.setItem(key, JSON.stringify({
      version: 1,
      entries: [{id:'older', created:'2026-10-01T12:00:00Z', hunger:0, craving:5, note:'Earlier check-in'}],
      experiments: [],
      reviews: []
    }));
    const write = Storage.prototype.setItem;
    window.blockDeviceWrites = true;
    Storage.prototype.setItem = function(key, value) {
      if (window.blockDeviceWrites) throw new DOMException('Storage is full', 'QuotaExceededError');
      return write.call(this, key, value);
    };
  });
  const stored = () => page.evaluate(() => JSON.parse(localStorage.getItem('cravings-lab-v1')));
  await page.goto('/#reflect');
  await page.getByLabel('What did you notice, and what could help next?').fill('A reflection held in this tab');
  await page.getByRole('button',{name:'Save reflection',exact:true}).click();
  await expect(page.locator('#announcement')).toContainText('The saved copy may still show earlier entries.');
  await expect(page.getByText('A reflection held in this tab',{exact:true})).toBeVisible();
  expect((await stored()).reviews).toHaveLength(0);

  await page.getByRole('link',{name:'Your data',exact:true}).click();
  const retry = page.getByRole('button',{name:'Try saving again'});
  const disable = page.getByRole('button',{name:'Switch to tab-only mode'});
  await expect(disable).toBeVisible();
  await retry.click();
  await expect(page.locator('#announcement')).toHaveText('This browser could not update the saved copy.');
  await page.evaluate(() => { window.blockDeviceWrites = false; });
  await retry.click();
  expect((await stored()).reviews[0].note).toBe('A reflection held in this tab');
  await expect(retry).toHaveCount(0);

  await page.evaluate(() => { window.blockDeviceWrites = true; });
  await page.goto('/#reflect');
  await page.getByRole('button',{name:/Delete check-in/}).click();
  await expect(page.locator('#announcement')).toContainText('The saved copy may still show earlier entries.');
  await expect(page.getByText('Earlier check-in',{exact:true})).toHaveCount(0);
  expect((await stored()).entries).toHaveLength(1);
  await page.getByRole('link',{name:'Your data',exact:true}).click();
  await disable.click();
  expect(await stored()).toBeNull();
  await page.goto('/#reflect');
  await expect(page.getByText('A reflection held in this tab',{exact:true})).toBeVisible();
});
