// Inject topbar component
fetch("/components/topbar.html")
    .then(r => r.text())
    .then(html => {
        document.getElementById("topbar").innerHTML = html;
    })
    .catch(err => console.error("Topbar load error:", err));

