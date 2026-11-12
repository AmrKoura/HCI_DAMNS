/* Student view helpers: plant drawings and the notification bell. */

/* Plant drawing. stage: "bloom" (growing tall), "droop" (needs water), "grow" (getting bigger), "sprout" (just planted) */
function plantSVG(stage) {
  var leaf = "#5FC39B", stem = "#3FA57F", pot = "#5B54A8", rim = "#2B2560", flower = "#FF9F6E";
  var potEl = '<path d="M30 112 h44 l-5 22 h-34 z" fill="' + pot + '"/><rect x="26" y="106" width="52" height="9" rx="4" fill="' + rim + '"/>';
  var body = "";
  if (stage === "bloom") {
    body = '<path d="M52 106 V38" stroke="' + stem + '" stroke-width="4" stroke-linecap="round"/>' +
      '<path d="M52 82 C34 80 26 66 28 54 C42 55 51 66 52 82Z" fill="' + leaf + '"/>' +
      '<path d="M52 66 C70 64 78 50 76 38 C62 40 53 50 52 66Z" fill="' + leaf + '"/>' +
      '<circle cx="52" cy="30" r="9" fill="' + flower + '"/><circle cx="52" cy="30" r="3.5" fill="#FFE7DA"/>';
  } else if (stage === "droop") {
    body = '<path d="M52 106 C52 80 56 62 72 58" stroke="' + stem + '" stroke-width="4" stroke-linecap="round" fill="none"/>' +
      '<path d="M53 86 C38 92 28 88 26 78 C38 74 49 78 53 86Z" fill="' + leaf + '" opacity=".85"/>' +
      '<path d="M66 60 C74 66 80 74 78 82 C70 78 66 70 66 60Z" fill="' + leaf + '" opacity=".85"/>' +
      '<circle cx="76" cy="62" r="7" fill="' + flower + '" opacity=".8"/>' +
      '<path d="M86 40 q4 8 0 10 q-4 -2 0 -10z" fill="#7FB8E8"/>';
  } else if (stage === "grow") {
    body = '<path d="M52 106 V60" stroke="' + stem + '" stroke-width="4" stroke-linecap="round"/>' +
      '<path d="M52 88 C36 86 30 74 32 64 C44 66 51 74 52 88Z" fill="' + leaf + '"/>' +
      '<path d="M52 74 C66 72 72 62 70 52 C58 54 53 62 52 74Z" fill="' + leaf + '"/>';
  } else {
    body = '<path d="M52 106 V86" stroke="' + stem + '" stroke-width="4" stroke-linecap="round"/>' +
      '<path d="M52 92 C42 91 37 84 38 77 C46 78 51 84 52 92Z" fill="' + leaf + '"/>' +
      '<path d="M52 92 C62 91 67 84 66 77 C58 78 53 84 52 92Z" fill="' + leaf + '"/>';
  }
  return '<svg viewBox="0 0 104 140" aria-hidden="true">' + body + potEl + "</svg>";
}

document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll("[data-plant]").forEach(function (el) {
    el.innerHTML = plantSVG(el.getAttribute("data-plant"));
  });

  var bell = document.getElementById("bell");
  var panel = document.getElementById("notifPanel");
  if (bell && panel) {
    bell.addEventListener("click", function (e) {
      e.stopPropagation();
      panel.hidden = !panel.hidden;
      bell.setAttribute("aria-expanded", panel.hidden ? "false" : "true");
    });
    document.addEventListener("click", function (e) {
      if (!panel.hidden && !panel.contains(e.target)) { panel.hidden = true; bell.setAttribute("aria-expanded", "false"); }
    });
  }
});
