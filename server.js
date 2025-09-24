const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

const events = [
    {
        id: 'indie-night-campus-cafe',
        name: 'Indie Night at Campus Cafe',
        artists: ['The Midnight Owls', 'Echo Valley', 'Neon Dreams'],
        date: '2025-10-15',
        time: '8:00 PM',
        venue: 'Campus Cafe',
        genre: 'Indie Rock',
        ticketPrice: 15,
        venueSize: 'Small (50-100)',
        description: 'An intimate evening featuring the best local indie bands. Great atmosphere and affordable drinks.',
        image: '/images/indie-night.jpg'
    },
    {
        id: 'hip-hop-showcase-union',
        name: 'Hip-Hop Showcase',
        artists: ['MC Flow', 'Rhythm Kings', 'Beat Street Collective'],
        date: '2025-10-18',
        time: '9:00 PM',
        venue: 'Student Union Hall',
        genre: 'Hip-Hop',
        ticketPrice: 20,
        venueSize: 'Medium (200-500)',
        description: 'The hottest hip-hop artists from the region come together for one epic night.',
        image: '/images/hip-hop-showcase.jpg'
    },
    {
        id: 'edm-festival-quad',
        name: 'EDM Festival on the Quad',
        artists: ['DJ Pulse', 'Electric Storm', 'Bass Drop', 'Synth Wave'],
        date: '2025-10-22',
        time: '6:00 PM',
        venue: 'University Quad',
        genre: 'EDM',
        ticketPrice: 35,
        venueSize: 'Large (1000+)',
        description: 'Dance the night away under the stars with top EDM DJs and incredible light shows.',
        image: '/images/edm-festival.jpg'
    },
    {
        id: 'acoustic-open-mic',
        name: 'Acoustic Open Mic Night',
        artists: ['Open to All Students'],
        date: '2025-10-12',
        time: '7:00 PM',
        venue: 'Coffee House',
        genre: 'Acoustic',
        ticketPrice: 0,
        venueSize: 'Small (30-50)',
        description: 'Bring your guitar, voice, or any acoustic instrument. Free entry and supportive crowd.',
        image: '/images/open-mic.jpg'
    },
    {
        id: 'jazz-ensemble-concert',
        name: 'University Jazz Ensemble Concert',
        artists: ['University Jazz Ensemble', 'Guest Artist: Sarah Mitchell'],
        date: '2025-10-25',
        time: '7:30 PM',
        venue: 'Music Hall Auditorium',
        genre: 'Jazz',
        ticketPrice: 12,
        venueSize: 'Medium (300-400)',
        description: 'Experience the smooth sounds of our award-winning jazz ensemble with special guest vocalist.',
        image: '/images/jazz-concert.jpg'
    },
    {
        id: 'rock-battle-bands',
        name: 'Battle of the Bands',
        artists: ['Crimson Thunder', 'Steel Phoenix', 'Voltage', 'Rebel Hearts'],
        date: '2025-10-28',
        time: '8:00 PM',
        venue: 'Campus Arena',
        genre: 'Rock',
        ticketPrice: 25,
        venueSize: 'Large (800-1000)',
        description: 'Four local rock bands compete for the title. High energy, loud guitars, and epic solos guaranteed.',
        image: '/images/battle-bands.jpg'
    }
];

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


app.get('/api/events', (req, res) => {
    res.json(events);
});


app.get('/events/:id', (req, res) => {
    const event = events.find(e => e.id === req.params.id);
    if (!event) {
        return res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
    }
    res.sendFile(path.join(__dirname, 'public', 'event-detail.html'));
});


app.get('/api/events/:id', (req, res) => {
    const event = events.find(e => e.id === req.params.id);
    if (!event) {
        return res.status(404).json({ error: 'Event not found' });
    }
    res.json(event);
});


app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

app.listen(PORT, () => {
    console.log(`Campus Music Finder running on http://localhost:${PORT}`);
});