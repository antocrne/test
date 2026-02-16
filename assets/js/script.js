// Récupérer tous les éléments
const titleItems = document.querySelectorAll('.title-item');
const backgrounds = document.querySelectorAll('.background');

// Si pas de .title-item, on est sur une autre page → on arrête le script homepage
if (titleItems.length === 0) {
    console.log("Page projet détectée, script homepage ignoré");
} else {
    // Détection mobile
    const isMobile = window.innerWidth <= 768;

    if (isMobile) {
        // === MOBILE: Slider avec swipe et pagination ===
        
        let currentSlide = 0;
        const totalSlides = titleItems.length;
        let touchStartY = 0;
        let touchEndY = 0;
        let isAnimating = false;

        const pagination = document.createElement('div');
        pagination.className = 'pagination';
        pagination.innerHTML = `
            <span class="current">${currentSlide + 1}</span>
            <span class="separator"></span>
            <span class="total">${totalSlides}</span>
        `;
        document.body.appendChild(pagination);

        function goToSlide(index) {
            if (isAnimating || index < 0 || index >= totalSlides) return;
            
            isAnimating = true;
            currentSlide = index;

            titleItems.forEach(item => {
                item.classList.remove('active-slide');
            });

            titleItems[currentSlide].classList.add('active-slide');
            pagination.querySelector('.current').textContent = currentSlide + 1;

            setTimeout(() => {
                isAnimating = false;
            }, 600);
        }

        goToSlide(0);

        document.addEventListener('touchstart', (e) => {
            touchStartY = e.touches[0].clientY;
        });

        document.addEventListener('touchend', (e) => {
            touchEndY = e.changedTouches[0].clientY;
            handleSwipe();
        });

        function handleSwipe() {
            const swipeThreshold = 50;
            const diff = touchStartY - touchEndY;

            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    goToSlide(currentSlide + 1);
                } else {
                    goToSlide(currentSlide - 1);
                }
            }
        }

        let scrollTimeout;
        document.addEventListener('wheel', (e) => {
            e.preventDefault();
            
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                if (e.deltaY > 0) {
                    goToSlide(currentSlide + 1);
                } else {
                    goToSlide(currentSlide - 1);
                }
            }, 50);
        }, { passive: false });

    } else {
        // === DESKTOP: Comportement existant ===
        
        function changeBackground(bgId) {
            backgrounds.forEach(bg => {
                if (bg.id === bgId) {
                    bg.classList.remove('inactive');
                    bg.classList.add('active');
                } else {
                    bg.classList.remove('active');
                    bg.classList.add('inactive');
                }
            });

            titleItems.forEach(item => {
                if (item.getAttribute('data-bg') === bgId) {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
            });
        }

        titleItems.forEach(item => {
            item.addEventListener('mouseenter', function() {
                const bgId = this.getAttribute('data-bg');
                changeBackground(bgId);
            });
        });
    }

    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            location.reload();
        }, 250);
    });
}

// ═══════════════════════════════════════════════════════
// PLAYER YOUTUBE
// ═══════════════════════════════════════════════════════

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

// ✅ Détection mobile pour les contrôles
const isMobileDevice = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

function onYouTubeIframeAPIReady() {
    if (!videoId) {
        console.error("Aucun ID vidéo trouvé ! Ajoutez data-video-id sur #youtube-player");
        return;
    }
    
    player = new YT.Player('youtube-player', {
        height: '100%',
        width: '100%',
        videoId: videoId,
        playerVars: {
            'controls': isMobileDevice ? 1 : 0,  // ← YouTube sur mobile, custom sur desktop
            'disablekb': isMobileDevice ? 0 : 1,
            'modestbranding': 1,
            'rel': 0,
            'showinfo': 0,
            'iv_load_policy': 3,
            'playsinline': 1,
            'autoplay': 0,
            'fs': 1
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

function onPlayerReady(event) {
    isPlayerReady = true;
    console.log("Player prêt avec la vidéo:", videoId);
    console.log("Mode:", isMobileDevice ? "Mobile (contrôles YouTube)" : "Desktop (contrôles custom)");
}

function onPlayerStateChange(event) {
    // Sur desktop, gérer les icônes custom
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
// CONTRÔLES CUSTOM (DESKTOP UNIQUEMENT)
// ═══════════════════════════════════════════════════════

if (!isMobileDevice) {
    // GESTION DU CLIC SUR LA PREVIEW
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

    // GESTION DU SHIELD
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
                const percent = (currentTime / duration) * 100;
                progressBar.style.width = `${percent}%`;
                currentVidTime.innerText = formatTime(currentTime);
            }
        }, 100);
    }

    function stopUpdateInterval() { 
        clearInterval(updateInterval); 
    }

    const formatTime = time => {
        let seconds = Math.floor(time % 60);
        let minutes = Math.floor(time / 60) % 60;
        let hours = Math.floor(time / 3600);
        seconds = seconds < 10 ? `0${seconds}` : seconds;
        minutes = minutes < 10 ? `0${minutes}` : minutes;
        if(hours == 0) return `${minutes}:${seconds}`;
        return `${hours}:${minutes}:${seconds}`;
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

    // TIMELINE & DRAG
    if (videoTimeline) {
        videoTimeline.addEventListener("click", e => {
            if (!player || !player.getDuration) return;
            let timelineWidth = videoTimeline.clientWidth;
            let newTime = (e.offsetX / timelineWidth) * player.getDuration();
            player.seekTo(newTime, true);
        });

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

    // BOUTONS CONTRÔLES
    if (playPauseBtn) {
        document.querySelector('.play-pause').addEventListener("click", () => {
            if (!isPlayerReady) return;
            
            if (videoPreview && !videoPreview.classList.contains('hidden')) {
                videoPreview.classList.add('hidden');
            }
            
            player.getPlayerState() === YT.PlayerState.PLAYING ? player.pauseVideo() : player.playVideo();
        });
    }

    if (volumeBtn) {
        document.querySelector('.volume').addEventListener("click", () => {
            if (!isPlayerReady) return;
            if (player.isMuted()) {
                player.unMute();
                volumeBtn.classList.replace("fa-volume-xmark", "fa-volume-high");
            } else {
                player.mute();
                volumeBtn.classList.replace("fa-volume-high", "fa-volume-xmark");
            }
        });
    }

    // FULLSCREEN (DESKTOP)
    if (fullScreenBtn) {
        document.querySelector('.fullscreen').addEventListener("click", () => {
            if (!isPlayerReady) return;
            
            container.classList.toggle("fullscreen");
            if(document.fullscreenElement) {
                fullScreenBtn.classList.replace("fa-down-left-and-up-right-to-center", "fa-up-right-and-down-left-from-center");
                document.exitFullscreen();
            } else {
                fullScreenBtn.classList.replace("fa-up-right-and-down-left-from-center", "fa-down-left-and-up-right-to-center");
                container.requestFullscreen();
            }
        });
    }

    document.addEventListener('fullscreenchange', () => {
        if (!document.fullscreenElement) {
            container.classList.remove('fullscreen');
            if (fullScreenBtn) {
                fullScreenBtn.classList.replace("fa-down-left-and-up-right-to-center", "fa-up-right-and-down-left-from-center");
            }
        }
    });

    // CLAVIER (DESKTOP)
    document.addEventListener('keydown', (e) => {
        if (!isPlayerReady) return;
        if (e.keyCode === 32) {
            e.preventDefault();
            
            if (videoPreview && !videoPreview.classList.contains('hidden')) {
                videoPreview.classList.add('hidden');
            }
            
            player.getPlayerState() === YT.PlayerState.PLAYING ? player.pauseVideo() : player.playVideo();
        }
        if (e.keyCode === 37) {
            e.preventDefault();
            player.seekTo(Math.max(0, player.getCurrentTime() - 5), true);
        }
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