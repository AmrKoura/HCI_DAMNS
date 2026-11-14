/* Shared behaviour for every page of the prototype. No backend: all data is in data.js. */
var APP_NAME = "Sprout";

function initPage() {
  document.querySelectorAll("[data-app-name]").forEach(function (el) { el.textContent = APP_NAME; });
  if (window.lucide) { window.lucide.createIcons({ attrs: { class: "i" } }); }
}

/* Re-draw icons after a script changes the page. */
function refreshIcons() {
  if (window.lucide) { window.lucide.createIcons(); }
}

/* Small confirmation message at the bottom of the screen. */
function toast(text) {
  var t = document.querySelector(".toast");
  if (!t) {
    t = document.createElement("div");
    t.className = "toast";
    t.setAttribute("role", "status");
    document.body.appendChild(t);
  }
  t.textContent = text;
  t.classList.add("show");
  clearTimeout(t._timer);
  t._timer = setTimeout(function () { t.classList.remove("show"); }, 2200);
}

/* Safe localStorage (some browsers block it). */
function store(key, value) {
  try {
    if (value === undefined) { return localStorage.getItem("sprout." + key); }
    localStorage.setItem("sprout." + key, value);
  } catch (e) { return null; }
}

/* Talk Back answers Lina sent from Mistake Replay. No backend, so they live in localStorage
   and the student, teacher and parent chats all read them from here. Pass a note to add one. */
function talkbackNotes(add) {
  var list;
  try { list = JSON.parse(store("talkback") || "[]"); } catch (e) { list = []; }
  if (!Array.isArray(list)) list = [];
  if (add) { list.push(add); store("talkback", JSON.stringify(list)); }
  return list;
}

document.addEventListener("DOMContentLoaded", initPage);
