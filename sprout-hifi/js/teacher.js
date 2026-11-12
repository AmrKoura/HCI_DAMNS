/* Teacher view: shared top bar and the answer key pop-up. Load right after the <body> content. */

function teacherNav(active) {
  var items = [
    ["dashboard", "dashboard.html", "layout-dashboard", "Dashboard", ""],
    ["papers", "papers.html", "file-check-2", "Papers", ""],
    ["messages", "messages.html", "message-circle", "Messages", '<span class="count">3</span>'],
    ["settings", "settings.html", "settings", "Settings", ""]
  ];
  return '<div class="t-top-in">' +
    '<a class="t-logo" href="dashboard.html"><span class="mark"><i data-lucide="sprout" class="i-sm"></i></span><span data-app-name>Sprout</span></a>' +
    '<nav class="t-nav" aria-label="Main">' + items.map(function (it) {
      return '<a href="' + it[1] + '"' + (it[0] === active ? ' class="on" aria-current="page"' : "") + '><i data-lucide="' + it[2] + '" class="i-sm"></i><span class="txt">' + it[3] + "</span>" + it[4] + "</a>";
    }).join("") + "</nav>" +
    '<div class="t-user"><span class="name">Frau Weber<small>Math and Science</small></span>' +
    '<a class="t-av" href="settings.html" aria-label="My profile">KW</a>' +
    '<a class="icon-btn" href="../index.html" aria-label="Log out"><i data-lucide="log-out" class="i-sm"></i></a></div></div>';
}

(function () {
  var h = document.querySelector("header.t-top");
  if (h) h.innerHTML = teacherNav(h.getAttribute("data-active"));
})();

/* Answer key pop-up (Math Test 3). Call openKey(). */
var KEY_ROWS = [
  { q: 1, ans: "34 + 25 = 59", pts: 4, skill: "Adding tens", steps: "Setup, ones, tens, answer" },
  { q: 2, ans: "74", pts: 4, skill: "Place value", steps: "Answer only" },
  { q: 3, ans: "52 − 27 = 25", pts: 4, skill: "Subtracting with borrowing", steps: "Setup, ones, tens, answer" },
  { q: 4, ans: "63 − 18 = 45", pts: 4, skill: "Subtracting with borrowing", steps: "Setup, ones, tens, answer" },
  { q: 5, ans: "40 − 15 = 25 apples", pts: 4, skill: "Word problems", steps: "Number sentence, answer" }
];

function keyHTML(edit) {
  var skills = ["Adding tens", "Place value", "Subtracting with borrowing", "Word problems"];
  return '<div style="display:flex;justify-content:space-between;align-items:center;gap:12px">' +
    '<div><h2 style="font-size:20px" id="keyTitle">Answer key · Math Test 3</h2><p class="muted" style="font-size:14px">5 questions · 20 points</p></div>' +
    '<button class="icon-btn" data-k="close" aria-label="Close"><i data-lucide="x" class="i-sm"></i></button></div>' +
    '<div class="tbl-wrap"><table class="tbl"><thead><tr><th>Q</th><th>Correct answer</th><th>Points</th><th>Skill</th><th>Marks per step</th></tr></thead><tbody>' +
    KEY_ROWS.map(function (r) {
      if (!edit) return "<tr><td><b>" + r.q + "</b></td><td>" + r.ans + "</td><td>" + r.pts + "</td><td>" + r.skill + "</td><td>" + r.steps + "</td></tr>";
      return "<tr><td><b>" + r.q + '</b></td><td><input aria-label="Answer ' + r.q + '" value="' + r.ans + '"></td><td style="width:90px"><input aria-label="Points ' + r.q + '" value="' + r.pts + '"></td><td><select aria-label="Skill ' + r.q + '">' +
        skills.map(function (s) { return "<option" + (s === r.skill ? " selected" : "") + ">" + s + "</option>"; }).join("") +
        '</select></td><td><input aria-label="Steps ' + r.q + '" value="' + r.steps + '"></td></tr>';
    }).join("") + "</tbody></table></div>" +
    (edit
      ? '<div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap"><span class="pill pill-unsure"><i data-lucide="info" class="i-sm"></i>Saving re-marks papers that are not released yet. Marks you changed yourself are kept.</span><span style="flex:1"></span><button class="btn btn-ghost" data-k="view">Cancel</button><button class="btn btn-primary" data-k="save">Save changes</button></div>'
      : '<div style="display:flex;justify-content:flex-end;gap:10px"><button class="btn btn-ghost" data-k="close">Close</button><button class="btn btn-primary" data-k="edit"><i data-lucide="pencil" class="i-sm"></i>Edit answer key</button></div>');
}

function openKey() {
  var ov = document.getElementById("keyOverlay");
  if (!ov) {
    ov = document.createElement("div");
    ov.id = "keyOverlay"; ov.className = "t-overlay";
    ov.innerHTML = '<div class="t-modal" role="dialog" aria-modal="true" aria-labelledby="keyTitle"></div>';
    document.body.appendChild(ov);
    ov.addEventListener("click", function (e) {
      if (e.target === ov) { ov.hidden = true; return; }
      var b = e.target.closest("[data-k]"); if (!b) return;
      var k = b.dataset.k;
      if (k === "close") ov.hidden = true;
      if (k === "edit") draw(true);
      if (k === "view") draw(false);
      if (k === "save") { ov.hidden = true; toast("Answer key saved. 41 papers re-marked."); }
    });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") ov.hidden = true; });
  }
  function draw(edit) { ov.firstChild.innerHTML = keyHTML(edit); refreshIcons(); }
  draw(false);
  ov.hidden = false;
}
