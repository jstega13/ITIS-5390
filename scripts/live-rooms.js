// scripts/live-rooms.js

document.addEventListener("DOMContentLoaded", () => {
    // ---- Config: where to load the JSON from (relative to pages/live-rooms.html) ----
    const ROOMS_JSON_URL = "../data/rooms.json";

    // ---- State ----
    let rooms = [];          // full list from JSON
    let filteredRooms = [];  // search results
    let selectedRoomId = null;

    // ---- DOM elements ----
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

    // ---------------------------------------------------------------------
    // JSON loading
    // ---------------------------------------------------------------------
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
            renderRoomDetail(null); // start with empty state
        } catch (err) {
            console.error(err);
            roomsListEl.innerHTML = `<li class="room-list-item" style="opacity:0.7;">Could not load rooms.</li>`;
        }
    }

    // ---------------------------------------------------------------------
    // Rendering – list + detail
    // ---------------------------------------------------------------------
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

            // Avatar
            const avatar = document.createElement("div");
            avatar.className = "room-list-avatar";
            avatar.textContent = getRoomInitials(room.name);

            // Main text stack
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
            detailEl.hidden = true;
            return;
        }

        selectedRoomId = room.id;
        emptyStateEl.style.display = "none";
        detailEl.hidden = false;

        avatarEl.textContent = getRoomInitials(room.name);
        nameEl.textContent = room.name;
        subtitleEl.textContent = room.topic || "";

        // Live pill
        livePillEl.style.display = room.live ? "inline-flex" : "none";

        // Joined pill
        joinedPillEl.style.display = room.joined ? "inline-flex" : "none";

        // Button state
        updateJoinLeaveButton(room);

        // Meta
        metaParticipantsEl.textContent = `${room.participants} active`;
        metaTopicEl.textContent = room.topic || "—";
        metaTypeEl.textContent = room.type || "—";

        // Description
        descriptionEl.textContent =
            room.description ||
            "No description provided for this room.";

        // Activity
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

        // Ensure active selection styling in list stays in sync
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

    // ---------------------------------------------------------------------
    // Helpers
    // ---------------------------------------------------------------------
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

    // Basic JSON search algorithm: search across name, topic, and type.
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

            // all tokens must be present
            return tokens.every((tok) => haystack.includes(tok));
        });
    }

    // ---------------------------------------------------------------------
    // Event wiring
    // ---------------------------------------------------------------------

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

        room.joined = !room.joined;

        // Adjust participant count as visual feedback
        if (room.joined) {
            room.participants += 1;
        } else {
            room.participants = Math.max(0, room.participants - 1);
        }

        renderRoomDetail(room);
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
                joined: true,
                recentActivity: [
                    "Room created.",
                    "You joined the room."
                ]
            };

            rooms.push(newRoom);
            // Refresh search results using current query
            const currentQuery = searchInputEl ? searchInputEl.value : "";
            filteredRooms = searchRooms(currentQuery);
            renderRoomsList();
            renderRoomDetail(newRoom);
        });
    }

    // ---------------------------------------------------------------------
    // Init
    // ---------------------------------------------------------------------
    loadRoomsFromJson();
});
