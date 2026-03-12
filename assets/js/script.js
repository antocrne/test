// ======================================================
// 1. HOMEPAGE (Slider / Backgrounds / Clics)
// ======================================================
const titleItems = document.querySelectorAll('.title-item');
const backgrounds = document.querySelectorAll('.background');

if (titleItems.length > 0) {
    const isMobile = window.innerWidth <= 768;

    // --- FONCTION DE REDIRECTION COMMUNE ---
    const goToActiveProject = () => {
        const activeItem = document.querySelector('.title-item.active, .title-item.active-slide');
        if (activeItem) {
            const link = activeItem.querySelector('a');
            if (link) window.location.href = link.href;
        }
    };

    if (isMobile) {
        // === MOBILE: Slider + Pagination ===
        let currentSlide = 0;
        const totalSlides = titleItems.length;
        let touchStartY = 0;

        
        const pagination = document.createElement('div');
        pagination.className = 'pagination';
        pagination.style.display = 'flex'; 
        pagination.innerHTML = `
            <span class="current">1</span>
            <span class="separator"></span>
            <span class="total">${totalSlides}</span>
        `;
        document.body.appendChild(pagination);

        function goToSlide(index) {
            if (index < 0 || index >= totalSlides) return;
            currentSlide = index;

            titleItems.forEach((item, i) => {
                item.classList.toggle('active-slide', i === index);
                item.classList.toggle('active', i === index);
            });

            // Mise à jour du chiffre de la pagination
            pagination.querySelector('.current').textContent = currentSlide + 1;
        }

        // Swipe Logic
        document.addEventListener('touchstart', e => touchStartY = e.touches[0].clientY);
        document.addEventListener('touchend', e => {
            const diff = touchStartY - e.changedTouches[0].clientY;
            if (Math.abs(diff) > 50) {
                diff > 0 ? goToSlide(currentSlide + 1) : goToSlide(currentSlide - 1);
            }
        });

        goToSlide(0);

    } else {
        // === DESKTOP: Hover ===
        titleItems.forEach(item => {
            item.addEventListener('mouseenter', function() {
                const bgId = this.getAttribute('data-bg');
                backgrounds.forEach(bg => {
                    bg.classList.toggle('active', bg.id === bgId);
                    bg.classList.toggle('inactive', bg.id !== bgId);
                });
                titleItems.forEach(t => t.classList.toggle('active', t === item));
            });
        });
    }

    // === LE CLIC GLOBAL (Background cliquable) ===
    document.addEventListener('click', (e) => {
        // On ne redirige pas si on clique sur le menu ou un lien déjà existant
        const isMenu = e.target.closest('nav');
        const isLink = e.target.tagName === 'A' || e.target.closest('a');
        
        if (!isMenu && !isLink) {
            goToActiveProject();
        }
    });

    // Resize propre
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            location.reload();
        }, 250);
    });
}
// ======================================================
// 2. PLAYER YOUTUBE (Projets)
// ======================================================
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

let player;
let isPlayerReady = false;
let timer;
let updateInterval;

const container = document.querySelector(".container");
const playPauseBtn = document.querySelector(".play-pause i");
const videoTimeline = document.querySelector(".video-timeline");
const progressBar = document.querySelector(".progress-bar");
const volumeBtn = document.querySelector(".volume i");
const currentVidTime = document.querySelector(".current-time");
const fullScreenBtn = document.querySelector(".fullscreen i");
const shield = document.querySelector(".video-shield");
const videoPreview = document.querySelector(".video-preview");

const videoContainer = document.getElementById('youtube-player');
const videoId = videoContainer ? videoContainer.getAttribute('data-video-id') : null;
const isMobileDevice = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

function onYouTubeIframeAPIReady() {
    if (!videoId) return;
    
    player = new YT.Player('youtube-player', {
        height: '100%',
        width: '100%',
        videoId: videoId,
        playerVars: {
            'controls': isMobileDevice ? 1 : 0,
            'modestbranding': 1,
            'rel': 0,
            'showinfo': 0,
            'iv_load_policy': 3,
            'playsinline': 1,
            'fs': 1
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

function onPlayerReady() { isPlayerReady = true; }

function onPlayerStateChange(event) {
    if (!isMobileDevice && playPauseBtn) {
        if (event.data == YT.PlayerState.PLAYING) {
            playPauseBtn.classList.replace("fa-play", "fa-pause");
            if(shield) shield.classList.add("active-yt");
            startUpdateInterval();
            hideControls();
        } else {
            playPauseBtn.classList.replace("fa-pause", "fa-play");
            if(shield) shield.classList.remove("active-yt");
            stopUpdateInterval();
        }
    }
}

// LOGIQUE DES CONTRÔLES CUSTOM (Desktop)
if (!isMobileDevice && container) {
    
    // Shield & Mousemove
    if(shield) {
        shield.addEventListener("click", () => { player.pauseVideo(); });
        shield.addEventListener("mousemove", () => {
            container.classList.add("show-controls");
            clearTimeout(timer);
            hideControls();   
        });
    }

    function startUpdateInterval() {
        updateInterval = setInterval(() => {
            if (player && player.getCurrentTime) {
                const currentTime = player.getCurrentTime();
                const duration = player.getDuration();
                progressBar.style.width = `${(currentTime / duration) * 100}%`;
                currentVidTime.innerText = formatTime(currentTime);
            }
        }, 100);
    }

    function stopUpdateInterval() { clearInterval(updateInterval); }

    const formatTime = time => {
        let m = Math.floor(time / 60);
        let s = Math.floor(time % 60);
        return `${m < 10 ? '0'+m : m}:${s < 10 ? '0'+s : s}`;
    }

    const hideControls = () => {
        if (!player || player.getPlayerState() !== YT.PlayerState.PLAYING) return;
        timer = setTimeout(() => { container.classList.remove("show-controls"); }, 3000);
    }

    container.addEventListener("mousemove", () => {
        container.classList.add("show-controls");
        clearTimeout(timer);
        hideControls();   
    });

    // Play/Pause & Fullscreen
    document.querySelector('.play-pause')?.addEventListener("click", () => {
        if (!isPlayerReady) return;
        player.getPlayerState() === YT.PlayerState.PLAYING ? player.pauseVideo() : player.playVideo();
    });

    document.querySelector('.fullscreen')?.addEventListener("click", () => {
        if (!isPlayerReady) return;
        if (!document.fullscreenElement) {
            container.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    });
}