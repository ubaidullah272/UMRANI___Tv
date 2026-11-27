
(function () {
    const css = `
    #player {
        display:none;
        width:100%;
        background:#080808;
        border:1px solid #ff531c;
        border-radius:15px;
        overflow:hidden;
        box-shadow:0 0 20px #ff531c35;
        margin:15px 0;
    }

    #player.active { display:block; }

    .umrani-top {
        display:flex;
        justify-content:space-between;
        align-items:center;
        padding:15px;
        background:linear-gradient(90deg,#080808,#241008,#080808);
        border-bottom:1px solid #ff531c;
    }

    .umrani-brand {
        color:#ff571e;
        font-size:21px;
        font-weight:900;
        letter-spacing:2px;
        text-shadow:0 0 10px #ff531c;
    }

    .umrani-status {
        color:#ff6840;
        font-size:10px;
        font-weight:bold;
    }

    .umrani-screen {
        width:100%;
        aspect-ratio:16/9;
        background:#000;
    }

    .umrani-screen iframe {
        width:100%;
        height:100%;
        border:0;
    }

    .umrani-details {
        padding:14px;
        background:#101010;
        border-bottom:1px solid #292929;
    }

    .umrani-details strong {
        color:white;
        font-size:15px;
        display:block;
        overflow-wrap:anywhere;
    }

    .umrani-details small {
        color:#ff642c;
        display:block;
        margin-top:7px;
        font-size:11px;
    }

    .umrani-controls {
        display:flex;
        gap:9px;
        flex-wrap:wrap;
        align-items:center;
        padding:13px;
        background:#090909;
    }

    .umrani-controls button {
        background:#191919;
        border:1px solid #ff531c;
        color:#ff6b38;
        padding:10px 14px;
        border-radius:8px;
        font-weight:bold;
        cursor:pointer;
    }

    .umrani-controls button:active {
        background:#ff531c;
        color:white;
    }

    .umrani-close {
        margin-left:auto;
    }

    @media(max-width:480px) {
        .umrani-brand {font-size:17px;}
        .umrani-controls button {
            padding:9px 11px;
            font-size:12px;
        }
    }
    `;

    if (!document.getElementById("umrani-player-style")) {
        const style = document.createElement("style");
        style.id = "umrani-player-style";
        style.textContent = css;
        document.head.appendChild(style);
    }

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
                ? "https://www.youtube.com/embed/" +
                  encodeURIComponent(id) + "?autoplay=1&rel=0"
                : url;
        } catch(e) {
            return url;
        }
    }

    function createPlayer() {
        let player = document.getElementById("player");
        if (player) return player;

        player = document.createElement("div");
        player.id = "player";

        player.innerHTML = `
            <div class="umrani-top">
                <span class="umrani-brand">UMRANI TV</span>
                <span class="umrani-status">● NOW PLAYING</span>
            </div>

            <div id="frame"></div>

            <div class="umrani-details">
                <strong id="playerTitle">Now Playing</strong>
                <small>Enjoy Your Entertainment • UMRANI TV</small>
            </div>

            <div class="umrani-controls">
                <button onclick="umraniFullscreen()">⛶ Fullscreen</button>
                <button onclick="umraniBrightness()">☀ Brightness</button>
                <button class="umrani-close" onclick="closePlayer()">✕ Close</button>
            </div>
        `;

        document.body.appendChild(player);
        return player;
    }

    window.playVideo = function(url, title) {
        if (!url) return;

        const player = createPlayer();
        const frame = document.getElementById("frame");

        document.getElementById("playerTitle").textContent =
            title || "Now Playing";

        const screen = document.createElement("div");
        screen.className = "umrani-screen";

        const iframe = document.createElement("iframe");
        iframe.src = embedUrl(url);
        iframe.title = "UMRANI TV";
        iframe.allow =
            "autoplay; encrypted-media; picture-in-picture; fullscreen";
        iframe.allowFullscreen = true;

        screen.appendChild(iframe);
        frame.replaceChildren(screen);

        player.classList.add("active");

        // No automatic scroll.
    };

    window.closePlayer = function() {
        const frame = document.getElementById("frame");
        const player = document.getElementById("player");

        if (frame) frame.replaceChildren();
        if (player) player.classList.remove("active");
    };

    window.umraniFullscreen = function() {
        const screen = document.querySelector(".umrani-screen");
        if (screen && screen.requestFullscreen) {
            screen.requestFullscreen();
        }
    };

    window.umraniBrightness = function() {
        const screen = document.querySelector(".umrani-screen");
        if (!screen) return;

        const current = Number(screen.dataset.brightness || 100);
        const next = current >= 150 ? 70 : current + 20;

        screen.dataset.brightness = next;
        screen.style.filter = "brightness(" + next + "%)";
    };

})();
