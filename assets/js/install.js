  // ===== 설정 =====
  const MAC_DOWNLOAD_URL = 'https://github.com/King1cell/boss-mascot-releases/releases/download/v0.4.0/boss-mascot-0.4.0-mac-arm64.dmg';
  // ⚠️ Windows exe가 릴리스에 올라가면 이 값만 실제 URL로 교체하면 다운로드가 켜진다. null이면 "준비 중".
  const WIN_DOWNLOAD_URL = 'https://github.com/King1cell/boss-mascot-releases/releases/download/v0.4.0/boss-mascot-0.4.0-win-x64.exe';

  const EN = {
    h1:'Download & Install', sub:'One minute to put the boss in the corner of your screen.',
    tab_mac:'🍎 macOS', tab_win:'🪟 Windows',
    mac_dl:'Download for macOS', mac_meta:'.dmg · Apple Silicon only · macOS 14+',
    mac_s1:'Open the <b>.dmg</b> and drag NunchiBoss into your <b>Applications</b> folder.',
    mac_s2:'The first time you launch it, this dialog appears. Click <b>Open Settings</b>. The app only counts your keystrokes and clicks — it never records <i>what</i> you type.',
    mac_s3:'System Settings opens to <b>Accessibility</b>. <b>BossMascot</b> in the list is NunchiBoss (its internal name). Flip its <b>toggle on</b>.',
    mac_s4:'When you turn it on, macOS asks for your <b>password</b>. Enter it and click <b>Modify Settings</b>.',
    mac_s5:'Once the toggle turns <b>blue</b>, the permission is granted.',
    mac_s6:'<b>All done!</b> The boss appears in the corner. Use the tray icon → <b>Settings…</b> to change character, name, size and position. It grovels harder the angrier you type.',
    cap1:'Drag NunchiBoss into Applications',
    cap2:'Click “Open Settings”',
    cap3:'BossMascot in the list — still off',
    cap4:'Enter your password, then “Modify Settings”',
    cap5:'Toggle is on — permission granted',
    cap6:'Dress up your boss in Settings',
    mac_faq_t:'Won\'t it open?',
    mac_faq_b:'The app is <b>Apple-signed & notarized</b>, so it opens with no workaround. If it\'s still blocked, <b>Control-click → Open</b>. Intel Macs are not supported (Apple Silicon only).',
    win_dl:'Download for Windows', win_meta:'.exe · Windows 10/11 · 64-bit',
    win_warn_t:'⚠️ If a blue "Windows protected your PC" screen appears (this is normal)',
    win_warn_b:'It shows because the app isn\'t code-signed <b>yet</b>. It is not a virus — click <b>More info</b>, then <b>Run anyway</b>.',
    win_s1:'Run the <b>.exe</b> you downloaded. A blue <b>“Windows protected your PC”</b> screen appears — click <b>More info</b> on the left.',
    win_s2:'A <b>Run anyway</b> button appears. Click it to start installing. The publisher showing as <b>“Unknown”</b> is just because it isn\'t signed yet — it\'s not a virus.',
    win_s3:'The installer runs. Give it a moment.',
    win_s4:'Once installed, the boss icon appears in the <b>system tray</b> (bottom-right). If you don\'t see it, click <b>∧</b> to show hidden icons.',
    win_s5:'<b>All done!</b> <b>Right-click</b> the tray icon → <b>Settings…</b> to change character, name, size and position. It grovels harder the angrier you type.',
    wcap1:'Click “More info”',
    wcap2:'Click “Run anyway” to install',
    wcap3:'The installer is running',
    wcap4:'The boss icon in your tray',
    wcap5:'Right-click → Settings… to customize',
    win_faq_t:'Why the warning?',
    win_faq_b:'Windows code signing for individual developers is still pending (cost and validation). Warnings fade as downloads grow, and we\'re looking at <b>free signing (SignPath)</b> after open-sourcing. The app still never records or transmits what you type.',
    win_soon_t:'🪟 The Windows version is on the way',
    win_soon_b:'Only macOS is out right now. Register your interest — if enough people want it, we build it next.',
    win_soon_btn:'Register interest',
    back:'← Back to NunchiBoss'
  };
  const KO = {};
  document.querySelectorAll('[data-i18n]').forEach(el=>KO[el.dataset.i18n]=el.innerHTML);
  const TITLES={ko:document.title, en:'Download & Install — NunchiBoss'};
  let lang = localStorage.getItem('sajoe_lang') || 'ko';
  const t = k => (lang==='en' && EN[k]!==undefined) ? EN[k] : KO[k];
  function setLang(l){
    lang=l; localStorage.setItem('sajoe_lang',l); document.documentElement.lang=l;
    document.title=TITLES[l]||TITLES.ko;
    document.querySelectorAll('[data-i18n]').forEach(el=>{ el.innerHTML = t(el.dataset.i18n); });
    document.querySelectorAll('.lang-btn').forEach(b=>b.classList.toggle('active',b.dataset.lang===l));
  }
  document.querySelectorAll('.lang-btn').forEach(b=>b.addEventListener('click',()=>setLang(b.dataset.lang)));

  // 다운로드 링크 세팅
  document.getElementById('macDl').href = MAC_DOWNLOAD_URL;
  if(WIN_DOWNLOAD_URL){
    document.getElementById('winDl').href = WIN_DOWNLOAD_URL;
    document.getElementById('winReady').hidden = false;
    document.getElementById('winSoon').hidden = true;
  }

  // OS 선택: ?os= 파라미터 우선, 없으면 자동 감지
  function detectOS(){
    const p = new URLSearchParams(location.search).get('os');
    if(p === 'mac' || p === 'win') return p;
    const ua = navigator.userAgent || '';
    if(/Win/i.test(ua)) return 'win';
    return 'mac'; // 기본은 macOS(현재 출시 플랫폼)
  }
  function showOS(os){
    document.getElementById('mac').hidden = (os !== 'mac');
    document.getElementById('win').hidden = (os !== 'win');
    document.querySelectorAll('.os-tab').forEach(b=>b.classList.toggle('active', b.dataset.os===os));
    try{ history.replaceState(null,'', '?os='+os); }catch(_){}
  }
  document.querySelectorAll('.os-tab').forEach(b=>b.addEventListener('click',()=>showOS(b.dataset.os)));

  // 스크린샷 슬롯은 기본 숨김. 이미지가 실제로 로드될 때만 보여준다(파일 넣으면 자동으로 뜸).
  document.querySelectorAll('.shot img').forEach(img=>{
    const show = () => { const f = img.closest('.shot'); if(f) f.classList.add('ready'); };
    img.addEventListener('load', show);
    if(img.complete && img.naturalWidth > 0) show(); // 스크립트 실행 전 이미 로드된 경우
  });

  if(lang!=='ko') setLang(lang);
  showOS(detectOS());
