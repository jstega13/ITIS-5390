// Calendar Script with Event Scheduling
const calendarDays = document.getElementById("calendarDays");
const monthYear = document.getElementById("monthYear");
let currentDate = new Date();
let events = JSON.parse(localStorage.getItem('calendarEvents') || '{}');

function loadCalendar(date) {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    monthYear.textContent = date.toLocaleString("default", {
        month: "long",
        year: "numeric"
    });
    calendarDays.innerHTML = "";
    // Empty squares before the first day
    for (let i = 0; i < firstDay.getDay(); i++) {
        const emptyCell = document.createElement("div");
        emptyCell.classList.add("calendar-day");
        calendarDays.appendChild(emptyCell);
    }
    // Create day squares
    for (let day = 1; day <= lastDay.getDate(); day++) {
        const cell = document.createElement("div");
        cell.classList.add("calendar-day");
        
        const dayNumber = document.createElement("div");
        dayNumber.classList.add("day-number");
        dayNumber.textContent = day;
        cell.appendChild(dayNumber);
        
        const today = new Date();
        if (
            day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear()
        ) {
            cell.classList.add("today");
        }
        
        // Add events for this day
        const dateKey = `${year}-${month}-${day}`;
        if (events[dateKey]) {
            const eventsContainer = document.createElement("div");
            eventsContainer.classList.add("day-events");
            events[dateKey].forEach(event => {
                const eventEl = document.createElement("div");
                eventEl.classList.add("calendar-event");
                eventEl.textContent = event.title;
                eventEl.title = `${event.title} at ${event.time}`;
                eventsContainer.appendChild(eventEl);
            });
            cell.appendChild(eventsContainer);
        }
        
        // Click to add event
        cell.addEventListener("click", () => openEventModal(year, month, day));
        
        calendarDays.appendChild(cell);
    }
}

function openEventModal(year, month, day) {
    const dateKey = `${year}-${month}-${day}`;
    const dateStr = new Date(year, month, day).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    // Create modal
    const modal = document.createElement("div");
    modal.classList.add("event-modal");
    modal.innerHTML = `
        <div class="event-modal-content">
            <div class="event-modal-header">
                <h2>${dateStr}</h2>
                <button class="event-modal-close">&times;</button>
            </div>
            <div class="event-modal-body">
                <div class="existing-events">
                    <h3>Scheduled Events</h3>
                    <div class="events-list"></div>
                </div>
                <div class="add-event-form">
                    <h3>Add New Event</h3>
                    <input type="text" id="event-title" placeholder="Event title" />
                    <input type="time" id="event-time" />
                    <button class="btn-primary" id="add-event-btn">Add Event</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Display existing events
    const eventsList = modal.querySelector(".events-list");
    if (events[dateKey] && events[dateKey].length > 0) {
        events[dateKey].forEach((event, index) => {
            const eventItem = document.createElement("div");
            eventItem.classList.add("event-item");
            eventItem.innerHTML = `
                <div class="event-item-content">
                    <strong>${event.title}</strong>
                    <span>${event.time}</span>
                </div>
                <button class="event-delete-btn" data-index="${index}">
                    <i class="fas fa-trash"></i>
                </button>
            `;
            eventsList.appendChild(eventItem);
        });
        
        // Add delete handlers
        modal.querySelectorAll(".event-delete-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const index = parseInt(e.currentTarget.getAttribute("data-index"));
                deleteEvent(dateKey, index);
                modal.remove();
                loadCalendar(currentDate);
            });
        });
    } else {
        eventsList.innerHTML = "<p>No events scheduled for this day.</p>";
    }
    
    // Close modal
    modal.querySelector(".event-modal-close").addEventListener("click", () => {
        modal.remove();
    });
    
    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
    
    // Add event
    modal.querySelector("#add-event-btn").addEventListener("click", () => {
        const title = modal.querySelector("#event-title").value.trim();
        const time = modal.querySelector("#event-time").value;
        
        if (title && time) {
            addEvent(dateKey, title, time);
            modal.remove();
            loadCalendar(currentDate);
        } else {
            alert("Please enter both event title and time");
        }
    });
}

function addEvent(dateKey, title, time) {
    if (!events[dateKey]) {
        events[dateKey] = [];
    }
    events[dateKey].push({ title, time });
    events[dateKey].sort((a, b) => a.time.localeCompare(b.time));
    localStorage.setItem('calendarEvents', JSON.stringify(events));
}

function deleteEvent(dateKey, index) {
    if (events[dateKey]) {
        events[dateKey].splice(index, 1);
        if (events[dateKey].length === 0) {
            delete events[dateKey];
        }
        localStorage.setItem('calendarEvents', JSON.stringify(events));
    }
}

document.getElementById("prevMonth").addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    loadCalendar(currentDate);
});

document.getElementById("nextMonth").addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    loadCalendar(currentDate);
});

// Initialize
loadCalendar(currentDate);
