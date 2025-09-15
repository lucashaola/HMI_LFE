# Assisted Driving
This project is part of my Bachelor's thesis and focuses on designing and evaluating a Human-Machine Interface (HMI) for partially automated driving. The HMI aims to clearly communicate capabilities and limitations of partial automation to drivers.

## Requirements
- Node.js and npm installed
- SQLite (bundled via the `sqlite3` npm package; the DB file is created automatically)

Verify your setup:
```sh
node -v
npm -v
```

## Install
From the `assistedDriving` folder:
```sh
npm install
```

## Run
Start the server from `assistedDriving`:
```sh
node server.js
```
The server binds to your local Wi-Fi IP and logs for example: `Server running at: http://192.168.x.x:3000`. Open that address in a browser (or tablet in the same network). If you prefer localhost, adjust the binding in `server.js` accordingly.

## Pages & Flow
The HMI consists of the following views. Content is rendered statically via HTML/CSS and dynamically via JavaScript.
- Welcome: Entry screen; lets users log in or create a profile and shows progress/search.
- Landing: First-time message after profile creation with a call-to-action to preferences.
- Preferences: Users select their level of theoretical and practical experience for each assistence system (Scale: keins=0 and sehr viel=6). If the mean is less or equal to 3, the system is showed in the tutorial. Mandatory categories are always included: `aktivierung`, `deaktivierung`, `risiken`.
- Overview: Quick overview of all categories recommended to the user (plus mandatory); paginated with progress dots and bookmarking.
- Tutorial: Detailed content per category; searchable; bookmarking supported.
- Profile: Shows overall progress, saved pages, knowledge test, bonus points; links to Preferences.
- LiveSimulation: Integration page to display a local driving simulator overlay (via iframe).

## Key Features
- Customizable content: User-recommended categories (stored as `preferences`) plus mandatory categories.
- Knowledge test: Category-based questions with progress indicators; test per category or across unlocked categories.
- Progress tracking: Unlocks a category when its content is viewed; shows per-category and total progress.
- Saved pages: Bookmark Tutorial/Overview positions; view and manage saved pages in Profile.
- Bonus points: Records driving-related events with scores and history; shows status and timeline in Profile.
- Search: Full-text search across Tutorial content; respects user preferences on the Tutorial page.
- Vendor libs: SweetAlert2 and Perfect Scrollbar shipped in `public/assets/vendor` (some pages may use CDN equivalents).

## Database Structure
All tables are linked by `identification_code`, which is randomly generated per user. The database file `users.db` is created on first use.

Tables:
- profiles
  - identification_code (TEXT, primary key)
  - name (TEXT)
  - total_progress (INTEGER, default 0)
  - unlocked_categories (TEXT, JSON string of array)
  - preferences (TEXT, JSON string of array)
  - total_bonusPoints_score (INTEGER 0..100, default 0)
  - assistance_kilometer (INTEGER, default 0)
  - created_at (DATETIME, default CURRENT_TIMESTAMP)
- test_progress
  - identification_code (TEXT, primary key, foreign key)
  - correctly_answered (TEXT, JSON object: category -> indices)
  - currently_incorrectly_answered (TEXT, JSON object)
  - all_time_incorrectly_answered (TEXT, JSON object)
- saved_pages
  - identification_code (TEXT, primary key, foreign key)
  - saved_tutorial_pages (TEXT, JSON object: category -> [slideIndices])
  - saved_overview_pages (TEXT, JSON object: "overview" -> [pageIndices])
- bonus_events
  - event_id (INTEGER, primary key autoincrement)
  - identification_code (TEXT, foreign key)
  - event_type (TEXT)
  - score (INTEGER)
  - timestamp (DATETIME, default CURRENT_TIMESTAMP)
  - expiry_date (DATETIME, default now + 1 year; may be null for some events)

## Project Structure
```
assistedDriving/
- server.js
- users.db                   # Created automatically on first run
- public/
  - assets/
    - icons/
    - pictures/
    - vendor/              # Third-party libraries
      - perfect-scrollbar.css
      - perfect-scrollbar.min.js
      - sweetalert2.js
      - sweetalert2.min.css
    - js/
      - bonusPoints.js            # Records/visualizes events & bonus points
      - categoryQuestions.js      # Test question bank per category
      - eventTypes.js             # Event types with messages/scores
      - footer.js                 # Shared footer logic
      - overview.js               # Overview pagination/unlock/bookmark
      - preferencesTheoretical.js # Theoretical preferences UI + save to API
      - preferencesPractical.js   # Practical preferences UI + mean logic + save to API
      - savedPages.js             # Bookmark save/delete & profile list
      - script.js                 # Shared init (welcome/profile/search)
      - slideProgress.js          # Progress overview + unlock logic
      - test.js                   # Knowledge test UI + API calls
      - tutorial.js               # Tutorial sidebar/content generation
      - tutorialContent.js        # Tutorial content definitions
      - userProfile.js            # Profile create/select/login flow
      - warning.js                # LiveSimulation overlay messages
  - styles/
    - footer.css
    - landing.css
    - overview.css
    - preferences.css
    - profile.css
    - tutorial.css
    - tutorialContent.css
    - warnings.css
    - welcome.css
  - views/
    - landing/index.html
    - liveSimulation/index.html
    - overview/index.html
    - preferencesTheoretical/index.html
    - preferencesPractical/index.html
    - profile/index.html
    - tutorial/index.html
    - welcome/index.html
```

Note: Categories used across the HMI (and their icons) are defined in `public/assets/js/categoryQuestions.js`. Add/remove categories there to extend the HMI and tests.

## Selected API Endpoints
- POST `/api/users` - create profile { name, identificationCode }
- GET `/api/users` - list profiles
- GET `/api/users/:code` - get profile
- GET `/api/users/:code/verify` - { exists }
- GET `/api/users/:code/preferences` - { preferences }
- POST `/api/users/:code/preferences` - save preferences
- GET `/api/users/:userCode/unlocked-categories` - unlocked list
- POST `/api/users/:code/unlock-category/:category` - unlock category
- GET `/api/test/:code` - fetch test progress
- POST `/api/test/:code/update` - update test progress
- POST `/api/events` - record bonus event
- GET `/api/events/:code` - list events
- GET `/api/bonus/:identificationCode` - bonus summary
- POST `/api/users/:code/save-page` - bookmark tutorial/overview
- GET `/api/users/:code/saved-pages?pageType=tutorial|overview` - list bookmarks
- DELETE `/api/users/:code/delete-slide` - remove bookmark

## Credits
### Icons
- Home Icon: https://thenounproject.com/icon/home-6707544/
- Menu Icon: https://thenounproject.com/icon/menu-933312/
- World Icon: https://thenounproject.com/icon/world-1937770/
- Profile Icon: https://thenounproject.com/icon/profile-7361527/
- Arrow Icon: https://thenounproject.com/icon/arrow-3134195/
- Bookmark Icon: https://thenounproject.com/icon/bookmark-7419377/
- Trash Icon: https://thenounproject.com/icon/trash-3465734/
- Lock Icon: https://thenounproject.com/icon/lock-7271224/
- Warning Icon: https://thenounproject.com/icon/warning-4718327/
- Traffic Icon: https://thenounproject.com/icon/traffic-light-7092055/
- Off-Toggle Icon: https://thenounproject.com/icon/off-5706456/
- On-Toggle Icon: https://thenounproject.com/icon/on-5706475/
- Seat Heating Icon: https://thenounproject.com/icon/seat-heating-4600189/
- Close Icon: https://thenounproject.com/icon/close-1292416/
- Exchange Persons Icon: https://de.vecteezy.com/vektorkunst/28711707-benutzer-austausch-glyphe-symbol-zwei-menschen-oder-ersatz-person-im-verbinden-pfeil-kommunikation-kreis-handeln-personal-veranderung-mitarbeiter-aktualisierung-logo-vektor-illustration-design-auf-weiss-hintergrund-eps-10
- Warning Icon: https://thenounproject.com/icon/warning-7536430/
- Adaptive Cruise Control Icon: ISO 7000-2580
- Lane Keeping Assistance Icon: ISO 7000-3128

All other remaining icons were either created by Sofia Burgard (sofia.burgard@web.de) or Miao Xinyi (miaoxinyi96@gmail.com).

### Animations of Tutorial Content
All videos and images were created by Miao Xinyi (miaoxinyi96@gmail.com).
