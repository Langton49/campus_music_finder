document.addEventListener('DOMContentLoaded', async () => {
    const eventId = getEventIdFromUrl();
    if (eventId) {
        await loadEventDetail(eventId);
    } else {
        showError();
    }
});


function getEventIdFromUrl() {
    const pathParts = window.location.pathname.split('/');
    return pathParts[pathParts.length - 1];
}


async function loadEventDetail(eventId) {
    try {
        const response = await fetch(`/api/events/${eventId}`);
        
        if (!response.ok) {
            throw new Error('Event not found');
        }
        
        const event = await response.json();
        displayEventDetail(event);
    } catch (error) {
        console.error('Error loading event:', error);
        showError();
    }
}


function displayEventDetail(event) {
    document.getElementById('loading').style.display = 'none';
    document.getElementById('event-detail').style.display = 'block';
    

    document.title = `${event.name} - Campus Music Finder`;
    
    const priceDisplay = event.ticketPrice === 0 ? 'FREE' : `$${event.ticketPrice}`;
    
    const eventDetailHTML = `
        <div class="event-detail-container">
            <div class="event-detail-header">
                <h1>${event.name}</h1>
                <p class="artists-list">Featuring: ${event.artists.join(', ')}</p>
            </div>
            
            <div class="event-info-grid">
                <div class="info-section">
                    <h3>📅 When</h3>
                    <p><strong>Date:</strong> ${formatDate(event.date)}</p>
                    <p><strong>Time:</strong> ${event.time}</p>
                </div>
                
                <div class="info-section">
                    <h3>📍 Where</h3>
                    <p><strong>Venue:</strong> ${event.venue}</p>
                    <p><strong>Size:</strong> ${event.venueSize}</p>
                </div>
                
                <div class="info-section">
                    <h3>🎵 Music</h3>
                    <p><strong>Genre:</strong> <span class="genre-tag">${event.genre}</span></p>
                    <p><strong>Artists:</strong> ${event.artists.join(', ')}</p>
                </div>
                
                <div class="info-section">
                    <h3>💰 Tickets</h3>
                    <p><strong>Price:</strong> ${priceDisplay}</p>
                    ${event.ticketPrice === 0 ? 
                        '<p><em>No ticket required - just show up!</em></p>' : 
                        '<p><em>Get your tickets early!</em></p>'
                    }
                </div>
            </div>
            
            <div class="info-section">
                <h3>About This Event</h3>
                <p>${event.description}</p>
            </div>
            
            <div style="text-align: center; margin-top: 2rem;">
                <a href="/" role="button" class="secondary">← Back to All Events</a>
                ${event.ticketPrice > 0 ? 
                    '<button class="primary" onclick="alert(\'Ticket purchasing would be implemented here!\')">Buy Tickets</button>' :
                    '<button class="primary" onclick="alert(\'Event added to your calendar!\')">Add to Calendar</button>'
                }
            </div>
        </div>
    `;
    
    document.getElementById('event-detail').innerHTML = eventDetailHTML;
}


function showError() {
    document.getElementById('loading').style.display = 'none';
    document.getElementById('error').style.display = 'block';
}


function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
}