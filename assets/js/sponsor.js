  const EN = {
    h1:'One coffee becomes the next Nunchi app',
    sub:'NunchiBoss stays <b>free, always</b> — support only if you feel like it.',
    kofi_t:'Buy me a coffee', kofi_d:'Ko-fi · international cards & PayPal · one-time, no strings',
    kr_t:'Korean cards & wallets', kr_d:'Coming soon',
    u_title:'Where your coffee goes',
    u1:'<b>The next Nunchi app</b> — new characters, new situations',
    u2:'<b>The Windows version</b> — the most requested thing by far',
    u3:'<b>More faces and lines</b> — so the boss can grovel in new ways',
    u4:'<b>Keeping it shipped</b> — code signing, notarization, the yearly costs',
    n_title:'Why support, and not ads?',
    n_body:'NunchiBoss has <b>no ads, no accounts, and we never collect or sell your data.</b> The app makes no network calls at all. <b>We chose support over ads and data.</b><br><br>Everything stays <b>free whether you give or not</b> — using it is already enough. Payment happens entirely on an external page; this button only opens your browser.<br><br>It\'s a real help to us — but honestly, the first thing it gives back is that small warm feeling of <b>"I helped keep something I like alive."</b>',
    close:'Give or don\'t — the boss will keep groveling either way. Thanks for being here.',
    back:'← Back to NunchiBoss'
  };
  const KO = {};
  document.querySelectorAll('[data-i18n]').forEach(el=>KO[el.dataset.i18n]=el.innerHTML);
  const TITLES={ko:document.title, en:'Support — NunchiBoss'};
  let lang = localStorage.getItem('sajoe_lang') || 'ko';
  const t = k => (lang==='en' && EN[k]!==undefined) ? EN[k] : KO[k];
  function setLang(l){
    lang=l; localStorage.setItem('sajoe_lang',l); document.documentElement.lang=l;
    document.title=TITLES[l]||TITLES.ko;
    document.querySelectorAll('[data-i18n]').forEach(el=>{ el.innerHTML = t(el.dataset.i18n); });
    document.querySelectorAll('.lang-btn').forEach(b=>b.classList.toggle('active',b.dataset.lang===l));
  }
  document.querySelectorAll('.lang-btn').forEach(b=>b.addEventListener('click',()=>setLang(b.dataset.lang)));
  if(lang!=='ko') setLang(lang);
