const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const {JSDOM} = require('jsdom');
const eventTypes = require('./public/assets/js/eventTypes.js');
const categoryQuestions = require('./public/assets/js/categoryQuestions.js');

const os = require('os');
const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Database setup
const db = new sqlite3.Database('users.db', (err) => {
    if (err) {
        console.error('Error opening database:', err);
    } else {
        db.run(`CREATE TABLE IF NOT EXISTS profiles (
            identification_code TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            total_progress INTEGER DEFAULT 0,
            unlocked_categories TEXT DEFAULT '[]',
            preferences TEXT DEFAULT '{}',
            total_bonusPoints_score INTEGER DEFAULT 0 CHECK (total_bonusPoints_score >= 0 AND total_bonusPoints_score <= 100),
            assistance_kilometer INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS test_progress (
            identification_code TEXT PRIMARY KEY,
            correctly_answered TEXT DEFAULT '{}',
            currently_incorrectly_answered TEXT DEFAULT '{}',
            all_time_incorrectly_answered TEXT DEFAULT '{}',
            FOREIGN KEY (identification_code) REFERENCES profiles(identification_code)
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS saved_pages (
            identification_code TEXT PRIMARY KEY,
            saved_tutorial_pages TEXT DEFAULT '{}',
            saved_overview_pages TEXT DEFAULT '{}',
            FOREIGN KEY (identification_code) REFERENCES profiles(identification_code)
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS bonus_events (
            event_id INTEGER PRIMARY KEY AUTOINCREMENT,
            identification_code TEXT NOT NULL,
            event_type TEXT NOT NULL,
            score INTEGER NOT NULL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            expiry_date DATETIME DEFAULT (DATETIME('now', '+1 year')),
            FOREIGN KEY (identification_code) REFERENCES profiles(identification_code)
        )`)
    }
});

// API Routes
// User Handling
app.get('/api/users/:code/verify', (req, res) => {
    const {code} = req.params;

    if (!code) {
        return res.status(401).json({exists: false});
    }

    db.get('SELECT * FROM profiles WHERE identification_code = ?', [code], (err, user) => {
        if (err) {
            return res.status(500).json({error: err.message});
        }
        res.json({exists: !!user});
    });
});

app.get('/api/users', (req, res) => {
    db.all(
        `SELECT * FROM profiles`,
        [],
        (err, rows) => {
            if (err) {
                res.status(400).json({error: err.message});
                return;
            }
            res.json(rows);
        }
    );
});

app.post('/api/users', (req, res) => {
    const {name, identificationCode} = req.body;

    db.run(
        //`INSERT INTO profiles (identification_code, name, unlocked_categories, total_bonusPoints_score, assistance_kilometer) VALUES (?, ?, ?, 0, 0)`,
        //[identificationCode, name, JSON.stringify([])],
         `INSERT INTO profiles (identification_code, name, unlocked_categories, preferences, total_bonusPoints_score, assistance_kilometer) VALUES (?, ?, ?, ?, 0, 0)`,
        [identificationCode, name, JSON.stringify([]), JSON.stringify({})],
        function (err) {
            if (err) {
                res.status(400).json({error: err.message});
                return;
            }

            res.json({
                identification_code: identificationCode,
                name: name,
                preferences: [],
                total_bonusPoints_score: 0,
                assistance_kilometer: 0
            });
        }
    );
});

app.get('/api/users/:code', (req, res) => {
    db.get(
        `SELECT * FROM profiles WHERE identification_code = ?`,
        [req.params.code],
        (err, row) => {
            if (err) {
                res.status(400).json({error: err.message});
                return;
            }
            res.json(row);
        }
    );
});

app.get('/api/users/:code/preferences', (req, res) => {
    const { code } = req.params;
    db.get('SELECT preferences FROM profiles WHERE identification_code = ?', [code], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ preferences: row ? row.preferences : '{}' });
    });
});

app.post('/api/users/:code/preferences', (req, res) => {
    const { code } = req.params;
    const preferences = JSON.stringify(req.body.preferences || {});
    db.run('UPDATE profiles SET preferences = ? WHERE identification_code = ?', [preferences, code], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
});

// Test Questions Handling
app.post('/api/test/:code/update', (req, res) => {
    const { code } = req.params;
    const { category, questionIndex, isCorrect } = req.body;

    if (!code || category === undefined || questionIndex === undefined || isCorrect === undefined) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    db.get(
        `SELECT correctly_answered, currently_incorrectly_answered, all_time_incorrectly_answered, p.total_progress
         FROM test_progress tp
                  JOIN profiles p ON tp.identification_code = p.identification_code
         WHERE tp.identification_code = ?`,
        [code],
        (err, row) => {
            if (err) return res.status(500).json({ error: err.message });

            let correctlyAnswered = {};
            let currentlyIncorrectlyAnswered = {};
            let allTimeIncorrectlyAnswered = {};

            try {
                correctlyAnswered = row ? JSON.parse(row.correctly_answered || '{}') : {};
                currentlyIncorrectlyAnswered = row ? JSON.parse(row.currently_incorrectly_answered || '{}') : {};
                allTimeIncorrectlyAnswered = row ? JSON.parse(row.all_time_incorrectly_answered || '{}') : {};

                if (!correctlyAnswered[category]) correctlyAnswered[category] = [];
                if (!currentlyIncorrectlyAnswered[category]) currentlyIncorrectlyAnswered[category] = [];
                if (!allTimeIncorrectlyAnswered[category]) allTimeIncorrectlyAnswered[category] = [];

                const previousCompleted = Object.keys(categoryQuestions).filter(cat =>
                    correctlyAnswered[cat]?.length === categoryQuestions[cat].length
                ).length;

                if (isCorrect) {
                    if (!correctlyAnswered[category].includes(questionIndex)) {
                        correctlyAnswered[category].push(questionIndex);
                    }
                    currentlyIncorrectlyAnswered[category] = currentlyIncorrectlyAnswered[category]
                        .filter(idx => idx !== questionIndex);
                } else {
                    correctlyAnswered[category] = correctlyAnswered[category]
                        .filter(idx => idx !== questionIndex);
                    if (!currentlyIncorrectlyAnswered[category].includes(questionIndex)) {
                        currentlyIncorrectlyAnswered[category].push(questionIndex);
                    }
                    if (!allTimeIncorrectlyAnswered[category].includes(questionIndex)) {
                        allTimeIncorrectlyAnswered[category].push(questionIndex);
                    }
                }

                const newCompleted = Object.keys(categoryQuestions).filter(cat =>
                    correctlyAnswered[cat]?.length === categoryQuestions[cat].length
                ).length;

                const progressDifference = newCompleted - previousCompleted;
                const newTotalProgress = (row.total_progress || 0) + progressDifference;

                db.run(
                    `UPDATE test_progress 
                     SET correctly_answered = ?, currently_incorrectly_answered = ?, all_time_incorrectly_answered = ? 
                     WHERE identification_code = ?`,
                    [
                        JSON.stringify(correctlyAnswered),
                        JSON.stringify(currentlyIncorrectlyAnswered),
                        JSON.stringify(allTimeIncorrectlyAnswered),
                        code
                    ],
                    (updateErr) => {
                        if (updateErr) return res.status(500).json({ error: updateErr.message });

                        db.run(
                            'UPDATE profiles SET total_progress = ? WHERE identification_code = ?',
                            [newTotalProgress, code],
                            (err) => {
                                if (err) return res.status(500).json({ error: err.message });
                                res.json({
                                    success: true,
                                    correctlyAnswered,
                                    currentlyIncorrectlyAnswered,
                                    allTimeIncorrectlyAnswered,
                                    totalProgress: newTotalProgress
                                });
                            }
                        );
                    }
                );
            } catch (parseError) {
                return res.status(500).json({ error: 'Error parsing stored data' });
            }
        }
    );
});

app.get('/api/test/:code', (req, res) => {
    db.get(
        'SELECT * FROM test_progress WHERE identification_code = ?',
        [req.params.code],
        (err, row) => {
            if (err) {
                res.status(400).json({ error: err.message });
                return;
            }

            if (!row) {
                db.run(
                    'INSERT INTO test_progress (identification_code) VALUES (?)',
                    [req.params.code],
                    (err) => {
                        if (err) {
                            res.status(400).json({ error: err.message });
                            return;
                        }
                        res.json({
                            identification_code: req.params.code,
                            correctly_answered: '{}',
                            currently_incorrectly_answered: '{}',
                            all_time_incorrectly_answered: '{}'
                        });
                    }
                );
            } else {
                res.json(row);
            }
        }
    );
});

// Unlocked categories
app.get('/api/users/:userCode/unlocked-categories', (req, res) => {
    db.get(
        'SELECT unlocked_categories FROM profiles WHERE identification_code = ?',
        [req.params.userCode],
        (err, row) => {
            if (err) {
                res.status(500).json({error: err.message});
                return;
            }
            res.json({unlockedCategories: JSON.parse(row?.unlocked_categories || '[]')});
        }
    );
});

app.post('/api/users/:code/unlock-category/:category', (req, res) => {
    const {code, category} = req.params;

    db.get('SELECT * FROM profiles WHERE identification_code = ?', [code], (err, userData) => {
        if (err) {
            console.error('Error fetching user:', err);
            return res.status(500).json({error: 'Database error'});
        }

        let unlockedCategories;
        try {
            unlockedCategories = JSON.parse(userData?.unlocked_categories || '[]');
        } catch {
            unlockedCategories = [];
        }

        if (!unlockedCategories.includes(category)) {
            unlockedCategories.push(category);
            const newCategoriesJson = JSON.stringify(unlockedCategories);

            db.run(
                'UPDATE profiles SET unlocked_categories = ? WHERE identification_code = ?',
                [newCategoriesJson, code],
                (err) => {
                    if (err) {
                        console.error('Error updating user:', err);
                        return res.status(500).json({error: 'Database error'});
                    }
                    res.json({success: true, unlockedCategories});
                }
            );
        } else {
            res.json({success: true, unlockedCategories});
        }
    });
});

// Saved Slides Handling
app.post('/api/users/:code/save-page', (req, res) => {
    const {code} = req.params;
    const {page, slideIndex, pageType} = req.body;

    if (!page || !pageType) {
        return res.status(400).json({error: 'No page or page type specified for saving'});
    }

    const column = pageType === 'tutorial' ? 'saved_tutorial_pages' : 'saved_overview_pages';

    db.get(`SELECT ${column} FROM saved_pages WHERE identification_code = ?`, [code], (err, row) => {
        if (err) return res.status(500).json({error: err.message});

        let savedPages = {};
        if (row) {
            savedPages = JSON.parse(row[column]);
            if (!savedPages[page]) {
                savedPages[page] = [];
            }
            if (!savedPages[page].includes(slideIndex)) {
                savedPages[page].push(slideIndex);
            }
        } else {
            savedPages[page] = [slideIndex];
            const query = `INSERT INTO saved_pages (identification_code, ${column}) VALUES (?, ?)`;
            db.run(query, [code, JSON.stringify(savedPages)]);
        }

        const query = `UPDATE saved_pages SET ${column} = ? WHERE identification_code = ?`;
        db.run(query, [JSON.stringify(savedPages), code],
            (err) => {
                if (err) return res.status(500).json({error: err.message});
                res.json({success: true, message: 'Page saved'});
            }
        );
    });
});

app.get('/api/users/:code/saved-pages', (req, res) => {
    const {code} = req.params;
    const {pageType} = req.query;

    const column = pageType === 'tutorial' ? 'saved_tutorial_pages' : 'saved_overview_pages';

    db.get(`SELECT ${column} FROM saved_pages WHERE identification_code = ?`, [code], (err, row) => {
        if (err) return res.status(500).json({error: err.message});

        const savedPages = row ? JSON.parse(row[column]) : {};
        res.json({success: true, savedPages});
    });
});

app.delete('/api/users/:code/delete-slide', (req, res) => {
    const {code} = req.params;
    const {page, slideIndex, pageType} = req.body;

    if (!page || !pageType) {
        return res.status(400).json({error: 'No page or page type specified for deletion'});
    }

    const column = pageType === 'tutorial' ? 'saved_tutorial_pages' : 'saved_overview_pages';

    db.get(`SELECT ${column} FROM saved_pages WHERE identification_code = ?`, [code], (err, row) => {
        if (err) return res.status(500).json({error: err.message});
        if (!row) return res.status(404).json({error: 'No saved pages found'});

        let savedPages = JSON.parse(row[column]);
        if (savedPages[page]) {
            savedPages[page] = savedPages[page].filter(idx => idx !== slideIndex);
            if (savedPages[page].length === 0) {
                delete savedPages[page];
            }
        }

        const query = `UPDATE saved_pages SET ${column} = ? WHERE identification_code = ?`;
        db.run(query, [JSON.stringify(savedPages), code],
            (err) => {
                if (err) return res.status(500).json({error: err.message});
                res.json({success: true, message: 'Page deleted'});
            }
        );
    });
});

app.get('/api/slide-content/:category/:index', (req, res) => {
    const {category, index} = req.params;
    const {pageType} = req.query;

    if (pageType === 'overview') {
        const overviewPath = path.join(__dirname, 'public', 'views', 'overview', 'index.html');

        try {
            const overviewContent = fs.readFileSync(overviewPath, 'utf8');
            const dom = new JSDOM(overviewContent);
            const document = dom.window.document;

            const page = document.querySelector(`.content-container .page:nth-child(${parseInt(index) + 1})`);

            if (!page) {
                return res.status(404).json({error: 'Page not found'});
            }

            const heading = page.querySelector('h1, h2, h3')?.textContent || 'Overview Page';
            const text = page.querySelector('p')?.textContent || '';

            res.json({
                success: true,
                content: {
                    heading,
                    text
                }
            });
        } catch (error) {
            console.error('Error reading overview content:', error);
            res.status(500).json({error: 'Failed to read overview content'});
        }
    } else {
        const tutorialPath = path.join(__dirname, 'public', 'views', 'tutorial', 'index.html');

        try {
            const tutorialContent = fs.readFileSync(tutorialPath, 'utf8');
            const dom = new JSDOM(tutorialContent);
            const document = dom.window.document;

            const slide = document.querySelector(`#${category} .slide[data-index="${index}"]`);

            if (!slide) {
                return res.status(404).json({error: 'Slide not found'});
            }

            const heading = slide.querySelector('h2, h3')?.textContent || 'Untitled';
            const text = slide.querySelector('p')?.textContent || '';

            res.json({
                success: true,
                content: {
                    heading,
                    text
                }
            });
        } catch (error) {
            console.error('Error reading slide content:', error);
            res.status(500).json({error: 'Failed to read slide content'});
        }
    }


});

// Bonus Points Handling
app.post('/api/events', (req, res) => {
    const {identificationCode, eventType, score} = req.body;

    if (!identificationCode || !eventType || score === undefined) {
        console.error("Missing required fields:", req.body);
        return res.status(400).json({error: "Missing required fields"});
    }

    const message = eventTypes[eventType] ? eventTypes[eventType].message : "No message available for this event.";
    const expiryDate = eventType === 'welcome' ? null : `DATETIME('now', '+1 year')`;

    db.run(
        `INSERT INTO bonus_events (identification_code, event_type, score, expiry_date)
         VALUES (?, ?, ?, ${expiryDate})`,
        [identificationCode, eventType, score],
        function (err) {
            if (err) {
                console.error("Error inserting event into database:", err.message);
                return res.status(500).json({error: err.message});
            }

            db.get(
                `SELECT total_bonusPoints_score FROM profiles WHERE identification_code = ?`,
                [identificationCode],
                (err, row) => {
                    if (err) {
                        return res.status(500).json({error: err.message});
                    }

                    const currentScore = row ? row.total_bonusPoints_score : 0;
                    const newScore = Math.max(0, Math.min(100, currentScore + score));

                    db.run(
                        `UPDATE profiles SET total_bonusPoints_score = ? WHERE identification_code = ?`,
                        [newScore, identificationCode],
                        (err) => {
                            if (err) {
                                console.error("Error updating total score:", err.message);
                                return res.status(500).json({error: err.message});
                            }
                            res.json({
                                success: true,
                                newScore,
                                message: message,
                            });
                        }
                    );
                }
            );
        }
    );
});

app.get('/api/events/:code', (req, res) => {
    const {code} = req.params;

    db.all(
        `SELECT * FROM bonus_events WHERE identification_code = ? ORDER BY timestamp DESC`,
        [code],
        (err, rows) => {
            if (err) {
                return res.status(500).json({error: err.message});
            }
            res.json(rows);
        }
    );
});

app.get('/api/bonus/:identificationCode', (req, res) => {
    const {identificationCode} = req.params;

    db.get(
        `SELECT total_bonusPoints_score, assistance_kilometer 
         FROM profiles 
         WHERE identification_code = ?`,
        [identificationCode],
        (err, row) => {
            if (err) {
                console.error('Error fetching bonus data:', err);
                return res.status(500).send('Internal Server Error');
            }

            if (!row) {
                return res.status(404).json({error: 'User not found'});
            }

            res.json({
                total_bonusPoints_score: row.total_bonusPoints_score || 0,
                assistance_kilometer: row.assistance_kilometer || 0
            });
        }
    );
});

// Get events for a user
app.get('/api/users/:code/events', (req, res) => {
    const {code} = req.params;

    db.all(
        `SELECT event_type, timestamp FROM bonus_events WHERE identification_code = ? ORDER BY timestamp DESC`,
        [code],
        (err, rows) => {
            if (err) {
                console.error('Error fetching events:', err.message);
                return res.status(500).json({error: err.message});
            }

            const events = rows.map(row => {
                const event = eventTypes[row.event_type];
                return {
                    message: event ? event.message : 'Keine Beschreibung verfügbar',
                    timestamp: row.timestamp
                };
            });

            res.json(events);
        }
    );
});

app.delete('/api/events/expired', (req, res) => {
    db.run(
        `DELETE FROM bonus_events WHERE expiry_date IS NOT NULL AND expiry_date < DATETIME('now')`,
        (err) => {
            if (err) {
                return res.status(500).json({error: err.message});
            }
            res.json({success: true, message: "Expired events removed."});
        }
    );
});

// Routing
app.get('/', (req, res) => {
    res.status(200).sendFile(path.join(__dirname, 'public', 'views', 'welcome', 'index.html'));
})

// Error handling for undefined routes
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'public', 'views', 'welcome', 'index.html'));
});

function getWifiIP() {
    const interfaces = os.networkInterfaces();

    const targetInterfaces = ['WLAN', 'Wi-Fi'];
    for (const name of targetInterfaces) {
        const iface = interfaces[name];
        if (iface) {
            const ipv4 = iface.find(config =>
                config.family === 'IPv4' &&
                !config.internal
            );
            if (ipv4) return ipv4.address;
        }
    }
    return '0.0.0.0';
}

/*const localIP = getWifiIP();
app.listen(port, localIP, () => {
    console.log(`Server running at: http://${localIP}:${port}`);
});*/
if (require.main === module) {
    const localIP = getWifiIP();
    app.listen(port, localIP, () => {
        console.log(`Server running at: http://${localIP}:${port}`);
    });
}

module.exports = app;