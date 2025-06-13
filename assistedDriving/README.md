# Assisted Driving
This project is part of my Bachelor's thesis and focuses on designing and evaluating a Human-Machine Interface (HMI) for partially automated driving.
The primary goal of this HMI is to effectively communicate the functionalities and limitations of partial automated driving systems to users.

## Dependencies
### Node.js
This HMI requires a Node.js server to work with the database. To start the server, ensure Node.js is installed on your system.

To check, if it's already downloaded, run:
```shell
node -v
npm -v
```
If both commands return version numbers, Node.js and npm are installed.


If it's not downloaded, go to https://nodejs.org/en#download, download the installer, and follow the installation prompts.

To download all the other dependencies, run this after successfully downloading Node.js.
```shell
npm install
```

## Run
```shell
npm run start
```
This will start a Server running at http://localhost:3000

## Database Structure
All tables in the database are connected through a unique identification_code, which is randomly generated for each user.
This code links data across multiple tables, ensuring that all user-related information remains consistent and easily accessible.
If there are any uncertainties regarding how the data is organized, I recommend clicking through the project to observe 
how the entries update and interact. The database generates automatically.

```
├── profiles                           // Stores user information and overall progress
│   ├── identification_code            
│   ├── name                           
│   ├── total_progress                 // Percentage of HMI completion. Viewing all Tutorial slides or finishing the Overview contributes up to 90%. Correctly answering all questions of a category adds 1% - since there's 10 categories that the remaining 10%
│   ├── unlocked_categories            // JSON array of unlocked categories
│   ├── total_bonusPoints_score        
│   ├── assistance_kilometer           // Total kilometers driven with assistance
│   ├── created_at                     // Timestamp of profile creation
│
├── test_progress                      // Tracks user's test performance
│   ├── identification_code           
│   ├── correctly_answered             // JSON object containing indices of correctly answered questions, divided by category, e.g., "aktivierung": [0, 1, 2]
│   ├── currently_incorrectly_answered  
│   ├── all_time_incorrectly_answered                    
│
├── saved_pages                        // Tracks user's saved pages
│   ├── identification_code            
│   ├── saved_tutorial_pages           
│   ├── saved_overview_pages           
│
├── bonus_events                       // Tracks bonus events earned by users
│   ├── event_id                       // Unique identifier for each event
│   ├── identification_code           
│   ├── event_type                     
│   ├── score                          
│   ├── timestamp                      // Timestamp of when the event occurred
│   ├── expiry_date                   
```

## Project Structure
This project consists of five main pages: Overview, Profile, Tutorial, Welcome, and LiveSimulation. 
Each page has its own HTML file, while some content is dynamically created using JavaScript.
JavaScript is also utilized to improve code reusability and maintainability.
Every page is associated with one or more JavaScript files for specific functionality.

```
├── public           
│   ├── assets   
│       ├── icons                     
│       ├── js                        // JavaScript files
│           ├── bonusPoints           // Connection to the database: records and sends events for specific users to db. Also generates the bonus overview for the Profile page
│           ├── categoryQuestions     // List of category questions
│           ├── eventTypes            // List of event types (including score, message)
│           ├── footer                // Footer (black part at the botttom of all screens) visual and functional code 
│           ├── overview              // Creates the Overview page structure: manages the top section (clicking through, updates dot progres etc.)
│           ├── savedPages            // Connection to the database: reads, saves, and deletes saved pages. Also generates the saved pages overview for the Profile page
│           ├── script                // Shared JavaScript for all pages: prevents zooming into the HMI, and initializes the Profile and Welcome screens
│           ├── slideProgress         // Connection to the database: tracks if a categories slide was seen and updates db accordingly. Also generates the progress overview in the Welcome and Profile pages
│           ├── test                  // Connection to the database: unlocks categories, displays category questions. Also visualizes the Test page on the Profile page
│           ├── tutorial              // Creates the tutorial content and adds it dynamically to each side
│           ├── tutorialContent       // Defines what content is inside the quickoverview and main tutorial. 
│           ├── userProfile           // Connection to the database: creates new profiles and displays existing profiles
│           ├── warnings              // Creates warning messages for the LiveSimulation
│       ├── pictures                  
│       ├── vendors                   // Third-party libraries
│           ├── perfect-scrollbar     // Custom scrollbar to handle disappearing scrollbars on iOS
│           ├── sweetalert2           // Displays alerts for user creation/selection and category questions
│   ├── styles                        // CSS files
│       ├── footer                    
│       ├── overview                  
│       ├── profile                   
│       ├── tutorial  
│       ├── tutorialContent                  
│       ├── warnings                                  
│       ├── welcome                   
│   ├── views                         // HTML views for each page
│       ├── liveSimulation                   
│       ├── overview                  
│       ├── profile                   
│       ├── tutorial                  
│       ├── welcome                   
├── server.js                         
├── users.db                          // Database file created automatically when the first user creates a profile
```
In category questions the categories for the WHOLE HMI gets defined - if you want to add/remove categories, you have to do it there.
There each category also gets it's icon assigned


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

All other remaining icons were either created by Sofia Burgard (sofia.burgard@web.de) or Miao Xinyi (miaoxinyi96@gmail.com)

### Animations of Tutorial Content
All videos and images where created by Miao Xinyi (miaoxinyi96@gmail.com)