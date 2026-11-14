/* Student view helpers: plant drawings, the notification bell, and the EN | DE language toggle. */

/* Plant drawing. stage: "bloom" (growing tall), "droop" (needs water), "grow" (getting bigger), "sprout" (just planted),
   "recover" (perking up: practice brought a drooping plant back up, but only exams make it grow tall). Plants never die. */
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
  } else if (stage === "recover") {
    /* upright again but shorter than "bloom": small fresh leaves, a closed bud and a mint sparkle */
    var fresh = "#7DD3B0";
    body = '<path d="M52 106 C52 94 51 82 53 68" stroke="' + stem + '" stroke-width="4" stroke-linecap="round" fill="none"/>' +
      '<path d="M52 92 C42 91 36 84 37 77 C46 78 51 84 52 92Z" fill="' + leaf + '"/>' +
      '<path d="M53 82 C62 81 67 74 66 67 C58 68 54 74 53 82Z" fill="' + fresh + '"/>' +
      '<path d="M53 68 C48 64 48 56 53 51 C58 56 58 64 53 68Z" fill="' + flower + '"/>' +
      '<path d="M53 69 C50 67 48 64 48 61 M53 69 C56 67 58 64 58 61" stroke="' + stem + '" stroke-width="2.5" stroke-linecap="round" fill="none"/>' +
      '<path d="M79 40 L81.2 45.8 L87 48 L81.2 50.2 L79 56 L76.8 50.2 L71 48 L76.8 45.8Z" fill="' + stem + '"/>' +
      '<path d="M28 58 L29.2 61 L32 62 L29.2 63 L28 66 L26.8 63 L24 62 L26.8 61Z" fill="' + fresh + '"/>';
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

/* ---------- EN | DE ----------
   One dictionary for the student interface. Markup uses data-i18n (text), data-i18n-html (text with <b>),
   data-i18n-ph (placeholder) and data-i18n-label (aria-label); scripts call i18n(key).
   Not in here on purpose: what the teacher wrote (stars, wish, chat messages). That stays in the teacher's language. */
var STUDENT_LANG = store("studentLang") === "de" ? "de" : "en";
var I18N = {
  /* top bar and shared */
  "lang.group": { en: "Language", de: "Sprache" },
  "nav.back": { en: "Back", de: "Zurück" },
  "nav.backSubjects": { en: "Back to subjects", de: "Zurück zu den Fächern" },
  "nav.notif": { en: "Notifications", de: "Mitteilungen" },
  "nav.messages1": { en: "Messages, 1 new", de: "Nachrichten, 1 neu" },
  "nav.logout": { en: "Log out", de: "Abmelden" },
  "notif.teachers": { en: "From your teachers", de: "Von deinen Lehrerinnen und Lehrern" },
  "notif.weber": { en: "From Frau Weber", de: "Von Frau Weber" },
  "notif.checkedWeber": { en: "Frau Weber checked your <b>Math Test 3</b>.", de: "Frau Weber hat deinen <b>Mathe-Test 3</b> angeschaut." },
  "notif.checkedMe": { en: "I checked your <b>Math Test 3</b>.", de: "Ich habe deinen <b>Mathe-Test 3</b> angeschaut." },
  "notif.practice": { en: "New practice for you: <b>borrowing from the tens</b>.", de: "Neue Übung für dich: <b>Minus mit Zehnerübergang</b>." },
  "notif.sticker": { en: "Frau Weber sent you a sticker.", de: "Frau Weber hat dir einen Sticker geschickt." },
  "notif.stickerMe": { en: "You got a sticker: <b>Super effort!</b>", de: "Du hast einen Sticker bekommen: <b>Super effort!</b>" },
  "time.900": { en: "Today, 9:00", de: "Heute, 9:00" },
  "time.901": { en: "Today, 9:01", de: "Heute, 9:01" },
  "time.902": { en: "Today, 9:02", de: "Heute, 9:02" },

  /* subjects */
  "subjects.hi": { en: "Hi Lina! Pick a subject", de: "Hallo Lina! Wähle ein Fach" },
  "subjects.class": { en: "Class 3B", de: "Klasse 3B" },
  "subjects.label": { en: "Subjects", de: "Fächer" },
  "subj.math": { en: "Math", de: "Mathe" },
  "subj.science": { en: "Science", de: "Sachkunde" },
  "subj.german": { en: "German", de: "Deutsch" },
  "subj.english": { en: "English", de: "Englisch" },
  "subj.art": { en: "Art", de: "Kunst" },
  "subj.music": { en: "Music", de: "Musik" },
  "badge.5new": { en: "5 new", de: "5 neu" },
  "badge.1new": { en: "1 new", de: "1 neu" },

  /* tests (names from the school timetable) */
  "test.t3": { en: "Math Test 3 · Subtraction", de: "Mathe-Test 3 · Minus rechnen" },
  "test.t4": { en: "Math Test 4 · Shapes", de: "Mathe-Test 4 · Formen" },
  "test.t5": { en: "Math Test 5 · Clock", de: "Mathe-Test 5 · Uhr" },
  "test.t2": { en: "Math Test 2 · Adding", de: "Mathe-Test 2 · Plus rechnen" },
  "test.t1": { en: "Math Test 1 · Numbers to 100", de: "Mathe-Test 1 · Zahlen bis 100" },
  "test.hw6": { en: "Homework sheet 6", de: "Hausaufgabenblatt 6" },
  "test.hw5": { en: "Homework sheet 5", de: "Hausaufgabenblatt 5" },
  "test.hw4": { en: "Homework sheet 4", de: "Hausaufgabenblatt 4" },
  "test.hw3": { en: "Homework sheet 3", de: "Hausaufgabenblatt 3" },
  "test.quiz2": { en: "Quiz · Times tables 2", de: "Quiz · Einmaleins 2" },

  /* home: garden and exams */
  "garden.title": { en: "My Math Garden", de: "Mein Mathe-Garten" },
  "garden.count": { en: "4 skills", de: "4 Themen" },
  "skill.adding": { en: "Adding", de: "Plus rechnen" },
  "skill.subtracting": { en: "Subtracting", de: "Minus rechnen" },
  "skill.placeValue": { en: "Place value", de: "Stellenwert" },
  "skill.shapes": { en: "Shapes", de: "Formen" },
  "plant.bloom": { en: "Growing tall!", de: "Wächst hoch!" },
  "plant.droop": { en: "Needs a little water", de: "Braucht ein bisschen Wasser" },
  "plant.grow": { en: "Getting bigger", de: "Wird größer" },
  "plant.sprout": { en: "Just planted", de: "Gerade gepflanzt" },
  "plant.recover": { en: "Perking up", de: "Wird wieder munter" },
  "legend.grow": { en: "growing", de: "wächst" },
  "legend.water": { en: "needs water", de: "braucht Wasser" },
  "legend.recover": { en: "perking up", de: "wird wieder munter" },
  "legend.label": { en: "What the plants mean", de: "Was die Pflanzen zeigen" },
  "garden.reset": { en: "Reset demo", de: "Demo zurücksetzen" },
  "garden.resetDone": { en: "Demo reset: the Subtracting plant needs water again", de: "Demo zurückgesetzt: Die Minus-Pflanze braucht wieder Wasser" },
  "home.results": { en: "You have 5 new results!", de: "Du hast 5 neue Ergebnisse!" },
  "home.resultsSub": { en: "See all your Math results", de: "Schau dir alle deine Mathe-Ergebnisse an" },
  "home.exams": { en: "My exams to send", de: "Meine Tests zum Abschicken" },
  "home.due12": { en: "Due Mon 12 Oct", de: "Abgabe: Mo., 12. Okt." },
  "home.due15": { en: "Due Thu 15 Oct", de: "Abgabe: Do., 15. Okt." },
  "home.due29": { en: "Due Thu 29 Oct", de: "Abgabe: Do., 29. Okt." },
  "home.submit": { en: "Submit", de: "Abgeben" },
  "home.checking": { en: "Your teacher is checking it", de: "Deine Lehrerin schaut ihn gerade an" },
  "home.sent": { en: "Sent", de: "Abgeschickt" },

  /* submit */
  "submit.due": { en: "Due Thursday 15 October", de: "Abgabe: Donnerstag, 15. Oktober" },
  "submit.how": { en: "How to add pages", de: "So fügst du Seiten hinzu" },
  "submit.add": { en: "Add your pages", de: "Füge deine Seiten hinzu" },
  "submit.camera": { en: "Use camera", de: "Kamera" },
  "submit.upload": { en: "Upload photos", de: "Fotos hochladen" },
  "submit.tip": { en: "Hold still, good light", de: "Still halten, gutes Licht" },
  "submit.fit": { en: "Fit the whole page inside the corners", de: "Die ganze Seite muss in die Ecken passen" },
  "submit.shutter": { en: "Take photo", de: "Foto machen" },
  "submit.drag": { en: "Drag your photos here", de: "Zieh deine Fotos hierher" },
  "submit.or": { en: "or", de: "oder" },
  "submit.choose": { en: "Choose from my photos", de: "Aus meinen Fotos wählen" },
  "submit.types": { en: "Photos or PDF · one page per photo", de: "Fotos oder PDF · eine Seite pro Foto" },
  "submit.myPages": { en: "My pages", de: "Meine Seiten" },
  "submit.page": { en: "Page {n}", de: "Seite {n}" },
  "submit.pages1": { en: "1 page", de: "1 Seite" },
  "submit.pagesN": { en: "{n} pages", de: "{n} Seiten" },
  "submit.clear": { en: "Clear photo!", de: "Klares Foto!" },
  "submit.blurry": { en: "Too blurry. Try again!", de: "Zu unscharf. Mach es nochmal!" },
  "submit.again": { en: "Again", de: "Nochmal" },
  "submit.remove": { en: "Remove {p}", de: "{p} löschen" },
  "submit.addPage": { en: "Add a page", de: "Seite hinzufügen" },
  "submit.help": { en: "A teacher or a grown-up at home can help you, or send it for you.", de: "Deine Lehrerin oder ein Erwachsener zu Hause kann dir helfen oder es für dich schicken." },
  "submit.send": { en: "Send to my teacher", de: "Schick es an meine Lehrerin" },
  "submit.niceToast": { en: "Clear photo. Nice!", de: "Klares Foto. Super!" },
  "submit.addedToast": { en: "Page {n} added", de: "Seite {n} hinzugefügt" },
  "submit.photos1Toast": { en: "1 photo added", de: "1 Foto hinzugefügt" },
  "submit.photosNToast": { en: "{n} photos added", de: "{n} Fotos hinzugefügt" },
  "submit.retakeToast": { en: "Take page 2 again first.", de: "Mach zuerst Seite 2 nochmal." },

  /* waiting */
  "wait.title": { en: "Sent! Frau Weber is checking your Math test.", de: "Geschickt! Frau Weber schaut sich deinen Mathe-Test an." },
  "wait.text": { en: "You will see your results here as soon as she is ready. We will tell you with a bell.", de: "Sobald sie fertig ist, siehst du hier deine Ergebnisse. Eine Glocke sagt dir Bescheid." },
  "wait.where": { en: "Where your test is", de: "Wo dein Test gerade ist" },
  "wait.sent": { en: "Sent", de: "Geschickt" },
  "wait.checking": { en: "Teacher checking", de: "Lehrerin schaut nach" },
  "wait.ready": { en: "Ready for you", de: "Fertig für dich" },
  "wait.back": { en: "Back to Math", de: "Zurück zu Mathe" },

  /* results list */
  "results.title": { en: "My Math results", de: "Meine Mathe-Ergebnisse" },
  "results.doing": { en: "How I am doing", de: "So klappt es bei mir" },
  "results.last3": { en: "Last 3 tests", de: "Letzte 3 Tests" },
  "results.better": { en: "Better every test", de: "Jedes Mal besser" },
  "results.practise": { en: "Let's practise", de: "Lass uns üben" },
  "results.steady": { en: "Staying steady", de: "Bleibt gleich" },
  "results.soon": { en: "Starting soon", de: "Kommt bald" },
  "results.new": { en: "New for you", de: "Neu für dich" },
  "results.older": { en: "Older results", de: "Ältere Ergebnisse" },
  "results.d7": { en: "7 Oct · 2 mistakes to look at", de: "7. Okt. · 2 Fehler zum Anschauen" },
  "results.d5": { en: "5 Oct · No mistakes!", de: "5. Okt. · Keine Fehler!" },
  "results.d2": { en: "2 Oct · 2 mistakes to look at", de: "2. Okt. · 2 Fehler zum Anschauen" },
  "results.d28": { en: "28 Sep · 1 mistake to look at", de: "28. Sep. · 1 Fehler zum Anschauen" },
  "results.d26": { en: "26 Sep · 1 mistake to look at", de: "26. Sep. · 1 Fehler zum Anschauen" },
  "results.d12": { en: "12 Sep · Opened", de: "12. Sep. · Angeschaut" },
  "results.d10": { en: "10 Sep · Opened", de: "10. Sep. · Angeschaut" },

  /* one result */
  "result.checked": { en: "Checked on 7 October", de: "Angeschaut am 7. Oktober" },
  "result.grew": { en: "Your Adding plant grew!", de: "Deine Plus-Pflanze ist gewachsen!" },
  "result.grewWhy": { en: "You added the tens right every time.", de: "Du hast die Zehner jedes Mal richtig addiert." },
  "result.grade": { en: "My grade", de: "Meine Note" },
  "result.points": { en: "14 of 20 points", de: "14 von 20 Punkten" },
  "result.exam": { en: "My exam", de: "Mein Test" },
  "result.pages": { en: "2 pages", de: "2 Seiten" },
  "result.from": { en: "Two stars and a wish from Frau Weber", de: "Zwei Sterne und ein Wunsch von Frau Weber" },
  "result.wish": { en: "My wish:", de: "Mein Wunsch:" },
  "result.skill": { en: "Skill to practise:", de: "Das übst du:" },
  "result.listen": { en: "Listen to all", de: "Alles anhören" },
  "result.stop": { en: "Stop", de: "Stopp" },
  "result.stopReading": { en: "Stop reading", de: "Vorlesen stoppen" },
  "result.read.star 1": { en: "Read star 1 aloud", de: "Stern 1 vorlesen" },
  "result.read.star 2": { en: "Read star 2 aloud", de: "Stern 2 vorlesen" },
  "result.read.the wish": { en: "Read the wish aloud", de: "Den Wunsch vorlesen" },
  "result.stop.star 1": { en: "Stop reading star 1", de: "Stern 1 nicht mehr vorlesen" },
  "result.stop.star 2": { en: "Stop reading star 2", de: "Stern 2 nicht mehr vorlesen" },
  "result.stop.the wish": { en: "Stop reading the wish", de: "Den Wunsch nicht mehr vorlesen" },
  "result.mistakes": { en: "See my mistakes", de: "Zeig mir meine Fehler" },

  /* Mistake Replay */
  "mr.title": { en: "Mistake Replay", de: "Fehler nochmal anschauen" },
  "mr.counter": { en: "Mistake {i} of {n}", de: "Fehler {i} von {n}" },
  "mr.yourPage": { en: "Your page", de: "Deine Seite" },
  "mr.circle": { en: "Circle: where it went wrong", de: "Kreis: Hier ging es schief" },
  "mr.did": { en: "What you did", de: "Das hast du gemacht" },
  "mr.right": { en: "The right way", de: "So geht es richtig" },
  "mr.watch": { en: "Watch it", de: "Zeig es mir" },
  "mr.lesson": { en: "Mini lesson", de: "Kleine Lektion" },
  "mr.paused": { en: "Paused", de: "Pause" },
  "mr.reading": { en: "Reading aloud", de: "Liest vor" },
  "mr.step": { en: "Step {i} of 4", de: "Schritt {i} von 4" },
  "mr.play": { en: "Play", de: "Abspielen" },
  "mr.pause": { en: "Pause", de: "Pause" },
  "mr.backStep": { en: "Back one step", de: "Einen Schritt zurück" },
  "mr.fwdStep": { en: "Forward one step", de: "Einen Schritt weiter" },
  "mr.speed": { en: "Change speed", de: "Tempo ändern" },
  "mr.closeLesson": { en: "Close lesson", de: "Lektion schließen" },
  "mr.prev": { en: "Previous", de: "Zurück" },
  "mr.try": { en: "Try one like it", de: "Probier eine ähnliche" },
  "mr.next": { en: "Next", de: "Weiter" },
  "mr.done": { en: "Done", de: "Fertig" },
  "mr.allDone": { en: "Well done! You looked at all your mistakes.", de: "Super! Du hast dir alle Fehler angeschaut." },
  "mr.tryTitle": { en: "Try one like it!", de: "Probier eine ähnliche!" },
  "mr.close": { en: "Close", de: "Schließen" },
  "mr.same": { en: "Same kind of question as your mistake", de: "Die gleiche Art Aufgabe wie bei deinem Fehler" },
  "mr.howAnswer": { en: "How to answer", de: "So antwortest du" },
  "mr.typeIt": { en: "Type it", de: "Tippen" },
  "mr.useCam": { en: "Use camera", de: "Kamera" },
  "mr.upload": { en: "Upload", de: "Hochladen" },
  "mr.yourAnswer": { en: "Your answer", de: "Deine Antwort" },
  "mr.check": { en: "Check", de: "Prüfen" },
  "mr.showWork": { en: "Show your working on paper", de: "Zeig deinen Rechenweg auf Papier" },
  "mr.snap": { en: "Take photo and check", de: "Foto machen und prüfen" },
  "mr.choosePhoto": { en: "Choose a photo of your answer", de: "Wähle ein Foto von deiner Antwort" },
  "mr.yes": { en: "Yes! {a} is right.", de: "Ja! {a} ist richtig." },
  "mr.fixed": { en: "You fixed it. Well done!", de: "Du hast es geschafft. Super!" },
  "mr.perking": { en: "Your Subtracting plant is perking up!", de: "Deine Minus-Pflanze wird wieder munter!" },
  "mr.notYet": { en: "Not quite yet!", de: "Noch nicht ganz!" },
  "mr.notYetSay": { en: "Not quite yet.", de: "Noch nicht ganz." },
  "mr.youWrote": { en: "You wrote {a}.", de: "Du hast {a} geschrieben." },
  "mr.tryAgain": { en: "Try again", de: "Nochmal versuchen" },

  /* Talk Back */
  "tb.ask": { en: "Tell Frau Weber how you'd fix it", de: "Sag Frau Weber, wie du es besser machst" },
  "tb.again": { en: "Record again", de: "Nochmal aufnehmen" },
  "tb.chip": { en: "You explained it", de: "Du hast es erklärt" },
  "tb.off": { en: "Voice answers are turned off. Ask a grown-up to turn them on.", de: "Sprachantworten sind ausgeschaltet. Frag einen Erwachsenen, ob er sie einschaltet." },
  "tb.typeInstead": { en: "Type it instead", de: "Lieber tippen" },
  "tb.typePrompt": { en: "Write what you would do differently. Only Frau Weber will read it.", de: "Schreib, was du anders machen würdest. Nur Frau Weber liest es." },
  "tb.sayPrompt": { en: "Say what you would do differently. Only Frau Weber will hear it.", de: "Sag, was du anders machen würdest. Nur Frau Weber hört es." },
  "tb.sent": { en: "Sent to Frau Weber", de: "An Frau Weber geschickt" },
  "rec.recording": { en: "Recording", de: "Aufnahme" },
  "rec.yourAnswer": { en: "Your answer", de: "Deine Antwort" },
  "rec.onlyWeber": { en: "Only Frau Weber can hear this.", de: "Nur Frau Weber kann das hören." },
  "rec.cancel": { en: "Cancel", de: "Abbrechen" },
  "rec.again": { en: "Try again", de: "Nochmal" },
  "rec.stop": { en: "Stop", de: "Stopp" },
  "rec.send": { en: "Send", de: "Senden" },

  /* chat */
  "chat.role": { en: "Math teacher · tap a message to answer it", de: "Mathelehrerin · tippe auf eine Nachricht, um zu antworten" },
  "chat.today": { en: "Today", de: "Heute" },
  "chat.write": { en: "Write a message...", de: "Schreib eine Nachricht ..." },
  "chat.message": { en: "Message", de: "Nachricht" },
  "chat.mic": { en: "Record a voice note", de: "Sprachnachricht aufnehmen" },
  "chat.send": { en: "Send", de: "Senden" },
  "chat.cancelReply": { en: "Cancel reply", de: "Antwort abbrechen" },
  "chat.replyTo": { en: "Reply to this message", de: "Auf diese Nachricht antworten" },
  "chat.readAloud": { en: "Read this message out loud", de: "Diese Nachricht vorlesen" },
  "chat.answering": { en: "Answering: {m}", de: "Antwort auf: {m}" },
  "chat.answerWeber": { en: "Answering Frau Weber", de: "Antwort an Frau Weber" },
  "chat.answerSelf": { en: "Answering yourself", de: "Antwort an dich selbst" },
  "chat.voice": { en: "Voice note {t}", de: "Sprachnachricht {t}" },
  "chat.sticker": { en: "Sticker: {t}", de: "Sticker: {t}" },
  "chat.voiceSent": { en: "Voice note sent", de: "Sprachnachricht geschickt" }
};

/* Look up a student string; {name} placeholders are filled from vars. Unknown keys come back unchanged. */
function i18n(key, vars) {
  var e = I18N[key], s = e ? (e[STUDENT_LANG] || e.en) : key;
  if (vars) s = s.replace(/\{(\w+)\}/g, function (m, k) { return vars[k] !== undefined ? vars[k] : m; });
  return s;
}

/* Put the string into the element's own text, keeping icons and spacing around it. */
function i18nText(el, s) {
  var nodes = [].filter.call(el.childNodes, function (n) { return n.nodeType === 3 && n.nodeValue.trim(); });
  if (!nodes.length) { el.appendChild(document.createTextNode(s)); return; }
  var v = nodes[0].nodeValue, lead = v.match(/^\s*/)[0], trail = v.match(/\s*$/)[0];
  nodes[0].nodeValue = lead + s + trail;
  nodes.slice(1).forEach(function (n) { n.nodeValue = ""; });
}

function applyI18n(root) {
  if (!document.body.classList.contains("kid")) return;
  root = root || document;
  root.querySelectorAll("[data-i18n]").forEach(function (el) { i18nText(el, i18n(el.getAttribute("data-i18n"))); });
  root.querySelectorAll("[data-i18n-html]").forEach(function (el) { el.innerHTML = i18n(el.getAttribute("data-i18n-html")); });
  root.querySelectorAll("[data-i18n-ph]").forEach(function (el) { el.placeholder = i18n(el.getAttribute("data-i18n-ph")); });
  root.querySelectorAll("[data-i18n-label]").forEach(function (el) { el.setAttribute("aria-label", i18n(el.getAttribute("data-i18n-label"))); });
  document.documentElement.lang = STUDENT_LANG;
}

/* Switch language in place. Pages that draw text from script listen for "studentlang" and redraw. */
function setStudentLang(l) {
  if (l === STUDENT_LANG) return;
  STUDENT_LANG = l;
  store("studentLang", l);
  if (window.Talk) Talk.stop();
  applyI18n();
  document.querySelectorAll(".lang-seg button").forEach(function (b) { b.setAttribute("aria-pressed", b.dataset.lang === l ? "true" : "false"); });
  document.dispatchEvent(new CustomEvent("studentlang", { detail: l }));
}

/* EN | DE pill in every student top bar (same segmented control as the role switcher on the login page). */
(function () {
  if (!document.body.classList.contains("kid")) return;
  var bar = document.querySelector(".k-top, .chat-top");
  if (bar) {
    var seg = document.createElement("div");
    seg.className = "seg lang-seg";
    seg.setAttribute("role", "group");
    seg.setAttribute("data-i18n-label", "lang.group");
    seg.innerHTML = '<button type="button" data-lang="en" lang="en" aria-label="English">EN</button><button type="button" data-lang="de" lang="de" aria-label="Deutsch">DE</button>';
    seg.querySelectorAll("button").forEach(function (b) {
      b.setAttribute("aria-pressed", b.dataset.lang === STUDENT_LANG ? "true" : "false");
      b.addEventListener("click", function () { setStudentLang(b.dataset.lang); });
    });
    var after = bar.querySelector(":scope > .grow, :scope > .who");
    if (after) after.after(seg); else { seg.classList.add("push"); bar.appendChild(seg); }
  }
  applyI18n();
})();

document.addEventListener("DOMContentLoaded", function () {
  applyI18n(); /* again, for parts other scripts added (e.g. the recording sheet) */
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
