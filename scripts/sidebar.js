// Load Sidebar HTML
fetch("../components/sidebar.html")
    .then(res => res.text())
    .then(data => {
        document.getElementById("sidebar-container").innerHTML = data;

        // Highlight "Calendar" automatically
        const current = window.location.pathname;
        const calendarLink = document.querySelector('a[href*="calendar.html"]');
        if (calendarLink) calendarLink.classList.add("active");
    });
