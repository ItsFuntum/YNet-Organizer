const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 8000;

let sortedRooms = [];

// Middleware
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

const settingsPath = path.join(__dirname, 'settings.json');
let settings = {};

// Attempt to load settings.json on server startup
try {
    const data = fs.readFileSync(settingsPath, 'utf-8');
    settings = JSON.parse(data);
} catch (err) {
    console.error('Error loading settings.json, perphaps it does not exist yet. Attempting creation of file...');
    settings = {}; // or provide default settings as needed
    fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2), 'utf-8');
}

// Route to save settings (for when the user updates settings)
app.post('/save-settings', (req, res) => {
  const newSettings = req.body;

  // Save settings to settings.json
  fs.writeFile(settingsPath, JSON.stringify(newSettings, null, 2), (err) => {
    if (err) {
      console.error('Error saving settings:', err);
      return res.status(500).send('Error saving settings.');
    }

    settings = newSettings; // Update in-memory settings
    res.status(200).send('Settings saved.');
  });
});

// Fetch Room Data
async function fetchRoomData() {
    try {
        const response = await fetch('https://api.ynet-fun.xyz/lobby');
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const { rooms } = await response.json();
        sortedRooms = rooms.sort((a, b) => (b.players?.length || 0) - (a.players?.length || 0));
    } catch (error) {
        console.error(`Failed to fetch room data: ${error.message}`);
        sortedRooms = [];
    }
}

// Routes
app.get('/', async (req, res) => {
    await fetchRoomData();
    res.render('index', { rooms: sortedRooms, settings });
});

// Start Server
app.listen(port, async () => {
    console.log(`Server running on http://localhost:${port}`);
    await fetchRoomData(); // Initial fetch
});