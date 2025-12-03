// scripts/live-rooms.js - Updated with Video Call Integration

document.addEventListener("DOMContentLoaded", () => {
    const ROOMS_JSON_URL = "../data/data.json";

    let rooms = [];
    let filteredRooms = [];
    let selectedRoomId = null;

    const roomsListEl = document.getElementById("rooms-list");
    const searchInputEl = document.getElementById("rooms-search-input");
    const createRoomBtn = document.getElementById("create-room-btn");

    const emptyStateEl = document.getElementById("room-empty-state");
    const detailEl = document.getElementById("room-detail");

    const avatarEl = document.getElementById("room-detail-avatar");
    const nameEl = document.getElementById("room-detail-name");
    const subtitleEl = document.getElementById("room-detail-subtitle");
    const livePillEl = document.getElementById("room-detail-live-pill");
    const joinedPillEl = document.getElementById("room-detail-joined-pill");
    const joinLeaveBtn = document.getElementById("room-join-leave-btn");

    const metaParticipantsEl = document.getElementById("room-meta-participants");
    const metaTopicEl = document.getElementById("room-meta-topic");
    const metaTypeEl = document.getElementById("room-meta-type");

    const descriptionEl = document.getElementById("room-description-text");
    const activityListEl = document.getElementById("room-activity-list");

    // Load rooms from JSON
    async function loadRoomsFromJson() {
        try {
            const response = await fetch(ROOMS_JSON_URL);
            if (!response.ok) {
                throw new Error(`Failed to load rooms.json: ${response.status}`);
            }
            const data = await response.json();

            rooms = Array.isArray(data) ? data : [];
            filteredRooms = [...rooms];

            renderRoomsList();
            renderRoomDetail(null);
        } catch (err) {
            console.error(err);
            roomsListEl.innerHTML = `<li class="room-list-item" style="opacity:0.7;">Could not load rooms.</li>`;
        }
    }

    function renderRoomsList() {
        roomsListEl.innerHTML = "";

        if (filteredRooms.length === 0) {
            const li = document.createElement("li");
            li.className = "room-list-item";
            li.style.opacity = "0.7";
            li.textContent = "No rooms match your search.";
            roomsListEl.appendChild(li);
            return;
        }

        filteredRooms.forEach((room) => {
            const li = document.createElement("li");
            li.className = "room-list-item";
            li.dataset.roomId = room.id;

            if (room.id === selectedRoomId) {
                li.classList.add("active");
            }

            const avatar = document.createElement("div");
            avatar.className = "room-list-avatar";
            avatar.textContent = getRoomInitials(room.name);

            const main = document.createElement("div");
            main.className = "room-list-main";

            const nameRow = document.createElement("div");
            nameRow.className = "room-list-name-row";

            const nameSpan = document.createElement("span");
            nameSpan.className = "room-list-name";
            nameSpan.textContent = room.name;

            nameRow.appendChild(nameSpan);

            if (room.live) {
                const liveDot = document.createElement("div");
                liveDot.className = "room-list-live-dot";
                nameRow.appendChild(liveDot);
            }

            const meta = document.createElement("div");
            meta.className = "room-list-meta";
            meta.textContent = `${room.participants} in room • ${room.topic}`;

            main.appendChild(nameRow);
            main.appendChild(meta);

            li.appendChild(avatar);
            li.appendChild(main);

            if (room.joined) {
                const joinedTag = document.createElement("span");
                joinedTag.className = "room-list-joined-tag";
                joinedTag.textContent = "In room";
                li.appendChild(joinedTag);
            }

            roomsListEl.appendChild(li);
        });
    }

    function renderRoomDetail(room) {
        if (!room) {
            selectedRoomId = null;
            emptyStateEl.style.display = "block";
            detailEl.style.display = "none";
            return;
        }

        selectedRoomId = room.id;
        emptyStateEl.style.display = "none";
        detailEl.style.display = "flex";

        avatarEl.textContent = getRoomInitials(room.name);
        nameEl.textContent = room.name;
        subtitleEl.textContent = room.topic || "";

        livePillEl.style.display = room.live ? "inline-flex" : "none";
        joinedPillEl.style.display = room.joined ? "inline-flex" : "none";

        updateJoinLeaveButton(room);

        metaParticipantsEl.textContent = `${room.participants} active`;
        metaTopicEl.textContent = room.topic || "—";
        metaTypeEl.textContent = room.type || "—";

        descriptionEl.textContent =
            room.description ||
            "No description provided for this room.";

        activityListEl.innerHTML = "";
        if (Array.isArray(room.recentActivity) && room.recentActivity.length) {
            room.recentActivity.forEach((entry) => {
                const li = document.createElement("li");
                li.textContent = entry;
                activityListEl.appendChild(li);
            });
        } else {
            const li = document.createElement("li");
            li.textContent = "No activity yet. Join the room to get started.";
            activityListEl.appendChild(li);
        }

        renderRoomsList();
    }

    function updateJoinLeaveButton(room) {
        joinLeaveBtn.classList.remove("room-cta-join", "room-cta-leave");

        if (room.joined) {
            joinLeaveBtn.classList.add("room-cta-leave");
            joinLeaveBtn.innerHTML =
                '<i class="fas fa-sign-out-alt"></i> Leave Room';
        } else {
            joinLeaveBtn.classList.add("room-cta-join");
            joinLeaveBtn.innerHTML =
                '<i class="fas fa-sign-in-alt"></i> Join Room';
        }
    }

    function getRoomInitials(name) {
        const parts = name.split(" ").filter(Boolean);
        if (parts.length === 0) return "?";
        if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
        return (
            parts[0].charAt(0).toUpperCase() +
            parts[1].charAt(0).toUpperCase()
        );
    }

    function findRoomById(id) {
        return rooms.find((r) => r.id === id) || null;
    }

    function searchRooms(query) {
        const term = query.trim().toLowerCase();
        if (!term) {
            return [...rooms];
        }

        const tokens = term.split(/\s+/).filter(Boolean);

        return rooms.filter((room) => {
            const haystack =
                `${room.name} ${room.topic} ${room.type}`
                    .toLowerCase();

            return tokens.every((tok) => haystack.includes(tok));
        });
    }

    // ** NEW: Launch Video Call Interface **
    function launchVideoCall(room) {
        // Store room data in sessionStorage for the call page
        sessionStorage.setItem('activeCallRoom', JSON.stringify(room));
        
        // Redirect to video call page
        window.location.href = '../pages/call.html';
    }

    // Click on a room in the list
    roomsListEl.addEventListener("click", (e) => {
        const item = e.target.closest(".room-list-item");
        if (!item || !item.dataset.roomId) return;

        const room = findRoomById(item.dataset.roomId);
        if (!room) return;

        renderRoomDetail(room);
    });

    // Join / Leave button
    joinLeaveBtn.addEventListener("click", () => {
        if (!selectedRoomId) return;

        const room = findRoomById(selectedRoomId);
        if (!room) return;

        if (room.joined) {
            // Leave room
            room.joined = false;
            room.participants = Math.max(0, room.participants - 1);
            renderRoomDetail(room);
        } else {
            // Join room - Launch video call
            room.joined = true;
            room.participants += 1;
            launchVideoCall(room);
        }
    });

    // Search input
    if (searchInputEl) {
        searchInputEl.addEventListener("input", (e) => {
            filteredRooms = searchRooms(e.target.value);
            renderRoomsList();
        });
    }

    // Create a new room
    if (createRoomBtn) {
        createRoomBtn.addEventListener("click", () => {
            const name = prompt("Name your new room:");
            if (!name) return;

            const trimmed = name.trim();
            if (!trimmed) return;

            const newRoom = {
                id: "room-" + Date.now(),
                name: trimmed,
                topic: "Custom room",
                type: "Drop-in",
                description:
                    "Ad-hoc space created from the Live Rooms page. Use this for quick huddles or focus sessions.",
                participants: 1,
                live: true,
                joined: false,
                recentActivity: [
                    "Room created.",
                    "Ready to join!"
                ]
            };

            rooms.push(newRoom);
            const currentQuery = searchInputEl ? searchInputEl.value : "";
            filteredRooms = searchRooms(currentQuery);
            renderRoomsList();
            renderRoomDetail(newRoom);
        });
    }

    // Initialize
    loadRoomsFromJson();
});
