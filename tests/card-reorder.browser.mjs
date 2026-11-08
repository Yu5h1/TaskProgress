// verify-web feature contract; run only against tests/serve_card_reorder.py.
export const url = 'http://127.0.0.1:8021/?scope=web-ui-pilot-test&dev=none';
export const ready = `document.querySelector('[data-card-id="a"]')?.dataset.reorderSortable === 'true'`;

export async function run(page, evidence, { scheme }) {
  const raw = () => page.evaluate(`fetch('/reports/web-ui-pilot-test/report.json',{cache:'no-store'}).then(r=>r.json())`);
  const ids = data => data.tasks.map(task => task.id);
  const original = await raw();
  const check = (name, ok) => evidence.check(`${scheme}: ${name}`, ok);
  const drag = async (source, target, after = false) => {
    await page.evaluate(`document.querySelector('[data-card-id="${source}"]').scrollIntoView({block:'center',behavior:'instant'})`);
    await page.evaluate(`new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)))`);
    const points=await page.evaluate(`(() => {
      const source=document.querySelector('[data-card-id="${source}"]');
      const target=document.querySelector('[data-card-id="${target}"]');
      if(!source||!target)throw new Error('Missing drag source or target');
      const start=source.getBoundingClientRect(), end=target.getBoundingClientRect();
      const x=start.right-2, y=start.top+start.height/2;
      const hit=document.elementFromPoint(x,y);
      if(!hit || !source.contains(hit) || hit.closest('button,a,input,textarea,select,label,[contenteditable],h1,h2,h3,p,span,strong,code,dt,dd,li,svg'))throw new Error('Drag origin must be card whitespace');
      return {x,y,targetX:end.left+8,targetY:end.top+end.height*${after ? '.75' : '.25'}};
    })()`);
    await page.send('Input.dispatchMouseEvent',{type:'mouseMoved',x:points.x,y:points.y});
    await page.send('Input.dispatchMouseEvent',{type:'mousePressed',x:points.x,y:points.y,button:'left',clickCount:1});
    await page.send('Input.dispatchMouseEvent',{type:'mouseMoved',x:points.x-12,y:points.y,button:'left',buttons:1});
    await page.send('Input.dispatchMouseEvent',{type:'mouseMoved',x:points.x-24,y:points.y,button:'left',buttons:1});
    for(const step of [0,1,2]) await page.send('Input.dispatchMouseEvent',{type:'mouseMoved',x:points.targetX+step,y:points.targetY+step,button:'left',buttons:1});
    const compatible=await page.evaluate(`document.querySelector('[data-card-id="${source}"]').getAttribute('data-reorder-group')===document.querySelector('[data-card-id="${target}"]').getAttribute('data-reorder-group')`);
    let preview=null;
    for(let attempt=0;attempt<10;attempt++) {
      await page.send('Input.dispatchMouseEvent',{type:'mouseMoved',x:points.targetX+2,y:points.targetY+2+(attempt%2),button:'left',buttons:1});
      await new Promise(resolve=>setTimeout(resolve,40));
      preview=await page.evaluate(`document.querySelector('[data-card-id="${target}"]').getAttribute('data-reorder-over')`);
      if(preview||!compatible)break;
    }
    if(source==='b'&&target==='a') {
      evidence.check(`${scheme}: native drop preview draws the horizontal line`,await page.evaluate(`(() => { const row=document.querySelector('[data-card-id="a"]'), line=getComputedStyle(row,'::before'); return row.classList.contains('card-drop-before')&&parseFloat(line.height)===3&&line.content!=='none'&&line.backgroundColor!=='rgba(0, 0, 0, 0)'; })()`));
      await evidence.screenshot(`${scheme}-native-drop-preview`);
    }
    await page.send('Input.dispatchMouseEvent',{type:'mouseReleased',x:points.targetX+2,y:points.targetY+2,button:'left',clickCount:1});
    return preview;
  };
  const waitOrder = order => page.until(`fetch('/reports/web-ui-pilot-test/report.json',{cache:'no-store'}).then(r=>r.json()).then(r=>JSON.stringify(r.tasks.map(t=>t.id))===${JSON.stringify(JSON.stringify(order))})`);
  const mode = value => page.evaluate(`document.querySelector('.icon-choice[aria-label="排序"]').dispatchEvent(new CustomEvent('choice-request',{detail:{id:${JSON.stringify(value)}}}))`);
  const history = key => page.evaluate(`document.dispatchEvent(new KeyboardEvent('keydown',{key:${JSON.stringify(key)},ctrlKey:true,bubbles:true,cancelable:true}))`);
  const rendered = () => page.evaluate(`[...document.querySelectorAll('[data-card-id]')].filter(row=>!row.hidden).map(row=>row.dataset.cardId)`);
  const waitRendered = order => page.until(`JSON.stringify([...document.querySelectorAll('[data-card-id]')].filter(row=>!row.hidden).map(row=>row.dataset.cardId))===${JSON.stringify(JSON.stringify(order))}`);
  const reload = async () => { await page.send('Page.reload',{ignoreCache:true}); await page.until(ready); await page.setScheme(scheme); };

  // A new browser page has forward mode and no view-only order. Use real public UI events.
  await mode('forward');
  await page.until(ready);
  await page.evaluate(`document.querySelector('.card-toolbar-icon[aria-label="全部收合"]')?.click()`);
  check('same-priority cards with different child priorities retain source order',await page.evaluate(`(() => { const rows=[...document.querySelectorAll('[data-card-id]')].map(row=>row.dataset.cardId); return rows.indexOf('a')<rows.indexOf('b') && document.querySelector('[data-card-id="a"]').dataset.reorderGroup===document.querySelector('[data-card-id="b"]').dataset.reorderGroup; })()`));
  check('forward dragging enabled without corner grips while Next stays fixed', await page.evaluate(`document.querySelector('[data-card-id="b"]').dataset.reorderSortable === 'true' && !document.querySelector('.replica-card-grip') && document.querySelector('[data-card-id="next"]').dataset.reorderSortable === 'false'`));
  await page.click('[data-card-id="urgent"] .card-pin');
  check('pinned card cannot be dragged', await page.evaluate(`document.querySelector('[data-card-id="urgent"]').dataset.reorderSortable==='false' && !document.querySelector('[data-card-id="urgent"] .replica-card-grip')`));
  await page.click('[data-card-id="urgent"] .card-pin');
  await page.evaluate(`document.querySelector('.icon-choice[aria-label="可見性"]').dispatchEvent(new CustomEvent('choice-request',{detail:{id:'enabled'}}))`);
  await page.until(`!!document.querySelector('[data-card-id="hidden"] .card-visibility-toggle')`);
  await page.evaluate(`(() => { const row=document.querySelector('[data-card-id="hidden"]'); if(!row.hidden) row.querySelector('.card-visibility-toggle').click(); })()`);
  await page.until(`document.querySelector('[data-card-id="hidden"]').hidden`);
  check('same-level drag previews an insertion', await drag('b','a') === 'before');
  const moved=['urgent','b','hidden','a','next','low'];
  await waitOrder(moved);
  const written=await raw();
  check('source order saved, hidden slot and all card fields preserved', JSON.stringify(ids(written))===JSON.stringify(moved) && written.tasks.every(task=>JSON.stringify(task)===JSON.stringify(original.tasks.find(before=>before.id===task.id)))) ;
  await page.until(`document.querySelector('[data-card-id="b"]').dataset.reorderSortable === 'true'`);
  check('different priority has no drop preview', await drag('b','low') === null);
  await new Promise(resolve=>setTimeout(resolve,180));
  check('different priority does not write', JSON.stringify(await raw())===JSON.stringify(written));
  await history('z'); await waitOrder(ids(original));
  await history('y'); await waitOrder(moved);
  check('preview source move supports Undo and Redo', true);
  await reload();
  await waitRendered(['next','urgent','b','a','low']);
  check('reload uses persisted source order', true);
  await evidence.screenshot(`${scheme}-forward-source-order`);

  // Free mode is a temporary presentation; ignore any legacy saved custom order.
  const saved=await raw();
  await mode('free');
  await page.until(`document.querySelector('.icon-choice[aria-label="排序"]').value === 'free'`);
  await drag('low','b');
  await waitRendered(['next','urgent','low','b','a']);
  check('free move does not write source', JSON.stringify(await raw())===JSON.stringify(saved));
  await page.evaluate(`(() => { const key=Object.keys(localStorage).find(key=>key.startsWith('taskprogress.cards.report.v1:') && key.endsWith(':mode')); localStorage.setItem(key.slice(0,-5),JSON.stringify(['low','a','b','hidden','urgent','next'])); })()`);
  // Reload while free: the old browser-only order must no longer participate.
  await page.send('Page.reload',{ignoreCache:true});
  await page.until(`document.querySelector('.icon-choice[aria-label="排序"]')?.value === 'free'`);
  await waitRendered(['next','urgent','b','a','low']);
  check('free ordering resets on reload and ignores legacy localStorage order', true);

  await mode('forward'); await page.until(ready);
  await page.click('.view-mode-toggle');
  await page.until(`!!document.querySelector('.task-title-input') && !!document.querySelector('button.edit-mode-button[aria-pressed]')`);
  await page.evaluate(`(() => { const button=document.querySelector('button.edit-mode-button[aria-pressed]'); if(button.getAttribute('aria-pressed')!=='true')button.click(); })()`);
  await page.until(`document.querySelector('button.edit-mode-button[aria-pressed]')?.getAttribute('aria-pressed')==='true'`);
  await drag('a','b');
  await waitRendered(['next','urgent','a','b','low']);
  check('cautious mode stages order without writing', JSON.stringify(await raw())===JSON.stringify(saved));
  await history('z'); await waitRendered(['next','urgent','b','a','low']);
  await history('y'); await waitRendered(['next','urgent','a','b','low']);
  await page.click('.edit-discard-button');
  await waitRendered(['next','urgent','b','a','low']);
  check('draft Undo, Redo and discard preserve source', JSON.stringify(await raw())===JSON.stringify(saved));
  await drag('a','b'); await waitRendered(['next','urgent','a','b','low']);
  await page.click('.edit-save-button'); await waitOrder(ids(original));
  check('explicit save commits draft source order without changing priority', (await raw()).tasks.every(task=>JSON.stringify(task)===JSON.stringify(original.tasks.find(before=>before.id===task.id))));
  const savedOriginal=await raw(), drafts=[];
  for (const title of ['Draft first','Draft second']) {
    await page.click('#task-add-shell .task-add-trigger');
    await page.until(`!!document.querySelector('#task-add-shell form')`);
    await page.evaluate(`(() => {
      const form=document.querySelector('#task-add-shell form');
      form.querySelector('[name="title"]').value=${JSON.stringify(title)};
      form.querySelector('[name="summary"]').value='Temporary draft';
      form.querySelector('[name="priority"]').value='2';
      form.requestSubmit();
    })()`);
    await page.until(`[...document.querySelectorAll('[data-card-id]')].some(row=>row.querySelector('.task-title-input')?.value===${JSON.stringify(title)})`);
    drafts.push(await page.evaluate(`[...document.querySelectorAll('[data-card-id]')].find(row=>row.querySelector('.task-title-input')?.value===${JSON.stringify(title)}).dataset.cardId`));
  }
  check('unsaved same-level cards can be dragged in cautious mode', await drag(drafts[1],drafts[0])==='before');
  await page.until(`(() => { const rows=[...document.querySelectorAll('[data-card-id]')].map(row=>row.dataset.cardId); return rows.indexOf(${JSON.stringify(drafts[1])})<rows.indexOf(${JSON.stringify(drafts[0])}); })()`);
  await page.click('.edit-discard-button');
  await page.until(`document.querySelectorAll('[data-card-id]').length===6`);
  check('discarding new-card reorder leaves original file unchanged',JSON.stringify(await raw())===JSON.stringify(savedOriginal));
  await page.click('.view-mode-toggle');
  await page.until(`!document.querySelector('.task-title-input')`);
  await page.setScheme(scheme);
  await evidence.screenshot(`${scheme}-saved-source-order`);
}
