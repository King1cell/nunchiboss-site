  // ⚠️ 배포 시 실제 Worker URL로 교체
  const WORKER_URL = 'https://nunchiboss-contact.theking1cell.workers.dev';

  const EN = {
    h1:'Contact us', sub:'Bug reports, feature ideas, anything — no login or account needed.',
    l_cat:'Category', c_bug:'Bug report', c_feature:'Feature idea', c_other:'Other',
    l_msg:'Message <span class="req">*</span>', msg_hint:'Up to 4000 characters.',
    l_email:'Reply email (optional)', email_hint:'Add it if you want a reply. Otherwise we just log it.',
    p_title:'Privacy note (web form)',
    p_body:'This form is a <b>website feature</b> (separate from the app). Your message and optional email are stored in a private repository for replies and records. Nothing else is collected. This page uses <b>Cloudflare Turnstile</b> for spam protection, which sends a bot-check request to Cloudflare. <b>The app itself still sends nothing over the network.</b>',
    send:'Send', back:'← Back to NunchiBoss',
    ok:'Sent. Thank you!', err_val:'Please write a message and pass the check.', err_net:'Something went wrong. Please try again.'
  };
  // 상태 메시지(ok/err_*)는 DOM에 대응 요소가 없어 KO를 직접 채운다.
  // 그다음 DOM의 data-i18n 값으로 나머지를 덮어쓴다.
  const KO = {
    ok: '보냈습니다. 감사합니다!',
    err_val: '내용을 작성하고 로봇 확인을 통과해주세요.',
    err_net: '문제가 발생했습니다. 잠시 후 다시 시도해주세요.',
  };
  document.querySelectorAll('[data-i18n]').forEach(el=>KO[el.dataset.i18n]=el.innerHTML);
  const TITLES={ko:document.title, en:'Contact — NunchiBoss'};
  let lang = localStorage.getItem('sajoe_lang') || 'ko';
  function t(k){ return (lang==='en' && EN[k]!==undefined)?EN[k]:KO[k]; }
  function setLang(l){
    lang=l; localStorage.setItem('sajoe_lang',l); document.documentElement.lang=l;
    document.title=TITLES[l]||TITLES.ko;
    document.querySelectorAll('[data-i18n]').forEach(el=>{ el.innerHTML = t(el.dataset.i18n); });
    document.querySelectorAll('.lang-btn').forEach(b=>b.classList.toggle('active',b.dataset.lang===l));
  }
  document.querySelectorAll('.lang-btn').forEach(b=>b.addEventListener('click',()=>setLang(b.dataset.lang)));
  if(lang!=='ko') setLang(lang);

  const f=document.getElementById('f'), msg=document.getElementById('msg'), count=document.getElementById('count');
  const result=document.getElementById('result'), submit=document.getElementById('submit');
  document.getElementById('msg').addEventListener('input',e=>count.textContent=e.target.value.length);

  f.addEventListener('submit', async (e)=>{
    e.preventDefault();
    result.className='msg';
    const message=f.message.value.trim();
    const token=(f.querySelector('[name="cf-turnstile-response"]')||{}).value||'';
    if(!message || !token){ result.className='msg err'; result.textContent=t('err_val'); return; }
    submit.disabled=true;
    try{
      const res=await fetch(WORKER_URL,{
        method:'POST', headers:{'Content-Type':'application/json'},
        body:JSON.stringify({
          category:f.category.value, message, email:f.email.value.trim(),
          website:f.website.value, // 허니팟
          turnstileToken:token, lang
        })
      });
      if(res.ok){ result.className='msg ok'; result.textContent=t('ok'); f.reset(); count.textContent='0';
        if(window.turnstile) turnstile.reset(); }
      else { result.className='msg err'; result.textContent=t('err_net'); }
    }catch(_){ result.className='msg err'; result.textContent=t('err_net'); }
    finally{ submit.disabled=false; }
  });
