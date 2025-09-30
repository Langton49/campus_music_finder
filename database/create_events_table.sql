CREATE TABLE events (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    artists JSONB NOT NULL,
    date DATE NOT NULL,
    time VARCHAR(50) NOT NULL,
    venue VARCHAR(255) NOT NULL,
    genre VARCHAR(100) NOT NULL,
    ticket_price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    venue_size VARCHAR(100) NOT NULL,
    description TEXT,
    image VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create trigger function for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for automatic updated_at updates
CREATE TRIGGER update_events_updated_at 
    BEFORE UPDATE ON events 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better query performance
CREATE INDEX idx_events_date ON events(date);
CREATE INDEX idx_events_genre ON events(genre);
CREATE INDEX idx_events_venue ON events(venue);
CREATE INDEX idx_events_ticket_price ON events(ticket_price);

-- JSONB index for artists array queries
CREATE INDEX idx_events_artists ON events USING GIN (artists);

-- Insert sample data
INSERT INTO events (id, name, artists, date, time, venue, genre, ticket_price, venue_size, description, image) VALUES
('indie-night-campus-cafe', 'Indie Night at Campus Cafe', '["The Midnight Owls", "Echo Valley", "Neon Dreams"]', '2025-10-15', '8:00 PM', 'Campus Cafe', 'Indie Rock', 15.00, 'Small (50-100)', 'An intimate evening featuring the best local indie bands. Great atmosphere and affordable drinks.', '/images/indie-night.jpg'),

('hip-hop-showcase-union', 'Hip-Hop Showcase', '["MC Flow", "Rhythm Kings", "Beat Street Collective"]', '2025-10-18', '9:00 PM', 'Student Union Hall', 'Hip-Hop', 20.00, 'Medium (200-500)', 'The hottest hip-hop artists from the region come together for one epic night.', '/images/hip-hop-showcase.jpg'),

('edm-festival-quad', 'EDM Festival on the Quad', '["DJ Pulse", "Electric Storm", "Bass Drop", "Synth Wave"]', '2025-10-22', '6:00 PM', 'University Quad', 'EDM', 35.00, 'Large (1000+)', 'Dance the night away under the stars with top EDM DJs and incredible light shows.', '/images/edm-festival.jpg'),

('acoustic-open-mic', 'Acoustic Open Mic Night', '["Open to All Students"]', '2025-10-12', '7:00 PM', 'Coffee House', 'Acoustic', 0.00, 'Small (30-50)', 'Bring your guitar, voice, or any acoustic instrument. Free entry and supportive crowd.', '/images/open-mic.jpg'),

('jazz-ensemble-concert', 'University Jazz Ensemble Concert', '["University Jazz Ensemble", "Guest Artist: Sarah Mitchell"]', '2025-10-25', '7:30 PM', 'Music Hall Auditorium', 'Jazz', 12.00, 'Medium (300-400)', 'Experience the smooth sounds of our award-winning jazz ensemble with special guest vocalist.', '/images/jazz-concert.jpg'),

('rock-battle-bands', 'Battle of the Bands', '["Crimson Thunder", "Steel Phoenix", "Voltage", "Rebel Hearts"]', '2025-10-28', '8:00 PM', 'Campus Arena', 'Rock', 25.00, 'Large (800-1000)', 'Four local rock bands compete for the title. High energy, loud guitars, and epic solos guaranteed.', '/images/battle-bands.jpg');