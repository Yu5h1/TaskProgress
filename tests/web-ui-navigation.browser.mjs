// Runs only on serve_web_ui_navigation.py's disposable candidate host.
await import('/demo/taskprogress/demo.js');
const web=(await import('/demo/taskprogress/assets/ui-host.js')).activeUiAdapter();
await import('/demo/taskprogress/reference/assets/viewer-ui.js');
const baseline=(await import('/demo/taskprogress/reference/assets/ui-host.js')).activeUiAdapter();
const results=document.querySelector('#results'),fixture=document.querySelector('#fixture');
document.querySelector('.page-shell').hidden=true;
let pass=0,fail=0;
const tick=()=>new Promise(r=>setTimeout(r,35));
const assert=(value,message)=>{if(!value)throw new Error(message);};
const equal=(a,b,message)=>assert(JSON.stringify(a)===JSON.stringify(b),message);
const wait=async fn=>{const end=Date.now()+12000;while(!fn()){if(Date.now()>end)throw new Error('State timeout');await tick();}};
const check=async(name,fn)=>{const li=document.createElement('li');try{await fn();pass++;li.textContent='PASS '+name;}catch(error){fail++;li.textContent='FAIL '+name+': '+error.message;}results.append(li);};
const links=t=>[...t.querySelectorAll('a')].map(n=>[n.textContent.trim(),n.getAttribute('href')]);
async function pair(region,props,run){
  const old=document.createElement('div'),current=document.createElement('div');fixture.append(old,current);
  const a=baseline.mount(region,old,props),b=web.mount(region,current,props);
  try{await tick();await run(old,current,async p=>{baseline.update(a,p);web.update(b,p);await tick();});}
  finally{baseline.destroy(a);web.destroy(b);old.remove();current.remove();}
}
await check('Candidate uses its own public Web renderer',async()=>assert(web.id==='yu5h1-web-ui-workflow','active product adapter'));
await check('Scope directory preserves host links and label updates',async()=>{
  await pair('scope-directory',{scopes:[{id:'child',href:'?scope=child',baseOnlyHref:'?scope=child&dev=off'}],baseOnlyLabel:'Custom base'},async(old,current,update)=>{
    equal(links(current),links(old),'initial URLs and supplied label');
    assert(current.querySelector('.scope-entry > .scope-link'),'source CSS structure');
    await update({scopes:[{id:'next',href:'?scope=next'}]});equal(links(current),links(old),'updated URLs');
  });
});
await check('Pointer states discard stale projections and preserve accessible navigation',async()=>{
  const task={id:'probe-pointer',title:'Child report',kind:'report_pointer'},card={status:'in_progress',summary:'Summary',progress:{completed:1,total:2,percentage:50},rows:[{id:'a',title:'Nested pointer'},{id:'b',title:'Future',status:'future'}]};
  await pair('task-list',{tasks:[task],allIds:[task.id],cardStorageKey:'taskprogress.candidate.navigation-test',editing:true},async(old,current,update)=>{
    for(const state of [{status:'loading'},{status:'ready',card,openHref:'?scope=child'},{status:'error',card,message:'Unavailable'},{status:'loading',card},{status:'ready',card}]){
      await update({pointerCards:{[task.id]:state}});
      for(const selector of ['.pointer-card [role="status"]','.pointer-card [role="alert"]','.pointer-card .status-badge','.pointer-card-progress'])equal([...current.querySelectorAll(selector)].map(n=>n.textContent),[...old.querySelectorAll(selector)].map(n=>n.textContent),selector);
      equal(links(current),links(old),'navigation');
      const article=current.querySelector('.pointer-card');assert(current.querySelector('#'+article.getAttribute('aria-labelledby'))?.textContent===task.title,'accessible card name');
      if(state.status==='ready')equal(current.querySelector('.pointer-card-progress').getAttribute('aria-label'),old.querySelector('.pointer-card-progress').getAttribute('aria-label'),'accessible progress');
      assert(!current.querySelector('textarea,input,select,.spike-add-button'),'pointer remains read-only');
    }
  });
});
await check('Candidate reorder preview ignores nested content and cleans moved or disposed rows',async()=>{
  const target=document.createElement('div');fixture.append(target);
  const task={id:'preview-pointer',title:'Pointer',kind:'report_pointer'};
  const view=web.mount('task-list',target,{tasks:[task],allIds:[task.id],pointerCards:{[task.id]:{status:'loading'}}});
  try {
    await tick();
    const row=target.querySelector('[data-card-id]');
    row.setAttribute('data-reorder-over','before');await tick();
    assert(row.classList.contains('card-drop-before'),'before projection');
    row.focus();await tick();
    assert(row.classList.contains('card-drop-before'),'selection redraw preserves preview');
    const nested=document.createElement('span');row.append(nested);
    nested.setAttribute('data-reorder-over','after');nested.textContent='nested content';await tick();
    assert(row.classList.contains('card-drop-before')&&!row.classList.contains('card-drop-after'),'nested mutation preserves preview');
    row.setAttribute('data-reorder-over','after');await tick();
    assert(!row.classList.contains('card-drop-before')&&row.classList.contains('card-drop-after'),'transition removes old class');
    row.remove();await tick();assert(!row.classList.contains('card-drop-after'),'removed row cleanup');
    const list=target.querySelector('.arrangeable-cards');list.append(row);await tick();
    assert(row.classList.contains('card-drop-after'),'reinserted row projection');
    web.destroy(view);assert(!row.classList.contains('card-drop-after'),'dispose cleanup');
  } finally {web.destroy(view);target.remove();}
});
await check('Decision history binds its panel; clearing history preserves real saved answers',async()=>{
  const frame=document.createElement('iframe');frame.src='/demo/taskprogress/decisions/?scope=web-ui-pilot-test&task=pilot';fixture.append(frame);
  try{
    await wait(()=>frame.contentWindow.taskprogressWebUi?.app?.data?.snapshot);
    const app=frame.contentWindow.taskprogressWebUi.app,d=frame.contentDocument;
    const all=d.querySelector('[data-capsule-id="__default__"]');
    if(all.getAttribute('aria-pressed')!=='true'){all.click();await tick();}
    const option=d.querySelector('.decision-option input:not(:checked)');assert(option,'new disposable decision choice');option.click();
    await wait(()=>!app.data.busy&&!app.data.pending&&app.data.history.canUndo);
    const saved=await app.transport.load(),trigger=d.querySelector('[aria-label="開啟歷史面板"]');trigger.click();await tick();
    const panel=d.getElementById(trigger.getAttribute('aria-controls'));assert(panel?.open,'panel binding');
    const button=label=>[...panel.querySelectorAll('button')].find(n=>n.textContent===label);
    button('清除歷史…').click();await tick();button('取消').click();await tick();assert(app.data.history.canUndo,'cancel retains history');
    button('清除歷史…').click();await tick();button('確認清除歷史').click();await tick();
    assert(!app.data.history.canUndo&&!app.data.history.canRedo&&!app.data.history.entries.length,'history cleared');
    equal(await app.transport.load(),saved,'real API document and revision unchanged');
    panel.close();await tick();assert(!app.historyOpen&&trigger.getAttribute('aria-expanded')==='false','close reaches host');
    trigger.click();await tick();assert(panel.open&&!panel.querySelector('.history-entries'),'reopen cleared history');
  }finally{frame.remove();}
});
document.title=fail?`FAIL ${fail} / PASS ${pass}`:`PASS ${pass} candidate navigation`;
document.body.dataset.result=fail?'fail':'pass';
