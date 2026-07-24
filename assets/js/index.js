  const boss = document.getElementById('boss');
  const bossImg = document.getElementById('bossImg');
  const bubble = document.getElementById('bubble');

  let rage = 0;
  let decayTimer = null;

  // 데모 상사는 거만 포즈(pose-01) 고정 — 사죄 연출은 앱에서만
  const FRAMES = [
    {min:0,  src:'assets/boss/pose-01.png'},
  ];
  FRAMES.forEach(f => { const i = new Image(); i.src = f.src; });

  let lang = localStorage.getItem('sajoe_lang') || 'ko';

  const TAUNTS = {
    ko: ['내가 다 너 잘되라고 하는 소리야.','지금은 이해 안 되겠지만 다 너를 위한 거야.','힘든 게 다 성장이야. 나중에 나한테 고마워할걸?','너니까 이런 것도 시키는 거야, 아무한테나 안 해.','젊을 때 고생은 사서도 한다잖아.','이런 거 하나 못 참으면 어디 가서도 못 버텨.','내가 너 미워서 이러겠어? 애정이 있으니까 그러지.','이것도 다 경험이야, 나중에 다 자산이 돼.','이런 쓴소리 해주는 사람 나밖에 없어.','서운해하지 마, 다 애정이 있어서 그러는 거야.','회사가 학교야, 학원비 낸다 생각하고 배워.','지금 안 힘들면 나중에 더 힘들어, 미리 겪는 거야.','너 진짜 아끼니까 하는 말인데, 정신 좀 차려.','내가 니 나이 땐 이런 말 해주는 사람도 없었어.','이 정도 가지고 힘들면 어떻게 임원 달아?','다들 하는 건데 왜 너만 유별나게 굴어?','이걸 이렇게밖에 못 해요?','그래서 결론이 뭡니까?','내가 신입 때는 밤도 새웠어.','주말에 잠깐 나올 수 있죠?','요즘 젊은 사람들은 패기가 없어.'],
    en: ["I'm only saying this for your own good.","You won't get it now, but this is all for you.","Hardship is growth. You'll thank me later.","I only ask this of you. I wouldn't trust just anyone.","Suffering while young builds character.","If you can't handle this, you won't last anywhere.","You think I do this because I hate you? It's affection.","It's all experience. It'll be an asset someday.","I'm the only one who'll tell you the hard truth.","Don't be hurt — I say it out of love.","This company is your school. Think of it as tuition.","Struggle now, or struggle harder later.","I say this because I truly care: get it together.","At your age, nobody even bothered to tell me this.","If this is hard, how will you ever make executive?","Everyone else does it. Why are you so special?","Is this really the best you can do?","So what's the bottom line here?","When I was a rookie, I pulled all-nighters.","You can pop in this weekend, right?","Young people these days have no grit."]
  };
  const CALM = {
    ko: '거봐, 다 너 생각해서 한 소리잖아.',
    en: "See? I told you it was for your own good."
  };

  function currentLines(){
    return TAUNTS[lang] || TAUNTS.ko;
  }

  function currentFrame(){
    let s = FRAMES[0].src;
    for(const f of FRAMES){ if(rage >= f.min) s = f.src; }
    return s;
  }

  function updateFace(){
    const src = currentFrame();
    if(!bossImg.getAttribute('src').endsWith(src)) bossImg.src = src;
  }

  boss.addEventListener('click', () => {
    rage = Math.min(100, rage + 7);
    const set = currentLines();
    bubble.textContent = set[Math.floor(Math.random()*set.length)];
    bubble.classList.remove('pop'); void bubble.offsetWidth; bubble.classList.add('pop');
    boss.classList.remove('shake'); void boss.offsetWidth; boss.classList.add('shake');
    updateFace();

    clearInterval(decayTimer);
    decayTimer = setInterval(() => {
      rage = Math.max(0, rage - 2);
      updateFace();
      if(rage === 0){
        clearInterval(decayTimer);
        bubble.textContent = CALM[lang] || CALM.ko;
      }
    }, 400);
  });

  // ---- 다운로드 진입점: 실제 파일이 아니라 설치 안내 페이지(install.html)로 보낸다.
  //      다운로드 버튼·SmartScreen/Gatekeeper 안내가 그 페이지에 있어, 무서명 경고로 인한 이탈을 줄인다. ----
  const REL = {
    win: 'https://king1cell.github.io/nunchiboss-site/install.html?os=win',
    mac: 'https://king1cell.github.io/nunchiboss-site/install.html?os=mac',
    page: 'https://king1cell.github.io/nunchiboss-site/install.html',
  };
  // 히어로 메인 버튼은 접속 OS에 맞는 안내로 자동 연결 (감지 실패 시 install.html이 자체 감지)
  const isMac = /Mac|iPhone|iPad/i.test(navigator.platform || '') || /Mac OS X/i.test(navigator.userAgent || '');
  document.getElementById('dlBtn').href = isMac ? REL.mac : REL.win;

  // 데모 영상: 파일이 실제로 로드될 때만 슬롯 표시 (파일이 없으면 계속 숨김).
  // 여러 클립을 번갈아 재생 — 한 편이 끝나면 다음 편으로 넘어가고 다시 처음으로.
  // 두 번째 클립이 없으면(404) 첫 클립 무한 반복으로 폴백한다.
  (function(){
    const slot = document.getElementById('demoSlot');
    if(!slot) return;
    const v = slot.querySelector('video');
    const clips = ['assets/demo.mp4', 'assets/demo2.mp4'];
    let i = 0;
    v.addEventListener('loadeddata', ()=>slot.classList.add('ready'));
    v.addEventListener('ended', ()=>{
      i = (i + 1) % clips.length;
      v.src = clips[i];
      v.play().catch(()=>{});
    });
    v.addEventListener('error', ()=>{
      if(i !== 0){ i = 0; v.src = clips[0]; v.loop = true; v.play().catch(()=>{}); }
    });
    if(v.readyState >= 2) slot.classList.add('ready');
  })();

  // 하단 중앙 플로팅 다운로드: 히어로의 다운로드 버튼이 화면 위로 사라지고, 최종 CTA가 안 보일 때만 표시
  const floatDl = document.getElementById('floatDl');
  const downloadSec = document.getElementById('download');
  const finalSec = document.getElementById('final');
  function updateFloatDl(){
    const heroOut = downloadSec.getBoundingClientRect().bottom < 0;
    const finalIn = finalSec.getBoundingClientRect().top < window.innerHeight;
    floatDl.classList.toggle('show', heroOut && !finalIn);
  }
  window.addEventListener('scroll', updateFloatDl, {passive:true});
  window.addEventListener('resize', updateFloatDl);
  updateFloatDl();

  // ---- i18n (한국어 / English) ----
  const EN = {
    brand: 'NunchiBoss',
    nav_how: 'How it works',
    nav_ft: 'Features',
    nav_sponsor: '☕ Support',
    nav_cta: 'Download',
    hero_h1: 'Held it in again today?<br><span class="stroke">Time to get that apology.</span>',
    hero_sub: 'Put the boss on your screen, click away, collect apologies.',
    dl_main: 'Download NunchiBoss',
    os_note: 'Windows 10/11 · macOS 14+ · Apple Silicon only',
    win_size: '.exe · Windows 10/11 · 64-bit',
    mac_size: '.dmg · Apple Silicon · 122MB',
    note_win: '🪟 <b>Windows</b> — v0.3.0 is out (Windows 10/11 · 64-bit). Not code-signed yet — if SmartScreen appears, click <b>More info → Run anyway</b>. <a href="https://www.virustotal.com/gui/file/e7edfd7ecabe95ae31704efc0db78bc977645f2a3fa09e77d88873a00a8f7c7c" target="_blank" rel="noopener noreferrer">VirusTotal 0/66 — verify yourself</a>',
    note_mac: '🍎 <b>macOS</b> — v0.3.0 is out (Apple-signed & notarized). Just grant <b>Accessibility permission</b> on first launch.',
    terms: '<b>By default the app makes zero network calls.</b> No accounts. We never record what you type — only aggregate typing, clicking and mouse-movement statistics, activity time, and app settings are stored locally on your device. The only one who knows about your rage is the boss — and it never leaves your device. The only exception is checking for a new version — and only when <b>you</b> turn on "check for updates" or press "check now": it compares version numbers with GitHub (no user data is sent). Do neither and the app makes no network calls at all.<br><br><b>This website is separate.</b> Messages and any optional email you send through the contact form are kept in a private repository so we can reply and keep records. The page uses <b>Cloudflare Turnstile</b> for spam protection, which sends a bot-check request to Cloudflare. The Windows waitlist only counts a number — no name, email, or IP is stored. Visit stats are counted with <b>cookieless, non-identifying</b> Cloudflare Web Analytics (page views only).',
    how_t: 'Three steps to an apology',
    how_s: 'Work is complicated enough already.',
    s1t: 'Summon the boss',
    s1p: 'Launch the app and there he is — wearing that oddly familiar look.',
    s2t: 'Unleash your rage',
    s2p: 'Click like mad, or type everything you never got to say. The faster you go, the higher it builds.',
    s3t: 'Collect the apology',
    s3p: 'The higher your rage, the more desperate his apologies — full 90-degree bows included.',
    ft_t: "What's inside",
    ft_s: 'Features that take stress relief seriously',
    f1t: 'Click-spam mode',
    f1p: 'Clicks per second convert straight into rage. The faster you mash, the harder he apologizes.',
    f2t: 'Speed-typing mode',
    f2p: "Type everything you wish you'd said. The boss sweats in proportion to your WPM.",
    f3t: 'Escalating apologies',
    f3p: 'From "I\'m sorry" to "It\'s all my fault, please…" — the apology escalates to on-the-knees as your rage climbs.',
    f4t: 'Stays on your device',
    f4p: 'We never record what you type, and there are no accounts. Only aggregate statistics and app settings are stored locally, never sent anywhere. What you typed stays between you and… no one, actually.',
    q_t: 'Reviews from the already-apologized-to',
    q_s: '※ Entirely fictional reviews, sent from deep within the heart',
    q1: '"My report got rejected, so I spam-clicked for five minutes on the subway. Best commute in months."',
    q1w: '— K, 7th-year associate',
    q2: '"I typed my resignation draft into typing mode and the boss got on his knees. I didn\'t resign."',
    q2w: '— P, 3rd-year staff',
    q3: '"I\'m a boss myself, and now I know what my team is up to. Five stars. I\'m sorry."',
    q3w: '— L, anonymous department head',
    faq_t: 'FAQ',
    faq_s: 'Ask us — not your boss',
    fq1: 'Can my boss find out I use this?',
    fa1: 'The app itself sends nothing outside — no accounts, no notifications, and we never record what you type. That said, on a company-managed device an administrator may be able to see which programs are installed and running, so keep that in mind.',
    fq2: 'What changes when I click faster?',
    fa2: 'Your rage builds faster, and his apologies escalate — from a polite nod to a full 90-degree bow.',
    fq3: 'Can I type anything in typing mode?',
    fa3: 'Yes, type whatever you like. We never record what you type — only stats like your typing speed are counted. The faster you type, the more he sweats.',
    fq4: "Can I use my actual boss's face?",
    fa4: "That feature doesn't exist — but hairstyle, glasses and tie customization are on the way.",
    fq5: 'What does it run on?',
    fa5: "Desktop only: Windows 10/11 and macOS 14 (Sonoma) or later. No mobile version — the boss doesn't follow you into your pocket.",
    fq6: 'Is it free?',
    fa6: "Yes — every feature is free. No ads, no accounts. If you feel like it, you can support development with a donation.",
    fq7: 'How is it different from desktop pets like Bongo Cat or Shimeji?',
    fa7: "Having a character live on your screen is similar — but NunchiBoss reacts to the <b>intensity</b> of your typing and clicking. The harder and faster you rage-type, the more scared the boss gets and the deeper it bows in apology. Keep raging and it grows numb; punish it with a click-storm and it snaps back to desperate apologies. It's a desktop pet for the days you need to take it out on your keyboard.",
    fin_t: 'Today is the last day you hold it in.',
    fin_p: 'Get your apology in before tomorrow morning.',
    fin_btn: 'Download now',
    float_btn: 'Download',
    foot: '© 2026 NunchiBoss · Any resemblance to actual bosses is purely coincidental (probably)',
    privacy_h: '🔒 Privacy',
    foot_privacy: 'Privacy',
    foot_contact: 'Contact',
    foot_sponsor: '☕ Support'
  };
  const KO = {};
  document.querySelectorAll('[data-i18n]').forEach(el => { KO[el.dataset.i18n] = el.innerHTML; });
  const TITLES = { ko: document.title, en: 'NunchiBoss — click your boss, collect apologies' };

  function setLang(l){
    lang = l;
    localStorage.setItem('sajoe_lang', l);
    document.documentElement.lang = l;
    document.title = TITLES[l] || TITLES.ko;
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const k = el.dataset.i18n;
      el.innerHTML = (l === 'en' && EN[k] !== undefined) ? EN[k] : KO[k];
    });
    document.querySelectorAll('.lang-btn').forEach(b => b.classList.toggle('active', b.dataset.lang === l));
    bubble.textContent = (TAUNTS[l] || TAUNTS.ko)[0];
  }
  document.querySelectorAll('.lang-btn').forEach(b => b.addEventListener('click', () => setLang(b.dataset.lang)));
  if(lang !== 'ko') setLang(lang);
