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

function onPlayerReady() { 
    isPlayerReady = true;
    console.log('Player prêt !');
}

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

// ═══════════════════════════════════════════════════════
// CONTRÔLES DESKTOP
// ═══════════════════════════════════════════════════════

if (!isMobileDevice && container) {
    
    //GESTION DE LA PREVIEW
    if (videoPreview) {
        videoPreview.addEventListener('click', () => {
            if (!isPlayerReady) return;
            
            videoPreview.classList.add('hidden');
            setTimeout(() => {
                videoPreview.style.display = 'none';
            }, 1500);
            
            player.playVideo();
        });
    }

    // Shield & Mousemove
    if(shield) {
        shield.addEventListener("click", () => { 
            if (!isPlayerReady) return;
            player.pauseVideo(); 
        });
        
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

    function stopUpdateInterval() { 
        clearInterval(updateInterval); 
    }

    const formatTime = time => {
        let m = Math.floor(time / 60);
        let s = Math.floor(time % 60);
        return `${m < 10 ? '0'+m : m}:${s < 10 ? '0'+s : s}`;
    }

    const hideControls = () => {
        if (!player || player.getPlayerState() !== YT.PlayerState.PLAYING) return;
        timer = setTimeout(() => { 
            container.classList.remove("show-controls"); 
        }, 3000);
    }

    container.addEventListener("mousemove", () => {
        container.classList.add("show-controls");
        clearTimeout(timer);
        hideControls();   
    });

    //PLAY/PAUSE avec gestion de la preview
    document.querySelector('.play-pause')?.addEventListener("click", () => {
        if (!isPlayerReady) return;
        
        // Cache la preview si visible
        if (videoPreview && !videoPreview.classList.contains('hidden')) {
            videoPreview.classList.add('hidden');
            setTimeout(() => {
                videoPreview.style.display = 'none';
            }, 1500);
        }
        
        player.getPlayerState() === YT.PlayerState.PLAYING ? player.pauseVideo() : player.playVideo();
    });

    //VOLUME
    document.querySelector('.volume')?.addEventListener("click", () => {
        if (!isPlayerReady) return;
        if (player.isMuted()) {
            player.unMute();
            volumeBtn.classList.replace("fa-volume-xmark", "fa-volume-high");
        } else {
            player.mute();
            volumeBtn.classList.replace("fa-volume-high", "fa-volume-xmark");
        }
    });

    // TIMELINE INTERACTIVE
    if (videoTimeline) {
        // Clic sur timeline
        videoTimeline.addEventListener("click", e => {
            if (!player || !player.getDuration) return;
            let timelineWidth = videoTimeline.clientWidth;
            let newTime = (e.offsetX / timelineWidth) * player.getDuration();
            player.seekTo(newTime, true);
        });

        // Drag sur timeline
        const draggableProgressBar = e => {
            let timelineWidth = videoTimeline.clientWidth;
            let newTime = (e.offsetX / timelineWidth) * player.getDuration();
            player.seekTo(newTime, true);
        }

        videoTimeline.addEventListener("mousedown", () => {
            videoTimeline.addEventListener("mousemove", draggableProgressBar);
        });
        
        document.addEventListener("mouseup", () => {
            videoTimeline.removeEventListener("mousemove", draggableProgressBar);
        });
    }

    // FULLSCREEN
    document.querySelector('.fullscreen')?.addEventListener("click", () => {
        if (!isPlayerReady) return;
        
        container.classList.toggle("fullscreen");
        
        if (document.fullscreenElement) {
            fullScreenBtn.classList.replace("fa-down-left-and-up-right-to-center", "fa-up-right-and-down-left-from-center");
            document.exitFullscreen();
        } else {
            fullScreenBtn.classList.replace("fa-up-right-and-down-left-from-center", "fa-down-left-and-up-right-to-center");
            container.requestFullscreen();
        }
    });

    // Gestion touche ÉCHAP pour fullscreen
    document.addEventListener('fullscreenchange', () => {
        if (!document.fullscreenElement) {
            container.classList.remove('fullscreen');
            if (fullScreenBtn) {
                fullScreenBtn.classList.replace("fa-down-left-and-up-right-to-center", "fa-up-right-and-down-left-from-center");
            }
        }
    });

    // CONTRÔLES CLAVIER
    document.addEventListener('keydown', (e) => {
        if (!isPlayerReady) return;
        
        // Espace = Play/Pause
        if (e.keyCode === 32) {
            e.preventDefault();
            
            if (videoPreview && !videoPreview.classList.contains('hidden')) {
                videoPreview.classList.add('hidden');
            }
            
            player.getPlayerState() === YT.PlayerState.PLAYING ? player.pauseVideo() : player.playVideo();
        }
        
        // Flèche gauche = -5 secondes
        if (e.keyCode === 37) {
            e.preventDefault();
            player.seekTo(Math.max(0, player.getCurrentTime() - 5), true);
        }
        
        // Flèche droite = +5 secondes
        if (e.keyCode === 39) {
            e.preventDefault();
            player.seekTo(Math.min(player.getDuration(), player.getCurrentTime() + 5), true);
        }
    });
}

// ═══════════════════════════════════════════════════════
// MOBILE : Preview uniquement
// ═══════════════════════════════════════════════════════

if (isMobileDevice && videoPreview) {
    videoPreview.addEventListener('click', () => {
        if (!isPlayerReady) return;
        
        videoPreview.classList.add('hidden');
        setTimeout(() => {
            videoPreview.style.display = 'none';
        }, 1500);
        
        player.playVideo();
    });
}