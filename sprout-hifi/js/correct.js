/* Correcting workspace. One script for both pages:
   correct.html sets window.SINGLE = true (one paper), bulk.html sets it to false (22 papers). */
(function () {
  var SINGLE = window.SINGLE === true;
  var $ = function (id) { return document.getElementById(id); };

  var ALL = SINGLE ? ["Lina A."] : ["Lina A.", "Omar B.", "Mia C.", "Hana E.", "Sara G.", "Adam H.", "Nour I.", "Laila K.", "Yara M.", "Tarek N.", "Salma O.", "Ziad P.", "Farah Q.", "Malik R.", "Dina S.", "Jana T.", "Rami U.", "Hadi V.", "Lara W.", "Sami X.", "Noor Y.", "Leo Z."];
  var SKILLS = ["Adding tens", "Place value", "Borrowing", "Borrowing", "Word problems"];

  /* three kinds of paper, reused across the class */
  var V = [
    { lines: [
        { q: 1, text: "34 + 25 = 59" },
        { q: 2, pre: "7 tens 4 ones = ", u: "4?", why: "Is it 47 or 41? The AI is 62% sure.", opts: ["47", "41"] },
        { q: 3, pre: "52 − 27 = ", u: "35", why: "Crossed-out work found (45).", opts: ["Use 35", "Use 45"] },
        { q: 4, pre: "63 − 18 = ", u: "45", why: "The 5 is written backwards. The meaning is clear, so no marks lost.", opts: ["Keep 45", "Change"] },
        { q: 5, text: "40 − 15 = 25 apples" } ],
      scan: ["1) 34 + 25 = 59", "2) 7 tens 4 ones = <span class='u'>47</span>", "3) 52 − 27 = <s>45</s> <span class='u'>35</span>", "4) 63 − 18 = 4<span class='u' style='display:inline-block;transform:scaleX(-1)'>5</span>", "5) 40 − 15 = 25 apples"],
      circle: 2, circled: "3) 52 − 27 = <span class='circ'>35</span>",
      marks: [[4, "Correct method and answer."], [0, "Digits swapped (74 written as 47)."], [2, "Set up right, but did not borrow in the tens."], [4, "Correct. Backwards 5 accepted."], [4, "Correct number sentence and answer."]],
      fb: ["You added the tens perfectly!", "Your working out is so neat!", "Borrowing from the tens. Let's fix it together!"] },
    { lines: [
        { q: 1, text: "34 + 25 = 59" }, { q: 2, text: "7 tens 4 ones = 74" }, { q: 3, text: "52 − 27 = 25" }, { q: 4, text: "63 − 18 = 55" },
        { q: 5, pre: "40 − 15 = ", u: "2?", post: " apples", why: "Is it 25 or 26? The AI is 58% sure.", opts: ["25", "26"] } ],
      scan: ["1) 34 + 25 = 59", "2) 7 tens 4 ones = 74", "3) 52 − 27 = 25", "4) 63 − 18 = 55", "5) 40 − 15 = <span class='u'>25</span> apples"],
      circle: 3, circled: "4) 63 − 18 = <span class='circ'>55</span>",
      marks: [[4, "Correct."], [4, "Correct."], [4, "Correct."], [2, "Borrowed in the ones, but the tens are wrong."], [4, "Correct."]],
      fb: ["Great place value!", "You checked your work.", "Borrowing in the tens: one more try!"] },
    { lines: [
        { q: 1, text: "34 + 25 = 59" }, { q: 2, text: "7 tens 4 ones = 74" }, { q: 3, text: "52 − 27 = 25" }, { q: 4, text: "63 − 18 = 45" }, { q: 5, text: "40 − 15 = 25 apples" } ],
      scan: ["1) 34 + 25 = 59", "2) 7 tens 4 ones = 74", "3) 52 − 27 = 25", "4) 63 − 18 = 45", "5) 40 − 15 = 25 apples"],
      circle: -1,
      marks: [[4, "Correct."], [4, "Correct."], [4, "Correct."], [4, "Correct."], [4, "Correct."]],
      fb: ["Every answer is right!", "Super neat columns!", "Try the challenge question next time."] }
  ];
  var FLAGS = {
    "Lina A.": { skill: "Subtracting with borrowing", seen: "3 of the last 3 tests", conf: "High", ev: [["Test 1 · 12 Sep", "41 − 16 = 35"], ["Test 2 · 26 Sep", "73 − 48 = 35"], ["Test 3 · 7 Oct", "52 − 27 = 35"]] },
    "Omar B.": { skill: "Subtracting with borrowing", seen: "2 of the last 3 tests", conf: "Medium", ev: [["Test 2 · 26 Sep", "81 − 36 = 55"], ["Test 3 · 7 Oct", "63 − 18 = 55"]] },
    "Hana E.": { skill: "Subtracting with borrowing", seen: "2 of the last 3 tests", conf: "Medium", ev: [["Test 1 · 12 Sep", "42 − 17 = 35"], ["Test 3 · 7 Oct", "52 − 27 = 35"]] },
    "Nour I.": { skill: "Word problems", seen: "1 of the last 3 tests", conf: "Low", ev: [["Test 3 · 7 Oct", "40 + 15 = 55"]] }
  };
  var FLAGGED = ALL.filter(function (n) { return FLAGS[n]; });
  var STEPS = ["Check text", "Confirm grade", "Red flags", "Release"];
  var ICONS = ["scan-text", "list-checks", "flag", "send"];

  var S = { step: 1, idx: SINGLE ? 0 : 10, done: SINGLE ? [1, 0, 0, 0] : [22, 10, 0, 0], resume: true, choice: {}, marks: {}, edit: null, decision: {} };

  function list() { return S.step === 2 ? FLAGGED : ALL; }
  function sizes(i) { return i === 2 ? FLAGGED.length : ALL.length; }
  function variant(name) { return V[ALL.indexOf(name) % 3]; }
  function key(name, q) { return name + "|" + q; }
  function markOf(name, q) { var k = key(name, q); return S.marks[k] !== undefined ? S.marks[k] : variant(name).marks[q - 1][0]; }
  function grade(total) {
    var p = total / 20 * 100;
    if (p >= 92) return "1 (sehr gut)"; if (p >= 81) return "2 (gut)"; if (p >= 67) return "3 (befriedigend)";
    if (p >= 50) return "4 (ausreichend)"; if (p >= 30) return "5 (mangelhaft)"; return "6 (ungenügend)";
  }

  function render() {
    var L = list();
    if (S.idx > L.length - 1) S.idx = 0;
    var name = L[S.idx], v = variant(name), first = name.split(" ")[0];

    /* stepper */
    $("stepper").innerHTML = STEPS.map(function (s, i) {
      var cls = i === S.step ? "on" : (S.done[i] >= sizes(i) ? "done" : "");
      var count = SINGLE ? "" : " · " + Math.min(S.done[i], sizes(i)) + "/" + sizes(i);
      return (i ? '<span class="sep"></span>' : "") + '<button class="' + cls + '" data-go="' + i + '"><i data-lucide="' + (cls === "done" ? "check" : ICONS[i]) + '" class="i-sm"></i>' + (i + 1) + " " + s + count + "</button>";
    }).join("");

    $("resume").hidden = !S.resume;

    /* rail */
    if (!SINGLE) {
      $("railTitle").textContent = S.step === 2 ? FLAGGED.length + " papers with red flags" : ALL.length + " papers in this batch";
      $("railList").innerHTML = L.map(function (n, i) {
        var d = i < S.done[S.step], cur = i === S.idx;
        var vv = variant(n), extra = "";
        if (S.step === 0) { var u = vv.lines.filter(function (l) { return l.u; }).length; extra = u ? u + " unsure" : ""; }
        if (S.step === 1) { var t = 0; for (var q = 1; q <= 5; q++) t += markOf(n, q); extra = t + "/20"; }
        return '<button class="' + (cur ? "cur" : "") + (d ? " done" : "") + '" data-pick="' + i + '"><span class="mk"><i data-lucide="' + (d ? "circle-check" : (cur ? "circle-dot" : "circle")) + '" class="i-sm"></i></span>' + n + '<span class="x">' + extra + "</span></button>";
      }).join("");
    }

    /* scan */
    $("scanName").textContent = name;
    $("scanBody").innerHTML = v.scan.map(function (l, i) {
      var html = S.step === 3 && i === v.circle ? v.circled : (S.step === 0 ? l : l.replace(/class='u'/g, ""));
      return '<div class="hw">' + html + "</div>";
    }).join("");
    $("circleActs").hidden = !(S.step === 3 && v.circle >= 0);

    /* panel */
    var p = "";
    if (S.step === 0) {
      var un = v.lines.filter(function (l) { return l.u; }).length;
      p += '<div class="panel-h"><h2>Step 1 · Check text</h2><span class="pill ' + (un ? "pill-unsure" : "pill-mint") + '"><i data-lucide="' + (un ? "scan-eye" : "circle-check") + '" class="i-sm"></i>' + (un ? un + " unsure on this paper" : "Nothing unsure on this paper") + "</span></div>";
      p += '<p class="muted" style="font-size:14px">Only the words the AI is unsure about are highlighted. You can still edit any line.</p>';
      p += v.lines.map(function (l) {
        var k = key(name, l.q);
        if (S.edit === k) {
          return '<div class="line"><span class="q">Q' + l.q + '</span><input class="edit" id="editIn" value="' + (l.text || (l.pre + (l.opts ? l.opts[0] : l.u) + (l.post || ""))) + '" aria-label="Edit question ' + l.q + '"><button class="btn btn-primary" style="min-height:36px" data-save="' + k + '">Save</button></div>';
        }
        if (!l.u) return '<div class="line"><span class="q">Q' + l.q + '</span><span class="txt">' + l.text + '</span><button class="btn btn-quiet" style="min-height:34px" data-edit="' + k + '"><i data-lucide="pencil" class="i-sm"></i>Edit</button></div>';
        var ch = S.choice[k] === undefined ? 0 : S.choice[k];
        return '<div class="line u"><span class="q">Q' + l.q + '</span><span class="txt">' + l.pre + "<mark>" + l.u + "</mark>" + (l.post || "") + '</span><button class="btn btn-quiet" style="min-height:34px" data-edit="' + k + '"><i data-lucide="pencil" class="i-sm"></i>Edit</button>' +
          '<span class="why"><i data-lucide="scan-eye" class="i-sm"></i>' + l.why + '</span><span class="opts">' +
          l.opts.map(function (o, j) { return '<button class="opt-b" data-ch="' + k + '" data-j="' + j + '" aria-pressed="' + (ch === j) + '">' + o + "</button>"; }).join("") + "</span></div>";
      }).join("");
    }
    if (S.step === 1) {
      var total = 0;
      var rows = v.marks.map(function (m, i) {
        var q = i + 1, mine = markOf(name, q); total += mine;
        return "<tr><td><b>Q" + q + "</b></td><td>" + SKILLS[i] + '</td><td><span class="ai">' + m[0] + '/4</span></td><td class="muted" style="font-size:13.5px">' + m[1] + '</td><td><input class="mk-in' + (mine !== m[0] ? " changed" : "") + '" type="number" min="0" max="4" value="' + mine + '" data-mk="' + key(name, q) + '" aria-label="Your mark for question ' + q + '"> <span class="muted">/4</span></td></tr>';
      }).join("");
      p += '<div class="panel-h"><h2>Step 2 · Confirm grade</h2><button class="btn btn-ghost" id="keyBtn" style="min-height:38px"><i data-lucide="key-round" class="i-sm"></i>Answer key</button></div>';
      p += '<p class="muted" style="font-size:14px">The AI suggests a mark for each question and says why. Change any mark you disagree with.</p>';
      p += '<div class="box"><div class="tbl-wrap"><table class="tbl"><thead><tr><th>Q</th><th>Skill</th><th>AI</th><th>Why</th><th>Your mark</th></tr></thead><tbody>' + rows + "</tbody></table></div></div>";
      p += '<div class="total"><span><small>Total</small><b>' + total + ' / 20</b></span><span><small>Grade</small><b>' + grade(total) + '</b></span><a class="scale" href="settings.html"><i data-lucide="settings-2" class="i-sm"></i>German 1 to 6 · change in Settings</a></div>';
    }
    if (S.step === 2) {
      var f = FLAGS[name], d = S.decision[name] || "confirm";
      p += '<div class="panel-h"><h2>Step 3 · Red flag</h2><span class="pill pill-flag"><i data-lucide="gauge" class="i-sm"></i>Confidence: ' + f.conf + "</span></div>";
      p += '<div class="flag-head"><span class="fi"><i data-lucide="flag"></i></span><span><b>' + f.skill + "</b><small>Seen in " + f.seen + ". Evidence from " + first + "'s own answers:</small></span></div>";
      p += '<div class="ev-row">' + f.ev.map(function (e) { return '<div class="ev"><small>' + e[0] + '</small><div class="hw">' + e[1] + "</div></div>"; }).join("") + "</div>";
      p += '<span class="fld-l">Your decision</span><div class="dec">' +
        '<label><input type="radio" name="dec" value="confirm"' + (d === "confirm" ? " checked" : "") + '><b><i data-lucide="check" class="i-sm"></i>Confirm</b><small>The plant droops gently and parents get Tonight\'s Activity.</small></label>' +
        '<label><input type="radio" name="dec" value="dismiss"' + (d === "dismiss" ? " checked" : "") + '><b><i data-lucide="x" class="i-sm"></i>Dismiss</b><small>A one-off, like being ill or a bad day.</small></label>' +
        '<label><input type="radio" name="dec" value="watch"' + (d === "watch" ? " checked" : "") + '><b><i data-lucide="eye" class="i-sm"></i>Keep watching</b><small>Check again after the next test.</small></label></div>';
      if (d === "dismiss") p += '<label class="fld-l" for="reason">Reason</label><select class="select" id="reason" style="border-radius:var(--r-md)"><option>Was ill</option><option>Had a bad day</option><option>Other</option></select>';
      p += '<label class="fld-l" for="note">Note (only teachers see this)</label><input class="input" id="note" placeholder="For example: talk to the learning support teacher first">';
      p += '<span class="pill" style="align-self:flex-start"><i data-lucide="info" class="i-sm"></i>Confirming does not message parents. You decide when to share.</span>';
    }
    if (S.step === 3) {
      p += '<div class="panel-h"><h2>Step 4 · Feedback and release</h2><span class="pill pill-mint"><i data-lucide="sparkles" class="i-sm"></i>Drafted by the AI, you decide</span></div>';
      p += '<div class="field"><label class="label" for="s1">Star 1</label><input class="input" id="s1" value="' + v.fb[0] + '"></div>';
      p += '<div class="field"><label class="label" for="s2">Star 2</label><input class="input" id="s2" value="' + v.fb[1] + '"></div>';
      p += '<div class="field"><label class="label" for="w1">Wish (next step)</label><input class="input" id="w1" value="' + v.fb[2] + '"></div>';
      p += '<div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap"><span class="fld-l">Add a message</span><button class="btn btn-ghost" style="min-height:36px" data-msg="text"><i data-lucide="message-square" class="i-sm"></i>Text</button><button class="btn btn-ghost" style="min-height:36px" data-msg="sticker"><i data-lucide="star" class="i-sm"></i>Sticker</button><button class="btn btn-ghost" style="min-height:36px" data-msg="voice"><i data-lucide="mic" class="i-sm"></i>Voice note</button></div>';
      p += '<label class="check" style="display:flex;gap:10px;align-items:center;font-size:14.5px"><input type="checkbox" checked style="width:18px;height:18px;accent-color:var(--indigo)"> Show the grade to ' + first + "</label>";
      p += '<label class="check" style="display:flex;gap:10px;align-items:center;font-size:14.5px"><input type="checkbox" checked style="width:18px;height:18px;accent-color:var(--indigo)"> Send Tonight\'s Activity to the parents (confirmed weakness)</label>';
    }
    $("panel").innerHTML = p;

    /* footer */
    $("prevStep").disabled = S.step === 0;
    if (!SINGLE) $("pos").innerHTML = "<b>" + name + "</b> · " + (S.idx + 1) + " of " + L.length;
    var last = S.idx === L.length - 1;
    var next = ["Text is correct · next paper", "Confirm · next paper", "Save · next flag"];
    var fin = SINGLE ? ["Text is correct: grade it", "Confirm grade", "Save flag decision", "Release to " + first] : ["Step 1 done: confirm grades", "Grades done: red flags", "Flags done: release", "Release all " + ALL.length + " papers"];
    $("primary").innerHTML = (S.step === 3 ? '<i data-lucide="send" class="i-sm"></i>' : "") + (S.step < 3 && !last ? next[S.step] : fin[S.step]) + (S.step < 3 ? '<i data-lucide="arrow-right" class="i-sm"></i>' : "");
    refreshIcons();
  }

  document.addEventListener("click", function (e) {
    var t = e.target.closest("button, a"); if (!t) return;
    if (t.dataset.go !== undefined) { S.step = +t.dataset.go; S.idx = 0; S.resume = false; S.edit = null; render(); }
    if (t.dataset.pick !== undefined) { S.idx = +t.dataset.pick; S.resume = false; S.edit = null; render(); }
    if (t.dataset.ch) { S.choice[t.dataset.ch] = +t.dataset.j; render(); }
    if (t.dataset.edit) { S.edit = t.dataset.edit; render(); var el = $("editIn"); if (el) el.focus(); }
    if (t.dataset.save) { S.edit = null; render(); toast("Line saved"); }
    if (t.dataset.msg) toast(t.dataset.msg === "voice" ? "Recording a voice note..." : t.dataset.msg === "sticker" ? "Sticker added: Super effort!" : "Message box opened");
    if (t.id === "keyBtn") openKey();
  });
  document.addEventListener("input", function (e) {
    if (e.target.dataset && e.target.dataset.mk) {
      var n = Math.max(0, Math.min(4, parseInt(e.target.value, 10) || 0));
      S.marks[e.target.dataset.mk] = n;
      var caret = e.target.dataset.mk;
      render();
      var again = document.querySelector('[data-mk="' + caret + '"]'); if (again) again.focus();
    }
  });
  document.addEventListener("change", function (e) {
    if (e.target.name === "dec") { S.decision[list()[S.idx]] = e.target.value; render(); }
  });

  $("hideResume").onclick = function () { S.resume = false; render(); };
  $("prevStep").onclick = function () { if (S.step > 0) { S.step--; S.idx = 0; S.edit = null; render(); } };
  if (!SINGLE) {
    $("prevPaper").onclick = function () { S.idx = Math.max(0, S.idx - 1); S.resume = false; render(); };
    $("nextPaper").onclick = function () { S.idx = Math.min(list().length - 1, S.idx + 1); S.resume = false; render(); };
  }
  $("primary").onclick = function () {
    var L = list(), last = S.idx === L.length - 1;
    S.resume = false; S.edit = null;
    if (S.step === 3) {
      toast(SINGLE ? "Released to Lina. She will get a notification." : "Released to 22 students and their parents.");
      setTimeout(function () { location.href = SINGLE ? "class.html" : "papers.html"; }, 1300);
      return;
    }
    if (last) { S.done[S.step] = sizes(S.step); S.step++; S.idx = 0; toast("Saved. Step " + S.step + " is done."); }
    else { S.done[S.step] = Math.max(S.done[S.step], S.idx + 1); S.idx++; }
    render();
    var m = document.querySelector(".w-main"); if (m) m.scrollTop = 0;
  };

  render();
})();
