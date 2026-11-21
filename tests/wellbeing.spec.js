import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {labs} from '../shared/content.js';
import {add32} from '../shared/model.js';
const slugs=Object.keys(labs);
const go=(page,slug,hash='')=>page.goto('/'+slug+'/'+hash);
async function plan(page,slug,goal='A personally useful goal'){
 await go(page,slug,'#plan');
 for(const [name,value]of Object.entries({goal,cue:'When a feasible window begins',action:'Take the first small step',finish:'Inspect a specific result',restart:'Resume at the saved place'}))await page.locator('#'+name).fill(value);
 await page.getByRole('button',{name:'Keep this plan',exact:true}).click();
}
test('hub has eight real lab addresses and carry model is exact',async({page})=>{
 await page.goto('/');await expect(page.getByRole('heading',{name:/Small changes/})).toBeVisible();
 for(const slug of ['cravings',...slugs])await expect(page.locator('h2 a[href="'+slug+'/"]')).toHaveCount(1);
 expect(add32('0xFFFFFFFF','1')).toEqual({result:'0x00000000',carry:1,zero:1});expect(add32('0','0')).toEqual({result:'0x00000000',carry:0,zero:1});expect(()=>add32('0x100000000','1')).toThrow();
 await go(page,'starting-and-returning','#example');await page.getByRole('button',{name:'Run this addition'}).click();await expect(page.locator('#addition-result')).toHaveText('Result 0x00000000 · Zero 1 · Carry 1');
 await page.locator('#input-a').fill('0');await page.locator('#input-b').fill('0');await page.getByRole('button',{name:'Run this addition'}).click();await expect(page.locator('#addition-result')).toHaveText('Result 0x00000000 · Zero 1 · Carry 0');
 await page.goto('/starting-and-returning/checklist.html');await expect(page.getByRole('checkbox')).toHaveCount(7);
});
for(const slug of slugs){
 test(slug+': lessons, practice, layout and accessibility',async({page})=>{
  test.setTimeout(120000);
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await go(page,slug);await expect(page.getByRole('heading',{name:labs[slug].title,exact:true})).toBeVisible();
  for(const width of [320,390,768,1440]){
   await page.setViewportSize({width,height:950});
   for(const route of ['#home','#plan','#practice','#log','#reflect','#data']){
    await go(page,slug,route);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),slug+' '+route+' '+width).toBe(true);
   }
  }
  await page.setViewportSize(test.info().project.name==='mobile'?{width:390,height:844}:{width:1440,height:1000});
  for(let i=0;i<labs[slug].lessons.length;i++){
   const l=labs[slug].lessons[i];await go(page,slug,'#lesson/'+i);await expect(page.getByRole('heading',{name:l.title,exact:true})).toBeVisible();
   for(let n=0;n<3;n++){await page.getByRole('radio').nth(n).check();await page.getByRole('button',{name:'Check your reasoning'}).click();await expect(page.locator('#answer-feedback')).toHaveText(l.feedback[n]);}
   await page.locator('details summary').click();await expect(page.locator('details a')).toHaveCount(l.sources.length);
  }
  for(const route of ['#home','#plan','#log','#reflect','#data','#lesson/0']){
   await go(page,slug,route);const r=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();expect(r.violations,slug+' '+route).toEqual([]);
  }
  expect(errors).toEqual([]);
 });
}
test('tab-only, opt-in saving, export, escaping and scope isolation',async({page})=>{
 await plan(page,'focus','Focus without hidden storage');await page.getByRole('link',{name:'Focus and Attention home',exact:true}).click();await expect(page.getByRole('heading',{name:'Focus and Attention',exact:true})).toBeVisible();await go(page,'focus','#plan');await expect(page.locator('#goal')).toHaveValue('Focus without hidden storage');expect(await page.evaluate(()=>localStorage.length)).toBe(0);
 await go(page,'focus','#data');await page.getByRole('button',{name:'Save on this device',exact:true}).click();
 await go(page,'focus','#log');await page.locator('#opportunity').selectOption('Available');await page.locator('#started').selectOption('Yes');await page.locator('#finished').selectOption('Yes');await page.locator('#useful').selectOption('Unsure');await page.locator('#note').fill('<img src=x onerror=alert(1)>');await page.getByRole('button',{name:'Keep this session'}).click();
 await expect(page.getByText('<img src=x onerror=alert(1)>',{exact:true})).toBeVisible();await expect(page.locator('main img')).toHaveCount(0);
 await page.reload();await expect(page.getByText('<img src=x onerror=alert(1)>',{exact:true})).toBeVisible();
 const focus=await page.evaluate(()=>localStorage.getItem('wellbeing-lab-focus-v1'));
 await page.evaluate(()=>localStorage.setItem('cravings-lab-v1',JSON.stringify({version:1,entries:[{id:'legacy',created:'2026-01-01',hunger:4}],experiments:[],reviews:[]})));
 await go(page,'learning','#data');await page.getByRole('button',{name:'Save on this device',exact:true}).click();
 await plan(page,'learning','Learn a new distinction');await go(page,'learning','#data');
 const download=page.waitForEvent('download');await page.getByRole('button',{name:'Export this lab’s entries'}).click();const f=await download;const stream=await f.createReadStream();const chunks=[];for await(const c of stream)chunks.push(c);const exported=JSON.parse(Buffer.concat(chunks).toString());expect(exported.lab).toBe('learning');expect(exported.plan.goal).toBe('Learn a new distinction');
 await page.getByRole('button',{name:'Delete this lab’s entries',exact:true}).click();await page.getByRole('button',{name:'Keep my entries'}).click();expect(await page.evaluate(()=>localStorage.getItem('wellbeing-lab-learning-v1'))).not.toBeNull();
 await page.getByRole('button',{name:'Delete this lab’s entries',exact:true}).click();await page.locator('dialog').getByRole('button',{name:'Delete this lab’s entries',exact:true}).click();
 await expect(page.getByRole('status')).toHaveText('This lab’s entries were cleared. Other labs are unchanged.');expect(await page.evaluate(()=>localStorage.getItem('wellbeing-lab-learning-v1'))).toBeNull();expect(await page.evaluate(()=>localStorage.getItem('wellbeing-lab-focus-v1'))).toBe(focus);
 await page.goto('/cravings/#reflect');await expect(page.getByText('Hunger: 4/10 · Urge: Not recorded',{exact:true})).toBeVisible();
 await go(page,'focus','#data');await page.getByRole('button',{name:'Switch to tab-only mode',exact:true}).click();await expect(page.getByRole('heading',{name:'Tab-only by default'})).toBeVisible();expect(await page.evaluate(()=>localStorage.getItem('wellbeing-lab-focus-v1'))).toBeNull();await go(page,'focus','#reflect');await expect(page.getByText('<img src=x onerror=alert(1)>',{exact:true})).toBeVisible();await page.reload();await expect(page.getByRole('heading',{name:'No sessions recorded yet'})).toBeVisible();
});
test('six pairs, unavailable opportunities, editing and separate comparisons',async({page})=>{
 await go(page,'starting-and-returning','#experiment');await page.getByRole('button',{name:'Create six paired sessions'}).click();
 const rows=page.locator('.schedule li');await expect(rows).toHaveCount(12);
 for(let i=0;i<6;i++){const pair=[await rows.nth(i*2).innerText(),await rows.nth(i*2+1).innerText()];expect(pair.filter(x=>x.includes('Question prompt'))).toHaveLength(1);expect(pair.filter(x=>x.includes('Plain instruction'))).toHaveLength(1);}
 await rows.first().getByRole('link').click();const condition=await page.locator('input[name=condition]').inputValue();await page.locator('#opportunity').selectOption('Unavailable');await expect(page.locator('#started')).toBeDisabled();await page.getByRole('button',{name:'Keep this session'}).click();
 await expect(page.locator('table tbody')).toContainText('0 feasible; 1 unavailable');await expect(page.locator('table tbody')).toContainText('Not available');
 await page.getByRole('link',{name:'Edit this session',exact:true}).click();await page.locator('#opportunity').selectOption('Available');await page.locator('#started').selectOption('Within five minutes');await page.locator('#finished').selectOption('Yes');await page.locator('#useful').selectOption('Yes');await page.locator('#note').fill('First comparison result');await page.getByRole('button',{name:'Update this session'}).click();
 await expect(page.locator('.entry')).toHaveCount(1);await expect(page.locator('table tbody')).toContainText('1 feasible; 0 unavailable');await expect(page.locator('table tbody')).toContainText('1 / 1');
 await go(page,'starting-and-returning','#experiment');await page.getByRole('button',{name:'Start a new comparison'}).click();await go(page,'starting-and-returning','#reflect');await expect(page.getByRole('heading',{name:'No sessions recorded yet'})).toBeVisible();
 const options=page.locator('#comparison-view option');await expect(options).toHaveCount(3);await page.locator('#comparison-view').selectOption({index:0});await expect(page.getByText('First comparison result',{exact:true})).toBeVisible();
});
test('unavailable storage and timer do not fabricate saved or finished sessions',async({page})=>{
 await page.addInitScript(()=>{Object.defineProperty(window,'localStorage',{get(){throw new DOMException('Unavailable','SecurityError');}});});
 await plan(page,'starting-and-returning');await page.getByRole('button',{name:'Start timer',exact:true}).click();await expect(page.locator('#session-time')).toHaveText(/14:|15:/);await page.getByRole('button',{name:'Pause timer',exact:true}).click();
 await go(page,'starting-and-returning','#reflect');await expect(page.getByRole('heading',{name:'No sessions recorded yet'})).toBeVisible();
 await go(page,'starting-and-returning','#data');await page.getByRole('button',{name:'Save on this device',exact:true}).click();await expect(page.getByRole('status')).toHaveText('This browser could not save your entries. They remain in this tab.');
});
