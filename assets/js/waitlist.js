  // ⚠️ 배포 시 실제 Worker URL로 교체
  const WORKER_URL = 'https://nunchiboss-waitlist.theking1cell.workers.dev';
  const VOTED_KEY = 'nunchi_waitlist_voted';

  const EN = {
    h1:'🪟 Want a Windows version?', sub:'Only macOS is out right now. If enough people want it, we\'ll build the Windows version. No account or login needed.',
    loading:'Loading…', num_label:'waiting for the Windows version', unit:'',
    vote:'I want it', voted:'Registered',
    n_title:'About this number',
    n_body:'Since anyone can join without an account, this is an <b>interest indicator, not an exact vote count</b>. Repeat clicks from the same browser are suppressed but can\'t be fully prevented. No personal data is stored — no name, email, or IP; we only count a number. This page uses <b>Cloudflare Turnstile</b> for spam protection, which sends a bot-check request to Cloudflare.',
    back:'← Back to NunchiBoss', sponsor:'☕ Support development',
    // 상태 메시지 (DOM에 대응 요소가 없는 키)
    ok:'Registered. Thank you!', already:'You already joined. Thank you!',
    err_bot:'Please pass the robot check.', err_net:'Something went wrong. Please try again.'
  };
  // 한국어 상태 메시지는 DOM에 대응 요소가 없으므로 직접 정의 후 DOM 값으로 덮어쓴다
  const KO = {
    ok:'등록됐습니다. 고맙습니다!', already:'이미 참여하셨어요. 고맙습니다!',
    err_bot:'로봇 확인을 통과해주세요.', err_net:'문제가 발생했습니다. 잠시 후 다시 시도해주세요.',
    voted:'등록됨',
    loading:'불러오는 중…', // 숫자 요소는 data-i18n을 쓰지 않으므로 여기서 정의
    unit:'명'               // 숫자 뒤에 붙는 단위 (영어는 없음)
  };
  document.querySelectorAll('[data-i18n]').forEach(el=>KO[el.dataset.i18n]=el.innerHTML);

  const TITLES={ko:document.title, en:'Windows waitlist — NunchiBoss'};
  let lang = localStorage.getItem('sajoe_lang') || 'ko';
  const t = k => (lang==='en' && EN[k]!==undefined) ? EN[k] : KO[k];
  function setLang(l){
    lang=l; localStorage.setItem('sajoe_lang',l); document.documentElement.lang=l;
    document.title=TITLES[l]||TITLES.ko;
    document.querySelectorAll('[data-i18n]').forEach(el=>{ el.innerHTML = t(el.dataset.i18n); });
    document.querySelectorAll('.lang-btn').forEach(b=>b.classList.toggle('active',b.dataset.lang===l));
    renderNum(); // 숫자는 data-i18n이 아니라 여기서 다시 그린다 (값 유지)
    paintVoted();
  }
  document.querySelectorAll('.lang-btn').forEach(b=>b.addEventListener('click',()=>setLang(b.dataset.lang)));

  const numEl=document.getElementById('num'), voteBtn=document.getElementById('vote'), result=document.getElementById('result');
  const hasVoted = () => { try{ return localStorage.getItem(VOTED_KEY)==='1' }catch(_){ return false } };

  // 숫자 요소는 renderNum()이 단독 관리한다 (언어 전환에도 값이 유지되도록)
  let currentCount = null; // null=조회중, -1=조회실패, 그 외=실제 수
  function renderNum(){
    if(currentCount === -1){ numEl.classList.remove('loading'); numEl.textContent = '—'; return }
    if(currentCount === null){ numEl.classList.add('loading'); numEl.textContent = t('loading'); return }
    numEl.classList.remove('loading');
    // 숫자 + 단위를 한 덩어리로 (예: "1명"). 단위는 우리가 고정한 상수라 안전하다
    numEl.textContent = '';
    numEl.append(Number(currentCount).toLocaleString());
    const unit = t('unit');
    if(unit){
      const u = document.createElement('span');
      u.className = 'unit'; u.textContent = unit;
      numEl.append(u);
    }
  }
  function paintCount(n){ currentCount = n; renderNum(); }
  function paintVoted(){
    if(hasVoted()){
      voteBtn.disabled = true;
      voteBtn.querySelector('[data-i18n="vote"]').textContent = t('voted');
    }
  }

  // 현재 수 조회
  fetch(WORKER_URL).then(r=>r.json()).then(d=>{ if(typeof d.count==='number') paintCount(d.count) })
    .catch(()=>{ currentCount = -1; renderNum() });
  paintVoted();
  if(lang!=='ko') setLang(lang);

  voteBtn.addEventListener('click', async ()=>{
    result.className='msg';
    if(hasVoted()){ result.className='msg ok'; result.textContent=t('already'); return }
    const token=(document.querySelector('[name="cf-turnstile-response"]')||{}).value||'';
    if(!token){ result.className='msg err'; result.textContent=t('err_bot'); return }
    voteBtn.disabled=true;
    try{
      const res=await fetch(WORKER_URL,{
        method:'POST', headers:{'Content-Type':'application/json'},
        body:JSON.stringify({ turnstileToken:token, website:document.getElementById('hp').value })
      });
      const d=await res.json();
      if(res.ok){
        if(typeof d.count==='number') paintCount(d.count);
        try{ localStorage.setItem(VOTED_KEY,'1') }catch(_){}
        result.className='msg ok'; result.textContent=t('ok');
        paintVoted();
      } else {
        result.className='msg err'; result.textContent = d.error==='captcha' ? t('err_bot') : t('err_net');
        voteBtn.disabled=false;
        if(window.turnstile) turnstile.reset();
      }
    }catch(_){
      result.className='msg err'; result.textContent=t('err_net'); voteBtn.disabled=false;
    }
  });
