/* Parent view: shared top bar (child switcher, language, profile, log out) and phone bottom bar. */

var P_LANG = store("lang") || "en";
var P_LANGS = [["en", "English"], ["ar", "العربية"], ["de", "Deutsch"]];

function parentNav(active) {
  var items = [
    ["overview", "overview.html", "house", "Overview", ""],
    ["tonight", "tonight.html", "moon-star", "Tonight's activity", ""],
    ["calendar", "calendar.html", "calendar-days", "Calendar", ""],
    ["messages", "messages.html", "message-circle", "Messages", '<span class="count">1</span>'],
    ["settings", "settings.html", "settings", "Settings", ""]
  ];
  var link = function (it, short) {
    return '<a href="' + it[1] + '"' + (it[0] === active ? ' class="on" aria-current="page"' : "") + '><i data-lucide="' + it[2] + '" class="i-sm"></i>' +
      (short ? "<span>" + it[3].replace("Tonight's activity", "Tonight") + "</span>" : it[3] + it[4]) + "</a>";
  };
  return {
    top: '<div class="p-top-in">' +
      '<a class="t-logo" href="overview.html" style="display:flex;align-items:center;gap:10px;font:800 19px var(--font-ui);color:var(--indigo);text-decoration:none"><span style="width:34px;height:34px;border-radius:10px;background:var(--apricot);display:grid;place-items:center"><i data-lucide="sprout" class="i-sm"></i></span><span data-app-name>Sprout</span></a>' +
      '<nav class="p-nav" aria-label="Main">' + items.map(function (it) { return link(it, false); }).join("") + "</nav>" +
      '<div class="p-right">' +
        '<div class="menu-wrap"><button class="child-btn" data-menu="kids" aria-expanded="false" aria-label="Choose child"><span class="ca">L</span><span class="nm">Lina A. · Grade 3</span><i data-lucide="chevron-down" class="i-sm"></i></button>' +
        '<div class="menu" id="menu-kids" hidden><small>Your children</small><button data-kid="Lina"><span class="child-btn" style="border:0;padding:0;min-height:0"><span class="ca">L</span></span>Lina A. · Grade 3<i data-lucide="check" class="i-sm tick"></i></button><button data-kid="Adam"><span class="child-btn" style="border:0;padding:0;min-height:0"><span class="ca" style="background:var(--mint-100);color:var(--mint-700)">A</span></span>Adam A. · Grade 1</button></div></div>' +
        '<div class="menu-wrap"><button class="icon-btn" data-menu="lang" aria-expanded="false" aria-label="Language"><i data-lucide="globe" class="i-sm"></i></button>' +
        '<div class="menu" id="menu-lang" hidden><small>Language</small>' + P_LANGS.map(function (l) {
          return '<button data-lang="' + l[0] + '"' + (l[0] === "ar" ? ' style="font-family:var(--font-ar)"' : "") + ">" + l[1] + (l[0] === P_LANG ? '<i data-lucide="check" class="i-sm tick"></i>' : "") + "</button>";
        }).join("") + "</div></div>" +
        '<a class="icon-btn" href="settings.html" aria-label="My profile"><i data-lucide="circle-user-round" class="i-sm"></i></a>' +
        '<a class="icon-btn" href="../index.html" aria-label="Log out"><i data-lucide="log-out" class="i-sm"></i></a>' +
      "</div></div>",
    bottom: items.map(function (it) { return link(it, true); }).join("")
  };
}

(function () {
  var h = document.querySelector("header.p-top");
  if (!h) return;
  var n = parentNav(h.getAttribute("data-active"));
  h.innerHTML = n.top;
  var b = document.createElement("nav");
  b.className = "p-bottom"; b.setAttribute("aria-label", "Main"); b.innerHTML = n.bottom;
  document.body.appendChild(b);

  document.addEventListener("click", function (e) {
    var t = e.target.closest("[data-menu]");
    document.querySelectorAll(".menu").forEach(function (m) {
      if (!t || m.id !== "menu-" + t.dataset.menu) m.hidden = true;
    });
    if (t) {
      var m = document.getElementById("menu-" + t.dataset.menu);
      m.hidden = !m.hidden; t.setAttribute("aria-expanded", m.hidden ? "false" : "true");
      return;
    }
    var l = e.target.closest("[data-lang]");
    if (l) {
      store("lang", l.dataset.lang);
      toast(l.dataset.lang === "ar" ? "تم تغيير اللغة إلى العربية" : l.dataset.lang === "de" ? "Sprache: Deutsch" : "Language: English");
      setTimeout(function () { location.reload(); }, 700);
    }
    var k = e.target.closest("[data-kid]");
    if (k && k.dataset.kid === "Adam") toast("Adam is in Grade 1, so he sees comments only. This prototype shows Lina.");
  });
})();
