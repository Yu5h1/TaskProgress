// Run with `python tests/serve_card_reorder.py --next-marker`, never a registered scope.
export const url='http://127.0.0.1:8021/?scope=web-ui-pilot-test&dev=none';
export const ready=`!!document.querySelector('.item-next-capsule')`;
export async function run(page,evidence,{scheme}) {
  // Each scheme starts fresh; text a user has already opened stays open by design.
  await page.send('Page.reload',{ignoreCache:true});
  await page.until(ready);
  const check=(name,ok)=>evidence.check(`${scheme}: ${name}`,ok);
  const marker=()=>page.evaluate(`fetch('/reports/web-ui-pilot-test/report.json',{cache:'no-store'}).then(r=>r.json()).then(r=>r.next)`);
  const owners=selector=>page.evaluate(`[...document.querySelectorAll(${JSON.stringify(selector)})].map(n=>n.closest('[data-card-id]').dataset.cardId)`);
  const order=card=>page.evaluate(`[...document.querySelectorAll('#task-${card}-pending_items > li')].map(n=>n.dataset.reorderId)`);
  const setNext=async card=>{
    await page.evaluate(`document.querySelector('#item-${card}--work').scrollIntoView({block:'center',behavior:'instant'})`);
    await page.evaluate(`document.querySelector('#item-${card}--work').focus()`);
    await page.until(`document.activeElement?.id==='item-${card}--work'`);
    await page.send('Input.dispatchKeyEvent',{type:'keyDown',key:'Enter',code:'Enter',windowsVirtualKeyCode:13,modifiers:8});
    await page.send('Input.dispatchKeyEvent',{type:'keyUp',key:'Enter',code:'Enter',windowsVirtualKeyCode:13,modifiers:8});
  };
  check('only the owning card shows the Next capsule',JSON.stringify(await owners('.item-next-capsule'))==='["next"]');
  check('only the owning row receives Next emphasis',JSON.stringify(await owners('.editor-item-row.is-next'))==='["next"]');
  check('Next is lifted only inside its owner',JSON.stringify(await order('next'))==='["work","first"]' && JSON.stringify(await order('b'))==='["first","work"]');
  await page.evaluate(`document.querySelector('[data-card-id="b"]').scrollIntoView({block:'center',behavior:'instant'})`);
  await page.until(`document.querySelector('#item-b--work .expandable-text__toggle:not([hidden])')?.getAttribute('aria-expanded')==='false'`);
  await page.evaluate(`document.querySelector('[data-card-id="next"]').scrollIntoView({block:'center',behavior:'instant'})`);
  await page.until(`document.querySelector('#item-next--work .expandable-text__toggle:not([hidden])')?.getAttribute('aria-expanded')==='true'`);
  check('only the owning same-ID row automatically expands long text',true);
  await evidence.screenshot(`${scheme}-single-next-owner`);
  await setNext('b');
  await page.until(`fetch('/reports/web-ui-pilot-test/report.json',{cache:'no-store'}).then(r=>r.json()).then(r=>r.next?.task_id==='b' && r.next?.item_id==='work')`);
  check('setting a same-ID row in another card moves Next instead of clearing it',(await marker())?.task_id==='b');
  await page.until(`document.querySelectorAll('.item-next-capsule').length===1 && !!document.querySelector('[data-card-id="b"] .item-next-capsule')`);
  check('previous owner returns to ordinary order',JSON.stringify(await order('next'))==='["first","work"]' && JSON.stringify(await order('b'))==='["work","first"]');
  await setNext('b');
  await page.until(`fetch('/reports/web-ui-pilot-test/report.json',{cache:'no-store'}).then(r=>r.json()).then(r=>!r.next)`);
  await page.until(`!document.querySelector('.item-next-capsule')`);
  check('setting the actual Next row again clears all Next projections',(await owners('.editor-item-row.is-next')).length===0);
  await setNext('next');
  await page.until(`fetch('/reports/web-ui-pilot-test/report.json',{cache:'no-store'}).then(r=>r.json()).then(r=>r.next?.task_id==='next')`);
}
