# Sprout · High-fidelity prototype

Sprout is a school app where students send photos of their exams, teachers check AI-marked papers, and parents follow their child's progress.

This repository holds the high-fidelity prototype for Milestone 3 of our HCI project. It turns our low-fidelity wireframes into a clickable front end.

It is a front-end prototype only. There is no backend and no database. All data (students, grades, messages) is written into the pages, so anything you type is lost when you reload.

## How to open it

**Option 1: just open it**
Download the project and double-click `index.html`. It opens in your browser.

**Option 2: run a small local server (recommended)**
Some browsers limit pages opened straight from a file, so this is the safer way:

```bash
cd sprout-hifi
python -m http.server 8000
```

Then go to http://localhost:8000.

You need internet for the icons (Lucide) and fonts (Google Fonts). The prototype still works without it, but the icons will not show.

## How to log in

1. On the login page, pick **Student**, **Teacher** or **Parent**.
2. Any username and password work. The fields only need to be filled in.
3. Press the log in button to open that role's view.

## What is in each view

| View | Best on | Pages |
|---|---|---|
| Student | Tablet (works on laptop) | Subjects, subject home with Math Garden, submit exam photos, waiting screen, results, one result with two stars and a wish, Mistake Replay with mini lesson and "Try one like it", messages with voice notes |
| Teacher | Laptop | Dashboard, Papers, test page with answer key, class list, correcting one paper or a whole batch in 4 steps (check text, confirm grade, red flags, release), new assignment, messages, settings with grading system |
| Parent | Laptop and phone | Overview, tonight's activity (English and Arabic), calendar, messages (own chats and read-only child chats), settings with privacy and consent |

## Tasks to try

These match our HTDs:

- **Student, submit exam photos:** Math > Submit > add pages > retake the blurry page > Send to my teacher
- **Student, check a result:** Math > You have 5 new results! > Math Test 3 > See my mistakes
- **Teacher, verify OCR text:** Papers > Math Test 3 > 3B > Correct all 22 > Step 1 Check text
- **Teacher, confirm or dismiss a red flag:** in the same flow, Step 3 Red flags
- **Teacher, new assignment:** Dashboard > New assignment > Publish to students
- **Parent, tonight's activity:** Overview > Open activity > We did it!
- **Parent, message a teacher:** Messages > My chats > Frau Weber (try "Translate to Arabic")

## Folder structure

```
index.html          login page
css/
  styles.css        colours, fonts, buttons and other shared parts
  student.css       student view styles
  teacher.css       teacher view styles
  correct.css       correcting screen (one paper and batch)
  parent.css        parent view styles
js/
  app.js            shared helpers (icons, toast messages, saving small settings)
  student.js        student top bar, plant drawings, notifications
  teacher.js        teacher top bar and answer key pop-up
  correct.js        the 4-step correcting flow
  parent.js         parent top bar, child switcher, language menu
student/            student pages
teacher/            teacher pages
parent/             parent pages
```

## Built with

- Plain HTML, CSS and JavaScript (no framework, no build step)
- [Lucide](https://lucide.dev) icons
- Google Fonts: Figtree, Lexend (student view), Gochi Hand (handwriting on scans), IBM Plex Sans Arabic
- The browser's built-in speech for the "Listen" and read-aloud buttons

## Put it on GitHub Pages

1. Create a new repository on GitHub and upload all the files (keep the folders as they are).
2. Go to **Settings > Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**, pick `main` and `/ (root)`, then press **Save**.
4. After a minute the site is live at `https://<your-username>.github.io/<repo-name>/`.

## Notes

- The data is made up for the prototype (Lina A., Frau Weber, Grade 3B and so on).
- The app name, language choice and a few small settings are saved in the browser's local storage. Clear the site data to reset them.
- Course: Human Computer Interaction, Milestone 3 (high-fidelity prototype).
