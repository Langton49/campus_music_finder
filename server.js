import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool } from './database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


app.get('/api/events', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                id, 
                name, 
                artists, 
                date, 
                time, 
                venue, 
                genre, 
                ticket_price as "ticketPrice", 
                venue_size as "venueSize", 
                description, 
                image 
            FROM events 
            ORDER BY date ASC
        `);

        const events = result.rows.map(event => ({
            ...event,
            date: event.date.toISOString().split('T')[0]
        }));

        res.json(events);
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ error: 'Failed to fetch events' });
    }
});


app.get('/events/:id', async (req, res) => {
    try {
        const result = await pool.query('SELECT id FROM events WHERE id = $1', [req.params.id]);
        if (result.rows.length === 0) {
            return res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
        }
        res.sendFile(path.join(__dirname, 'public', 'event-detail.html'));
    } catch (error) {
        console.error('Error checking event:', error);
        res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
    }
});


app.get('/api/events/:id', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                id, 
                name, 
                artists, 
                date, 
                time, 
                venue, 
                genre, 
                ticket_price as "ticketPrice", 
                venue_size as "venueSize", 
                description, 
                image 
            FROM events 
            WHERE id = $1
        `, [req.params.id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Event not found' });
        }

        const event = {
            ...result.rows[0],
            date: result.rows[0].date.toISOString().split('T')[0]
        };

        res.json(event);
    } catch (error) {
        console.error('Error fetching event:', error);
        res.status(500).json({ error: 'Failed to fetch event' });
    }
});


app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

app.listen(PORT, () => {
    console.log(`Campus Music Finder running on http://localhost:${PORT}`);
});