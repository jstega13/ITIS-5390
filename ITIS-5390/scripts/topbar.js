// Load Topbar HTML
fetch("../components/topbar.html")
    .then(res => res.text())
    .then(data => {
        document.getElementById("topbar-container").innerHTML = data;
    });
