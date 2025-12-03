document.addEventListener('DOMContentLoaded', () => {
    setupCallsPage();
});

let activeCallInterval = null;

function setupCallsPage() {
    markMissedCalls();
    setupMissedFilter();
    setupRecentCallHandlers();
    setupStartCallButtons();
}

/* Mark which calls are 'missed' based on existing CSS classes */
function markMissedCalls() {
    const callItems = document.querySelectorAll('.call-item');
    callItems.forEach(item => {
        const missedAvatar = item.querySelector('.call-avatar.missed');
        const missedType = item.querySelector('.call-type.missed');
        if (missedAvatar || missedType) {
            item.classList.add('missed-call');
        }
    });
}

/* Add "Missed only" toggle button */
function setupMissedFilter() {
    const recentPanel = document.querySelector('.calls-recent');
    if (!recentPanel) return;

    const header = recentPanel.querySelector('.panel-header');
    if (!header) return;

    const toggleBtn = document.createElement('button');
    toggleBtn.type = 'button';
    toggleBtn.className = 'panel-link-btn missed-toggle-btn';
    toggleBtn.innerHTML = '<i class="fas fa-filter"></i> Missed only';

    header.appendChild(toggleBtn);

    let missedOnly = false;

    toggleBtn.addEventListener('click', () => {
        missedOnly = !missedOnly;
        recentPanel.classList.toggle('missed-only', missedOnly);
        toggleBtn.classList.toggle('active', missedOnly);
        toggleBtn.innerHTML = missedOnly
            ? '<i class="fas fa-filter"></i> Showing missed'
            : '<i class="fas fa-filter"></i> Missed only';
    });
}

/* Wire up recent call items to start a fake call */
function setupRecentCallHandlers() {
    const callItems = document.querySelectorAll('.call-item');

    callItems.forEach(item => {
        item.addEventListener('click', (e) => {
            // Avoid triggering if some other non-call control appears later
            if (e.target.closest('.panel-link-btn')) return;

            const nameEl = item.querySelector('.call-name');
            const typeEl = item.querySelector('.call-type');

            const name = nameEl ? nameEl.textContent.trim() : 'Unknown contact';
            let type = 'Audio';

            if (typeEl && typeEl.querySelector('.fa-video')) {
                type = 'Video';
            }

            startFakeCall(name, type);
        });

        // If the small call-action button is clicked, it's still handled by above,
        // but we could specialize if needed.
    });
}

/* Wire up the "Start a call" buttons */
function setupStartCallButtons() {
    const searchInput = document.getElementById('call-search');
    const audioBtn = document.querySelector('.start-call-buttons .btn-primary');
    const videoBtn = document.querySelector('.start-call-buttons .btn-secondary');

    if (audioBtn) {
        audioBtn.addEventListener('click', () => {
            const name = (searchInput && searchInput.value.trim()) || 'Unknown contact';
            startFakeCall(name, 'Audio');
        });
    }

    if (videoBtn) {
        videoBtn.addEventListener('click', () => {
            const name = (searchInput && searchInput.value.trim()) || 'Unknown contact';
            startFakeCall(name, 'Video');
        });
    }
}

/* Create or update a fake call banner with timer */
function startFakeCall(name, type) {
    let banner = document.getElementById('active-call-banner');

    if (!banner) {
        banner = document.createElement('div');
        banner.id = 'active-call-banner';
        banner.className = 'active-call-banner';

        banner.innerHTML = `
            <div class="active-call-info">
                <div class="active-call-name"></div>
                <div class="active-call-meta">
                    <span class="active-call-type"></span>
                    ·
                    <span class="active-call-timer">00:00</span>
                </div>
            </div>
            <button class="active-call-end-btn" type="button">
                <i class="fas fa-phone-slash"></i>
                End
            </button>
        `;

        document.body.appendChild(banner);

        const endBtn = banner.querySelector('.active-call-end-btn');
        endBtn.addEventListener('click', endFakeCall);
    }

    const nameEl = banner.querySelector('.active-call-name');
    const typeEl = banner.querySelector('.active-call-type');
    const timerEl = banner.querySelector('.active-call-timer');

    if (nameEl) nameEl.textContent = name;
    if (typeEl) typeEl.textContent = type + ' call';
    if (timerEl) timerEl.textContent = '00:00';

    banner.classList.remove('hidden');

    if (activeCallInterval) {
        clearInterval(activeCallInterval);
        activeCallInterval = null;
    }

    const startTime = Date.now();

    activeCallInterval = setInterval(() => {
        const elapsedSec = Math.floor((Date.now() - startTime) / 1000);
        if (timerEl) {
            timerEl.textContent = formatDuration(elapsedSec);
        }
    }, 1000);
}

function endFakeCall() {
    const banner = document.getElementById('active-call-banner');
    if (banner) {
        banner.classList.add('hidden');
    }

    if (activeCallInterval) {
        clearInterval(activeCallInterval);
        activeCallInterval = null;
    }
}

/* Format seconds as MM:SS */
function formatDuration(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;

    const mm = mins.toString().padStart(2, '0');
    const ss = secs.toString().padStart(2, '0');
    return `${mm}:${ss}`;
}
