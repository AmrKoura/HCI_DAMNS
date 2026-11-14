/* Talk Back: read-aloud and the voice recording sheet, shared by the student pages
   (messages.html, result.html, mistakes.html). Load after app.js. */

var Talk = (function () {
  var synth = window.speechSynthesis;
  var canSpeak = !!(synth && window.SpeechSynthesisUtterance);
  var token = 0, fallback = null;

  /* Exam language: "?subject=german" in the address wins, then <body data-subject>. */
  function examLang() {
    var q = new URLSearchParams(location.search).get("subject");
    var s = (q || document.body.getAttribute("data-subject") || "").toLowerCase();
    return s === "german" || s === "deutsch" ? "de" : "en";
  }
  /* The student's EN | DE toggle wins once the child has used it. Otherwise:
     Teacher settings > Feedback defaults > Read-aloud language, else the exam's language.
     No German voice installed? speak() then leaves the voice to the browser's default. */
  function lang() {
    var mine = store("studentLang");
    if (mine === "de" || mine === "en") return mine === "de" ? "de-DE" : "en-GB";
    var pick = store("readLang");
    var l = pick === "de" || pick === "en" ? pick : examLang();
    return l === "de" ? "de-DE" : "en-GB";
  }
  function voiceFor(l) {
    try {
      var vs = synth.getVoices(), base = l.split("-")[0];
      return vs.filter(function (v) { return v.lang === l; })[0] ||
        vs.filter(function (v) { return v.lang && v.lang.split(/[-_]/)[0] === base; })[0] || null;
    } catch (e) { return null; }
  }

  /* Read text aloud. o: { lang, rate, onend }. Starting a new one stops the last one. */
  function speak(text, o) {
    o = o || {};
    stop();
    if (!canSpeak) return false;
    var my = token, done = false;
    function end() {
      if (done || my !== token) return;
      done = true; clearTimeout(fallback);
      if (o.onend) o.onend();
    }
    try {
      var u = new SpeechSynthesisUtterance(text);
      if (o.lang) { u.lang = o.lang; var v = voiceFor(o.lang); if (v) u.voice = v; }
      if (o.rate) u.rate = o.rate;
      u.onend = end; u.onerror = end;
      synth.speak(u);
      /* Some browsers never fire "end"; do not leave a card stuck as "reading". */
      if (o.onend) fallback = setTimeout(end, (text.length * 120 + 4000) / (o.rate || 1));
    } catch (e) { return false; }
    return true;
  }
  function stop() {
    token++; clearTimeout(fallback);
    try { if (canSpeak) synth.cancel(); } catch (e) {}
  }
  window.addEventListener("pagehide", stop);

  /* Parent settings > Privacy and consent > Voice answers. On unless the parent turned it off. */
  function voiceAllowed() { return store("consent.voice") !== "off"; }

  function clock(s) { return Math.floor(s / 60) + ":" + ("0" + (s % 60)).slice(-2); }
  /* student strings come from js/student.js when it is loaded */
  function say(key, en) { return typeof i18n === "function" ? i18n(key) : en; }

  /* ---- recording sheet ---- */
  var sheet = document.createElement("div");
  sheet.className = "overlay"; sheet.id = "recOverlay"; sheet.hidden = true;
  sheet.innerHTML =
    '<div class="dialog rec" role="dialog" aria-modal="true" aria-labelledby="recTitle" style="width:min(440px,100%)">' +
      '<h2 id="recAsk" class="rec-ask" hidden></h2>' +
      '<div style="display:flex;align-items:center;gap:10px"><span class="dot"></span><h2 id="recTitle" style="font-size:24px"><span id="recState">Recording</span> <span id="recTime">0:00</span></h2></div>' +
      '<div class="wave" style="height:44px"><i style="height:16px"></i><i style="height:34px;animation-delay:.1s"></i><i style="height:24px;animation-delay:.2s"></i><i style="height:40px;animation-delay:.3s"></i><i style="height:18px;animation-delay:.4s"></i><i style="height:30px;animation-delay:.5s"></i><i style="height:14px;animation-delay:.6s"></i><i style="height:26px;animation-delay:.7s"></i></div>' +
      '<p class="muted" id="recReply" hidden></p>' +
      '<p class="muted" style="font-size:15px"><i data-lucide="lock" class="i-sm" style="vertical-align:-3px"></i> <span id="recNote">Only Frau Weber can hear this.</span></p>' +
      '<div style="display:flex;gap:12px;width:100%">' +
        '<button class="btn btn-ghost btn-lg" id="recCancel" style="flex:1" data-i18n="rec.cancel">Cancel</button>' +
        '<button class="btn btn-ghost btn-lg" id="recAgain" style="flex:1" hidden><i data-lucide="rotate-ccw" class="i-sm"></i><span data-i18n="rec.again">Try again</span></button>' +
        '<button class="btn btn-primary btn-lg" id="recStop" style="flex:1" hidden><i data-lucide="square" class="i-sm"></i><span data-i18n="rec.stop">Stop</span></button>' +
        '<button class="btn btn-primary btn-lg" id="recSend" style="flex:1"><i data-lucide="send-horizontal" class="i-sm"></i><span data-i18n="rec.send">Send</span></button>' +
      "</div>" +
      '<button class="btn btn-quiet" id="recClose" hidden data-i18n="rec.cancel">Cancel</button>' +
    "</div>";
  document.body.appendChild(sheet);

  var $ = function (id) { return document.getElementById(id); };
  var opts = null, sec = 0, timer = null, back = null;

  function tick() { $("recTime").textContent = clock(sec); }
  function startRec() {
    sec = 0; tick();
    sheet.firstChild.classList.remove("paused");
    $("recState").textContent = say("rec.recording", "Recording");
    var review = !!opts.review;
    $("recCancel").hidden = false; $("recClose").hidden = true;
    $("recStop").hidden = !review; $("recAgain").hidden = true; $("recSend").hidden = review;
    clearInterval(timer);
    timer = setInterval(function () { sec++; tick(); }, 1000);
  }
  function stopRec() {
    clearInterval(timer);
    sheet.firstChild.classList.add("paused");
    $("recState").textContent = say("rec.yourAnswer", "Your answer");
    $("recCancel").hidden = true; $("recStop").hidden = true;
    $("recAgain").hidden = false; $("recSend").hidden = false; $("recClose").hidden = false;
    $("recSend").focus();
  }
  function close() {
    clearInterval(timer); sheet.hidden = true;
    if (back && back.focus) back.focus();
  }

  /* o: { title, note, reply, review, onSend(seconds, "m:ss") }
     review: false = Cancel / Send (chat). true = Stop, then Try again / Send. */
  function record(o) {
    opts = o || {};
    back = document.activeElement;
    $("recAsk").hidden = !opts.title; $("recAsk").textContent = opts.title || "";
    sheet.firstChild.setAttribute("aria-labelledby", opts.title ? "recAsk" : "recTitle");
    $("recReply").hidden = !opts.reply; $("recReply").textContent = opts.reply || "";
    $("recNote").textContent = opts.note || say("rec.onlyWeber", "Only Frau Weber can hear this.");
    sheet.hidden = false;
    startRec();
    (opts.review ? $("recStop") : $("recSend")).focus();
  }

  $("recCancel").onclick = close;
  $("recClose").onclick = close;
  $("recStop").onclick = stopRec;
  $("recAgain").onclick = function () { startRec(); $("recStop").focus(); };
  $("recSend").onclick = function () {
    var s = Math.max(sec, 1), cb = opts.onSend;
    close();
    if (cb) cb(s, clock(s));
  };
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !sheet.hidden) close(); });

  return { canSpeak: canSpeak, lang: lang, speak: speak, stop: stop, voiceAllowed: voiceAllowed, clock: clock, record: record };
})();
