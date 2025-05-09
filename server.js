const express = require('express');
const ejs = require('ejs');

const app = express();
const port = 8000;

app.set('view engine', 'ejs');

let sortedRooms = [];

// Function to fetch and update room data
async function fetchRoomData() {
    try {
        const response = await fetch('https://api.ynet-fun.xyz/lobby');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const text = await response.text();

        const json = JSON.parse(text);

        sortedRooms = json.rooms.sort((a, b) => (b.players?.length || 0) - (a.players?.length || 0));
    } catch (error) {
        console.error(error.message);
        sortedRooms = [];
    }
}

app.get('/', (req, res) => {
    fetchRoomData();
    var date_time = new Date();
    // get current date
    let date = ("0" + date_time.getDate()).slice(-2);
    // get current month
    let month = ("0" + (date_time.getMonth() + 1)).slice(-2);
    // get current year
    let year = date_time.getFullYear();
    // get current hours
    let hours = ("0" + date_time.getHours()).slice(-2);
    // get current minutes
    let minutes = ("0" + date_time.getMinutes()).slice(-2);
    // get current seconds
    let seconds = ("0" + date_time.getSeconds()).slice(-2);
    console.log(`[${year}-${month}-${date} ${hours}:${minutes}:${seconds}] Fetched new data.`);

    res.render('index', { rooms: sortedRooms });
});

app.listen(port, async () => {
    console.log(`Server running on http://localhost:${port}`);
    await fetchRoomData();
});