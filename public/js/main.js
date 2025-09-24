let allEvents = [];
document.addEventListener('DOMContentLoaded', async () => {
    await loadEvents();
    setupFilters();
});


async function loadEvents() {
    try {
        const response = await fetch('/api/events');
        allEvents = await response.json();
        displayEvents(allEvents);
    } catch (error) {
        console.error('Error loading events:', error);
        document.getElementById('events-container').innerHTML = 
            '<p>Error loading events. Please try again later.</p>';
    }
}


function displayEvents(events) {
    const container = document.getElementById('events-container');
    
    if (events.length === 0) {
        container.innerHTML = '<p>No events found matching your criteria.</p>';
        return;
    }
    
    const eventsHTML = events.map(event => createEventCard(event)).join('');
    container.innerHTML = eventsHTML;
    

    document.querySelectorAll('.event-card').forEach(card => {
        card.addEventListener('click', () => {
            const eventId = card.dataset.eventId;
            window.location.href = `/events/${eventId}`;
        });
    });
}


function createEventCard(event) {
    const priceDisplay = event.ticketPrice === 0 ? 'FREE' : `$${event.ticketPrice}`;
    const priceClass = event.ticketPrice === 0 ? 'free' : '';
    
    return `
        <article class="event-card" data-event-id="${event.id}">
            <div class="event-header">
                <h3 class="event-title">${event.name}</h3>
                <span class="event-price ${priceClass}">${priceDisplay}</span>
            </div>
            
            <div class="event-meta">
                <div class="meta-item">
                    <span class="meta-icon">🎤</span>
                    <span>${event.artists.join(', ')}</span>
                </div>
                <div class="meta-item">
                    <span class="meta-icon">📅</span>
                    <span>${formatDate(event.date)} at ${event.time}</span>
                </div>
                <div class="meta-item">
                    <span class="meta-icon">📍</span>
                    <span>${event.venue}</span>
                </div>
                <div class="meta-item">
                    <span class="meta-icon">🏢</span>
                    <span>${event.venueSize}</span>
                </div>
            </div>
            
            <div>
                <span class="genre-tag">${event.genre}</span>
            </div>
            
            <p>${event.description}</p>
        </article>
    `;
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


function setupFilters() {
    const genreFilter = document.getElementById('genre-filter');
    const priceFilter = document.getElementById('price-filter');
    const sizeFilter = document.getElementById('size-filter');
    
    [genreFilter, priceFilter, sizeFilter].forEach(filter => {
        filter.addEventListener('change', applyFilters);
    });
}


function applyFilters() {
    const genreFilter = document.getElementById('genre-filter').value;
    const priceFilter = document.getElementById('price-filter').value;
    const sizeFilter = document.getElementById('size-filter').value;
    
    let filteredEvents = allEvents;
    

    if (genreFilter) {
        filteredEvents = filteredEvents.filter(event => event.genre === genreFilter);
    }
    

    if (priceFilter) {
        const maxPrice = parseInt(priceFilter);
        filteredEvents = filteredEvents.filter(event => event.ticketPrice <= maxPrice);
    }
    

    if (sizeFilter) {
        filteredEvents = filteredEvents.filter(event => 
            event.venueSize.toLowerCase().includes(sizeFilter.toLowerCase())
        );
    }
    
    displayEvents(filteredEvents);
}