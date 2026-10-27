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
await check('Inline content switches safely between literal text and Markdown links',async()=>{
  const frame=document.createElement('iframe');frame.src='/demo/taskprogress/decisions/?scope=web-ui-pilot-test&task=pilot';fixture.append(frame);
  try {
    await wait(()=>frame.contentWindow.taskprogressWebUi?.app?.data?.snapshot);
    const app=frame.contentWindow.taskprogressWebUi.app,d=frame.contentDocument;
    const all=d.querySelector('[data-capsule-id="__default__"]');if(all.getAttribute('aria-pressed')!=='true'){all.click();await tick();}
    const item=app.data.snapshot.document.decisions[0];
    const description=()=>d.querySelector(`[data-card-id="${item.id}"] .decision-description`);
    item.context='<b>Literal</b>';app.draw();await tick();
    assert(description().textContent.includes('<b>Literal</b>')&&!description().querySelector('b'),'plain text is escaped');
    item.context='[Safe](/checklist/?scope=fixture) [Unsafe](javascript:alert(1))';app.draw();await tick();
    assert(description().querySelectorAll('a').length===1&&description().querySelector('a').getAttribute('href').startsWith('/checklist/'),'only safe link becomes an anchor');
    item.context='Plain again';app.draw();await tick();
    assert(description().textContent.includes('Plain again')&&!description().querySelector('a'),'switching back removes old link action');
  }finally{frame.remove();}
});
await check('Item reorder capability can enable, disable and re-enable without stale listeners',async()=>{
  const target=document.createElement('div');fixture.append(target);
  const task={id:'capability',title:'Capability',status:'planned',priority:2,summary:'',completed_items:[],pending_items:[{id:'one',title:'One',status:'planned',priority:2},{id:'two',title:'Two',status:'planned',priority:2}]};
  const moves=[];
  const view=web.mount('task-list',target,{tasks:[task],allIds:[task.id],scopeId:'capability',policy:globalThis.TaskProgressPriorityPolicy,progress:{capability:{completed:0,total:2}},reorderable:false,onReorder:move=>moves.push(move)});
  const move=()=>target.querySelector('[data-item-row="capability/one"]').dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowDown',altKey:true,bubbles:true,cancelable:true}));
  try {
    await tick();move();await tick();assert(moves.length===0,'disabled capability installs no move handler');
    web.update(view,{reorderable:true});await tick();move();await tick();assert(moves.length===1&&moves[0].itemId==='one','enabled capability routes the real item command');
    web.update(view,{reorderable:false});await tick();move();await tick();assert(moves.length===1,'disable removes move handler');
    web.update(view,{reorderable:true});await tick();move();await tick();assert(moves.length===2,'re-enable installs one handler');
  } finally {web.destroy(view);target.remove();}
});
await check('Pure sorting retains disclosure state; data and callback updates invalidate reused content',async()=>{
  const target=document.createElement('div');fixture.append(target);
  const tasks=Array.from({length:3},(_,i)=>({id:`reuse-${i}`,title:`Reuse ${i}`,status:'planned',priority:2,summary:'Long text '.repeat(60),completed_items:[],pending_items:[]}));
  const commands=[];
  const view=web.mount('task-list',target,{tasks,allIds:tasks.map(t=>t.id),policy:globalThis.TaskProgressPriorityPolicy,progress:Object.fromEntries(tasks.map(t=>[t.id,{completed:0,total:0}])),onCommand:()=>commands.push('old')});
  try {
    await tick();
    const middle=target.querySelector('[data-card-id="reuse-1"]'),toggle=middle.querySelector('.expandable-text__toggle');
    toggle.click();await tick();assert(toggle.getAttribute('aria-expanded')==='true','reader opens disclosure');
    target.querySelector('.icon-choice[aria-label="排序"] button').click();await tick();
    equal([...target.querySelectorAll('[data-card-id]')].map(n=>n.dataset.cardId),['reuse-2','reuse-1','reuse-0'],'sort moves exact identities');
    assert(middle.querySelector('.expandable-text__toggle')===toggle&&toggle.getAttribute('aria-expanded')==='true','sort retains reader state');
    web.update(view,{tasks:tasks.map(t=>t.id==='reuse-1'?{...t,summary:'Fresh content'}:t)});await tick();
    assert(middle.querySelector('.task-summary').textContent.includes('Fresh content'),'data update replaces cached content');
    web.update(view,{editing:true,onCommand:()=>commands.push('new')});await tick();
    const input=middle.querySelector('.task-title-input');input.value='Updated title';input.dispatchEvent(new Event('input',{bubbles:true}));
    equal(commands,['new'],'updated controls use current callback');
    web.update(view,{onCommand:()=>commands.push('newer')});await tick();
    assert(middle.querySelector('.task-title-input')===input,'callback-only update retains control');
    input.value='Latest title';input.dispatchEvent(new Event('input',{bubbles:true}));
    equal(commands,['new','newer'],'retained control calls replacement callback');
  }finally{web.destroy(view);target.remove();}
});
await check('Rendering windows restore long text, unfocused overlays, keyboard moves and drag cancellation/restart',async()=>{
  const target=document.createElement('div'),tail=document.createElement('div');target.style.width='390px';tail.style.height='800px';fixture.append(target,tail);
  const key='taskprogress.candidate.window-test';localStorage.setItem(key+':mode','free');
  let tasks=Array.from({length:20},(_,i)=>({id:`window-${i}`,title:`Window ${i}`,status:'planned',priority:2,summary:i===19?'Long disclosure '.repeat(80):'Window content',completed_items:[],pending_items:[{id:'wait',title:'Wait for two targets',status:'planned',priority:2,derivedState:'waiting',derivedStateLabel:'Waiting',derivedStateTone:'warning',pendingWaits:[{available:true,href:'?scope=first',label:'First'},{available:true,href:'?scope=second',label:'Second'}]}]}));
  const view=web.mount('task-list',target,{tasks,scopeId:'window-test',allIds:tasks.map(t=>t.id),cardStorageKey:key,policy:globalThis.TaskProgressPriorityPolicy,progress:Object.fromEntries(tasks.map(t=>[t.id,{completed:0,total:1}]))});
  try{
    await tick();scrollTo(0,0);await tick();
    let last=target.querySelector('[data-card-id="window-19"]');
    assert(last.querySelector('.task-summary span').checkVisibility({contentVisibilityAuto:true})===false,'tail is initially skipped');
    tasks=tasks.map(t=>t.id==='window-19'?{...t,summary:'Updated offscreen text '.repeat(80)}:t);web.update(view,{tasks});await tick();
    last.scrollIntoView({block:'start'});await tick();await tick();
    const content=last.querySelector('.task-summary .expandable-text__content'), toggle=content.querySelector('button');
    assert(!toggle.hidden&&content.textContent.includes('Updated offscreen'),'reveal measures updated long text');
    assert(content.getBoundingClientRect().height<=parseFloat(getComputedStyle(content).lineHeight)*2+2,'collapsed text fits two lines');
    target.style.width='760px';await tick();target.style.width='390px';await tick();
    assert(last.querySelector('article').scrollWidth<=last.clientWidth+2,'narrow content remains within card');
    toggle.focus();toggle.click();await tick();assert(toggle.getAttribute('aria-expanded')==='true','focus reveal can expand');toggle.click();await tick();
    const trigger=last.querySelector('.wait-menu > button');trigger.scrollIntoView({block:'center'});document.activeElement?.blur();trigger.click();await tick();
    const menu=last.querySelector('.wait-menu-list');
    assert(!last.matches(':focus-within')&&!last.matches(':hover'),'menu opens without focus or hover');
    assert(getComputedStyle(last.querySelector('article')).contentVisibility==='visible','active card releases containment');
    // viewer-core/wait-menu-overflow-clipping owns pre-existing inner-row
    // overflow clipping. Isolate article containment here so this test does
    // not claim that the independent overlay defect is fixed.
    const row=menu.closest('.editor-item-row'),utility=menu.closest('.item-row-utility-panel');
    row.style.overflow='visible';utility.style.overflow='visible';
    const rect=menu.querySelector('a').getBoundingClientRect();
    assert(menu.contains(document.elementFromPoint(rect.left+rect.width/2,rect.top+rect.height/2)),'article window adds no clipping');
    row.style.removeProperty('overflow');utility.style.removeProperty('overflow');
    trigger.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}));await tick();assert(!last.querySelector('.wait-menu-list'),'menu keyboard cancellation');
    last.focus();last.dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowUp',altKey:true,bubbles:true,cancelable:true}));await tick();
    assert(target.querySelectorAll('[data-card-id]')[18]===last&&document.activeElement===last,'keyboard reorder retains focused tail');
    const transfer=new DataTransfer(), grip=last.querySelector('[data-reorder-handle]');
    grip.dispatchEvent(new DragEvent('dragstart',{bubbles:true,cancelable:true,dataTransfer:transfer}));
    assert(last.hasAttribute('data-reorder-dragging'),'drag session begins');
    // Public Reorder cancels on scroll by contract. Windowing must preserve
    // that cancellation; a fresh drag after reveal must still move exact IDs.
    scrollTo(0,0);await tick();assert(!last.hasAttribute('data-reorder-dragging'),'scroll cancels stale drag');
    const first=target.querySelector('[data-card-id]'), second=target.querySelectorAll('[data-card-id]')[1];
    first.scrollIntoView({block:'start'});await tick();
    const freshGrip=first.querySelector('[data-reorder-handle]');
    freshGrip.dispatchEvent(new DragEvent('dragstart',{bubbles:true,cancelable:true,dataTransfer:transfer}));
    assert(first.hasAttribute('data-reorder-dragging'),'new drag starts after reveal');
    const bounds=second.getBoundingClientRect();
    second.dispatchEvent(new DragEvent('dragover',{bubbles:true,cancelable:true,dataTransfer:transfer,clientY:bounds.bottom-1,clientX:bounds.left+10}));
    assert(second.hasAttribute('data-reorder-over'),'revealed target accepts drag');
    second.dispatchEvent(new DragEvent('drop',{bubbles:true,cancelable:true,dataTransfer:transfer,clientY:bounds.bottom-1,clientX:bounds.left+10}));
    freshGrip.dispatchEvent(new DragEvent('dragend',{bubbles:true,dataTransfer:transfer}));await tick();
    assert(target.querySelectorAll('[data-card-id]')[1]===first,'drop after reveal preserves moved card');
    equal([...target.querySelectorAll('[data-card-id]')].map(n=>n.dataset.cardId).sort(),tasks.map(t=>t.id).sort(),'all card identities retained');
  }finally{if(!new URLSearchParams(location.search).has('interactive')){web.destroy(view);target.remove();tail.remove();}localStorage.removeItem(key);localStorage.removeItem(key+':mode');localStorage.removeItem(key+':pins');sessionStorage.removeItem(key+':visibility');scrollTo(0,0);}
});
document.title=fail?`FAIL ${fail} / PASS ${pass}`:`PASS ${pass} candidate navigation`;
document.body.dataset.result=fail?'fail':'pass';
