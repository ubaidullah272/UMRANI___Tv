
function embedUrl(url) {
    try {
        const u = new URL(url);
        let id = "";

        if (u.hostname.includes("youtu.be")) {
            id = u.pathname.slice(1);
        } else if (u.pathname === "/watch") {
            id = u.searchParams.get("v") || "";
        } else if (
            ["/live/", "/shorts/", "/embed/"]
            .some(x => u.pathname.startsWith(x))
        ) {
            id = u.pathname.split("/")[2] || "";
        }

        return id
            ? `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`
            : url;

    } catch (e) {
        return url;
    }
}

function playVideo(url, title) {
    const player = document.getElementById("player");
    const frame = document.getElementById("frame");
    const playerTitle = document.getElementById("playerTitle");

    if (!player || !frame || !playerTitle) return;

    playerTitle.textContent = title || "Now Playing";

    frame.innerHTML = `
        <div class="umrani-player-header">
            <span class="umrani-logo">UMRANI TV</span>
            <span class="live-indicator">● PLAYING</span>
        </div>

        <div class="umrani-video-screen">
            <iframe
                src="${embedUrl(url)}"
                title="UMRANI TV Player"
                allow="autoplay; encrypted-media; picture-in-picture"
                allowfullscreen>
            </iframe>
        </div>

        <div class="umrani-player-footer">
            <span>▶ ${title || "Now Playing"}</span>
            <span>UMRANI TV</span>
        </div>
    `;

    player.classList.add("active");

    // Keep the player in its current position.
    // Do not automatically scroll to the top.
}

function closePlayer() {
    const frame = document.getElementById("frame");
    const player = document.getElementById("player");

    if (!frame || !player) return;

    frame.innerHTML = "";
    player.classList.remove("active");
}

function brightness(value) {
    const frame = document.querySelector(".umrani-video-screen");

    if (frame) {
        frame.style.filter = `brightness(${value}%)`;
    }
}

function volume(value) {
    const display = document.getElementById("volumeValue");

    if (display) {
        display.textContent = value + "%";
    }
}

function fullscreen() {
    const video = document.querySelector(".umrani-video-screen");

    if (video && video.requestFullscreen) {
        video.requestFullscreen();
    }
}
