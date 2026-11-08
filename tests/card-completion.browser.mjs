// verify-web feature. Host: python tests/serve_card_reorder.py --completion
export const url='http://127.0.0.1:8021/?scope=web-ui-pilot-test&dev=none';
export const ready=`!!document.querySelector('[data-card-id="a"]') && !!document.querySelector('.view-mode-toggle:not([disabled])')`;
export async function run(page,evidence,{scheme}) {
  const check=(name,ok)=>evidence.check(`${scheme}: ${name}`,ok);
  const pin=()=>page.evaluate(`document.querySelector('[data-card-id="a"] .card-pin').getAttribute('aria-pressed')==='true'`);
  const raw=()=>page.evaluate(`fetch('/reports/web-ui-pilot-test/report.json',{cache:'no-store'}).then(r=>r.json())`);
  const mode=id=>page.evaluate(`document.querySelector('.icon-choice[aria-label="排序"]').dispatchEvent(new CustomEvent('choice-request',{detail:{id:${JSON.stringify(id)}}}))`);
  const reload=async()=>{await page.evaluate('window.completionReload=true');await page.send('Page.reload',{ignoreCache:true});await page.until(`!window.completionReload && document.readyState==='complete' && (${ready})`);};
  const waitStatus=status=>page.until(`fetch('/reports/web-ui-pilot-test/report.json',{cache:'no-store'}).then(r=>r.json()).then(r=>r.tasks.find(t=>t.id==='a').status===${JSON.stringify(status)})`);
  const edit=async()=>{await page.click('.view-mode-toggle');await page.until(`!!document.querySelector('[data-card-id="a"] .task-header-meta select')`);await page.evaluate(`(()=>{const b=document.querySelector('button.edit-mode-button');if(b.getAttribute('aria-pressed')!=='true')b.click()})()`);};
  const select='[data-card-id="a"] .task-header-meta select';
  const section=()=>page.evaluate(`(() => {const ids=[...document.querySelectorAll('[data-card-id]')].map(n=>n.dataset.cardId);return ids.indexOf('urgent')>ids.indexOf('low') && ids.indexOf('b')>ids.indexOf('low') && ids.indexOf('urgent')<ids.indexOf('b');})()`);
  await reload();
  await page.until(`!!document.querySelector('[data-card-id="pointer-finished"] .task-header-meta .status-success')`);
  await page.evaluate(`document.querySelectorAll('.card-pin[aria-pressed="true"]').forEach(n=>n.click())`);
  for(const id of ['forward','reverse','free']) {await mode(id);check(`${id} keeps completed cards below unfinished cards in source completion order`,await section());}
  await mode('forward');
  check('completed pointer cards also trail unfinished cards',await page.evaluate(`(()=>{const ids=[...document.querySelectorAll('[data-card-id]')].map(n=>n.dataset.cardId);return ids.indexOf('pointer-finished')>ids.indexOf('low');})()`));
  await page.click('[data-card-id="pointer-finished"] .card-pin');
  await page.evaluate(`(()=>{const key=Object.keys(localStorage).find(k=>k.includes('web-ui-pilot-test')&&k.endsWith(':completion'));const states=JSON.parse(localStorage.getItem(key));states['pointer-finished']=false;localStorage.setItem(key,JSON.stringify(states));})()`);
  await reload();
  await page.until(`!!document.querySelector('[data-card-id="pointer-finished"] .task-header-meta .status-success') && document.querySelector('[data-card-id="pointer-finished"] .card-pin').getAttribute('aria-pressed')==='false'`);
  check('observing a completed target clears its previous unfinished pin',true);
  await page.click('[data-card-id="pointer-finished"] .card-pin');await reload();
  await page.until(`!!document.querySelector('[data-card-id="pointer-finished"] .task-header-meta .status-success')`);
  check('explicit re-pin of a completed pointer survives reload',await page.evaluate(`document.querySelector('[data-card-id="pointer-finished"] .card-pin').getAttribute('aria-pressed')==='true'`));
  await page.click('[data-card-id="pointer-finished"] .card-pin');
  const delayedPointer=await page.send('Page.addScriptToEvaluateOnNewDocument',{source:`const originalFetch=window.fetch.bind(window);window.fetch=(input,options)=>String(input).includes('/reports/example/report.json')?new Promise(r=>setTimeout(r,1200)).then(()=>originalFetch(input,options)):originalFetch(input,options);`});
  await page.evaluate(`(()=>{const key=Object.keys(localStorage).find(k=>k.includes('web-ui-pilot-test')&&k.endsWith(':completion'));const states=JSON.parse(localStorage.getItem(key));states['pointer-finished']=false;localStorage.setItem(key,JSON.stringify(states));window.pointerNavigation=true;})()`);
  await page.send('Page.navigate',{url:url+'&pin=pointer-finished'});
  await page.until(`!window.pointerNavigation && location.search.includes('pin=pointer-finished') && !!document.querySelector('[data-card-id="pointer-finished"] .task-header-meta .status-success')`);
  check('explicit pointer URL pin waits for the target completion observation',await page.evaluate(`document.querySelector('[data-card-id="pointer-finished"] .card-pin').getAttribute('aria-pressed')==='true'`));
  check('completed pointers use the completed source-move group',await page.evaluate(`JSON.parse(document.querySelector('[data-card-id="pointer-finished"]').dataset.reorderGroup)[0]==='done'`));
  await page.send('Page.removeScriptToEvaluateOnNewDocument',{identifier:delayedPointer.identifier});
  await page.evaluate('window.pointerNavigation=true');await page.send('Page.navigate',{url});
  await page.until(`!window.pointerNavigation && !location.search.includes('pin=') && (${ready})`);
  await page.click('[data-card-id="pointer-finished"] .card-pin');
  await page.click('[data-card-id="urgent"] .completed-more');
  check('completed child rows retain source order regardless of priority',await page.evaluate(`JSON.stringify([...document.querySelectorAll('#task-urgent-completed_items > li')].map(n=>n.dataset.reorderId))==='["older","newer"]'`));
  await page.click('[data-card-id="a"] .card-pin');
  await edit(); await page.change(select,'done');
  check('unsaved completion keeps its pin and committed state',await pin() && (await raw()).tasks.find(t=>t.id==='a').status==='in_progress');
  await page.click('.edit-discard-button');
  check('discarding completion preserves the original pin',await pin());
  await page.change(select,'done');await page.click('.edit-save-button');await waitStatus('done');
  await page.until(`document.querySelector('[data-card-id="a"] .card-pin').getAttribute('aria-pressed')==='false'`);
  check('saving a completion clears its pin once',true);
  await page.click('.view-mode-toggle');
  await page.click('[data-card-id="a"] .card-pin');await mode('reverse');
  check('explicit re-pin of a completed card survives redraw',await pin());
  await reload();
  check('re-pinned completion survives reload',await pin());
  await edit();await page.change(select,'in_progress');await page.click('.edit-save-button');await waitStatus('in_progress');
  check('reopening a card keeps the explicit pin',await pin());
  await page.change(select,'done');await page.click('.edit-save-button');await waitStatus('done');
  await page.until(`document.querySelector('[data-card-id="a"] .card-pin').getAttribute('aria-pressed')==='false'`);
  check('a later completion event clears the pin again',true);
  await page.change(select,'in_progress');await page.click('.edit-save-button');await waitStatus('in_progress');
  await page.click('.view-mode-toggle');await mode('forward');
  await page.evaluate(`document.querySelector('[data-card-id="urgent"]').scrollIntoView({block:'center',behavior:'instant'})`);
  await evidence.screenshot(`${scheme}-completed-section`);
  // Delay only this disposable document's read, making the initial raw render
  // happen before its successful derived completion. No product test hook.
  const endpoint='/__taskprogress/v1/checklists/web-ui-pilot-test/completion-observer';
  const delayed=await page.send('Page.addScriptToEvaluateOnNewDocument',{source:`const originalFetch=window.fetch.bind(window);window.fetch=(input,options)=>String(input).includes(${JSON.stringify(endpoint)})?new Promise(r=>setTimeout(r,1200)).then(()=>originalFetch(input,options)):originalFetch(input,options);`});
  await page.evaluate(`(()=>{const key=Object.keys(localStorage).find(k=>k.includes('web-ui-pilot-test')&&k.endsWith(':completion'));const state=JSON.parse(localStorage.getItem(key));state.bound=false;localStorage.setItem(key,JSON.stringify(state));})()`);
  await page.send('Page.navigate',{url:url+'&pin=bound'});
  await page.until(`location.search.includes('pin=bound') && !!document.querySelector('[data-card-id="bound"] .task-header-meta .status-success')`);
  check('a fresh explicit URL pin wins after delayed completion observation',await page.evaluate(`document.querySelector('[data-card-id="bound"] .card-pin').getAttribute('aria-pressed')==='true'`));
  await page.send('Page.removeScriptToEvaluateOnNewDocument',{identifier:delayed.identifier});
  const failed=await page.send('Page.addScriptToEvaluateOnNewDocument',{source:`const originalFetch=window.fetch.bind(window);window.fetch=(input,options)=>String(input).includes(${JSON.stringify(endpoint)})?Promise.resolve(new Response('{}',{status:503})):originalFetch(input,options);`});
  // Drop the URL request so that the existing manual pin, not a fresh request,
  // is what must survive an unreadable document and its later recovery.
  await page.send('Page.navigate',{url});
  await page.until(`!location.search.includes('pin=') && !!document.querySelector('#item-bound--check .source-unavailable')`);
  check('an unreadable binding preserves the pin and last trustworthy completed state',await page.evaluate(`(()=>{const key=Object.keys(localStorage).find(k=>k.includes('web-ui-pilot-test')&&k.endsWith(':completion'));return JSON.parse(localStorage.getItem(key)).bound===true && document.querySelector('[data-card-id="bound"] .card-pin').getAttribute('aria-pressed')==='true';})()`));
  await page.send('Page.removeScriptToEvaluateOnNewDocument',{identifier:failed.identifier});
  await reload();
  await page.until(`!!document.querySelector('[data-card-id="bound"] .task-header-meta .status-success')`);
  check('recovering the same completed document does not create another unpin event',await page.evaluate(`document.querySelector('[data-card-id="bound"] .card-pin').getAttribute('aria-pressed')==='true'`));
  await page.click('[data-card-id="bound"] .card-pin');
}
