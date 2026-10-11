/* Ask my AI: chat widget for the portfolio. Talks only to the Apps Script endpoint; no API key here. */
(function () {
  'use strict';
  var ENDPOINT = String(window.ASK_AI_ENDPOINT || '').trim();
  if (!ENDPOINT) return;

  var EMAIL = 'otheruse228@gmail.com';
  var SUGGESTIONS = [
    'What AI projects has he built?',
    'Is he a fit for an MIS Manager role?',
    'Which tools does he use?',
    'How can I contact him?'
  ];
  var SPARK = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l2 5.5 5.5 2-5.5 2L12 18l-2-5.5-5.5-2 5.5-2z"></path><path d="M19 16v4"></path><path d="M17 18h4"></path></svg>';
  var CLOSE = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>';
  var SEND = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12 14-7-4 7 4 7z"></path></svg>';

  var css = [
    '.aa-launch{position:fixed;right:20px;bottom:20px;z-index:60;display:inline-flex;align-items:center;gap:10px;min-height:52px;padding:0 20px 0 16px;border:0;border-radius:999px;background:var(--ac);color:var(--onAc);font-family:inherit;font-weight:700;font-size:16px;cursor:pointer;box-shadow:0 18px 40px -12px rgba(0,0,0,.6);transition:transform .2s ease}',
    '.aa-launch:hover{transform:translateY(-2px)}',
    '.aa-launch:focus-visible,.aa-chip:focus-visible,.aa-close:focus-visible,.aa-send:focus-visible{outline:2px solid var(--ink);outline-offset:3px}',
    '.aa-launch[aria-expanded="true"]{display:none}',
    '.aa-panel{position:fixed;right:20px;bottom:20px;z-index:61;width:min(400px,calc(100vw - 32px));height:min(600px,calc(100vh - 40px));display:flex;flex-direction:column;box-sizing:border-box;background:var(--surface);color:var(--ink);border:1px solid var(--line);border-radius:22px;box-shadow:0 30px 80px -20px rgba(0,0,0,.7);overflow:hidden;font-family:inherit;font-size:16px;line-height:1.5}',
    '.aa-panel[hidden]{display:none}',
    '.aa-head{display:flex;align-items:center;gap:12px;padding:12px 12px 12px 16px;border-bottom:1px solid var(--line)}',
    '.aa-badge{display:flex;flex:none;width:36px;height:36px;border-radius:50%;background:var(--ac);color:var(--onAc);align-items:center;justify-content:center}',
    '.aa-headtext{flex:1;min-width:0}',
    '.aa-title{margin:0;font-weight:700;font-size:16px;line-height:1.3}',
    '.aa-sub{margin:0;font-size:13px;line-height:1.4;color:var(--muted)}',
    '.aa-close{display:flex;flex:none;align-items:center;justify-content:center;width:44px;height:44px;border:0;border-radius:12px;background:transparent;color:var(--muted);cursor:pointer}',
    '.aa-close:hover{background:var(--surface2);color:var(--ink)}',
    '.aa-log{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:10px;overscroll-behavior:contain}',
    '.aa-msg{max-width:88%;padding:10px 14px;font-size:15px;line-height:1.5;white-space:pre-line;overflow-wrap:anywhere}',
    '.aa-bot{align-self:flex-start;background:var(--acSoft);border-radius:16px 16px 16px 4px}',
    '.aa-user{align-self:flex-end;background:var(--surface2);border-radius:16px 16px 4px 16px}',
    '.aa-typing{display:flex;gap:5px;padding:15px 16px}',
    '.aa-typing span{display:block;width:7px;height:7px;border-radius:50%;background:var(--acInk);animation:dots 1.2s infinite}',
    '.aa-typing span:nth-child(2){animation-delay:.15s}.aa-typing span:nth-child(3){animation-delay:.3s}',
    '.aa-suggest{display:flex;flex-wrap:wrap;gap:8px;padding:0 16px 12px}',
    '.aa-suggest[hidden]{display:none}',
    '.aa-chip{min-height:44px;box-sizing:border-box;border:1px solid var(--line);border-radius:999px;background:transparent;color:var(--ink);padding:8px 14px;font-family:inherit;font-size:14px;line-height:1.3;text-align:left;cursor:pointer}',
    '.aa-chip:hover{border-color:var(--ac)}',
    '.aa-form{display:flex;gap:8px;padding:12px;border-top:1px solid var(--line)}',
    '.aa-form input{flex:1;min-width:0;height:46px;box-sizing:border-box;padding:0 14px;border:1px solid var(--line);border-radius:12px;background:var(--bg);color:var(--ink);font-family:inherit;font-size:16px}',
    '.aa-form input::placeholder{color:var(--muted)}',
    '.aa-form input:focus{outline:2px solid var(--ac);outline-offset:0}',
    '.aa-send{display:flex;flex:none;align-items:center;justify-content:center;width:46px;height:46px;border:0;border-radius:12px;background:var(--ac);color:var(--onAc);cursor:pointer}',
    '.aa-send:disabled{opacity:.5;cursor:default}',
    '.aa-note{margin:0;padding:0 14px 12px;font-size:12px;line-height:1.4;color:var(--muted)}',
    '.aa-note a{color:var(--acInk)}',
    '.aa-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}',
    '@media (max-width:520px){.aa-launch{right:12px;bottom:12px;min-height:48px;padding:0 16px 0 12px;font-size:15px}.aa-panel{left:8px;right:8px;bottom:8px;width:auto;height:min(82vh,640px)}}',
    '@media (prefers-reduced-motion: reduce){.aa-launch{transition:none}.aa-typing span{animation:none}}'
  ].join('\n');

  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  var root = document.querySelector('.pf') || document.body;

  var launcher = document.createElement('button');
  launcher.type = 'button';
  launcher.className = 'aa-launch';
  launcher.setAttribute('aria-expanded', 'false');
  launcher.setAttribute('aria-controls', 'aa-panel');
  launcher.innerHTML = SPARK + '<span>Ask my AI</span>';

  var panel = document.createElement('section');
  panel.id = 'aa-panel';
  panel.className = 'aa-panel';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-labelledby', 'aa-title');
  panel.hidden = true;
  panel.innerHTML =
    '<div class="aa-head"><span class="aa-badge">' + SPARK + '</span>' +
    '<div class="aa-headtext"><p class="aa-title" id="aa-title">Ask about Saurabh</p>' +
    '<p class="aa-sub">An AI assistant that answers only from his CV and portfolio</p></div>' +
    '<button type="button" class="aa-close" aria-label="Close chat">' + CLOSE + '</button></div>' +
    '<div class="aa-log" aria-live="polite"></div>' +
    '<div class="aa-suggest"></div>' +
    '<form class="aa-form"><label class="aa-sr" for="aa-input">Your question</label>' +
    '<input id="aa-input" type="text" maxlength="400" autocomplete="off" placeholder="Ask about his work, skills or projects">' +
    '<button type="submit" class="aa-send" aria-label="Send question">' + SEND + '</button></form>' +
    '<p class="aa-note">AI can make mistakes. For anything important, email <a href="mailto:' + EMAIL + '">' + EMAIL + '</a>.</p>';

  root.appendChild(panel);
  root.appendChild(launcher);

  var log = panel.querySelector('.aa-log');
  var suggest = panel.querySelector('.aa-suggest');
  var form = panel.querySelector('.aa-form');
  var input = panel.querySelector('#aa-input');
  var send = panel.querySelector('.aa-send');
  var history = [];
  var busy = false;

  SUGGESTIONS.forEach(function (text) {
    var chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'aa-chip';
    chip.textContent = text;
    chip.addEventListener('click', function () { ask(text); });
    suggest.appendChild(chip);
  });

  addMessage('bot', "Hi! I'm Saurabh's AI assistant. Ask me about his experience, skills, projects or the roles he is open to.");

  function addMessage(who, text) {
    var div = document.createElement('div');
    div.className = 'aa-msg ' + (who === 'user' ? 'aa-user' : 'aa-bot');
    div.textContent = text;
    log.appendChild(div);
    log.scrollTop = log.scrollHeight;
    return div;
  }

  function addTyping() {
    var div = document.createElement('div');
    div.className = 'aa-msg aa-bot aa-typing';
    div.setAttribute('aria-label', 'Assistant is typing');
    div.innerHTML = '<span></span><span></span><span></span>';
    log.appendChild(div);
    log.scrollTop = log.scrollHeight;
    return div;
  }

  function setBusy(value) {
    busy = value;
    send.disabled = value;
    input.disabled = value;
  }

  function ask(raw) {
    var question = String(raw || '').trim();
    if (!question || busy) return;
    setBusy(true);
    suggest.hidden = true;
    addMessage('user', question);
    input.value = '';
    var typing = addTyping();
    var controller = typeof AbortController === 'function' ? new AbortController() : null;
    var timer = setTimeout(function () { if (controller) controller.abort(); }, 25000);

    fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ question: question, history: history.slice(-6) }),
      signal: controller ? controller.signal : undefined
    })
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(function (data) {
        var answer = data && typeof data.answer === 'string' && data.answer.trim()
          ? data.answer.trim()
          : 'Sorry, I could not answer that. Please email ' + EMAIL + '.';
        typing.remove();
        addMessage('bot', answer);
        if (data && data.ok && data.onTopic) {
          history.push({ role: 'user', text: question }, { role: 'model', text: answer });
        }
      })
      .catch(function () {
        typing.remove();
        addMessage('bot', "I couldn't reach the assistant just now. Please try again, or email " + EMAIL + '.');
      })
      .then(function () {
        clearTimeout(timer);
        setBusy(false);
        input.focus();
      });
  }

  function open() {
    panel.hidden = false;
    launcher.setAttribute('aria-expanded', 'true');
    input.focus();
  }

  function close() {
    panel.hidden = true;
    launcher.setAttribute('aria-expanded', 'false');
    launcher.focus();
  }

  launcher.addEventListener('click', open);
  panel.querySelector('.aa-close').addEventListener('click', close);
  panel.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
  form.addEventListener('submit', function (e) { e.preventDefault(); ask(input.value); });
})();
