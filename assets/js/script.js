// ═══════════════════════════════════════════════════════
// HOMEPAGE - NAVIGATION PROJETS
// ═══════════════════════════════════════════════════════

const projectItems = document.querySelectorAll('.project-item');
const backgroundImages = document.querySelectorAll('.background-image');
const leftSection = document.querySelector('.left-section');
const rightSection = document.querySelector('.right-section');
const tapIndicator = document.querySelector('.tap-indicator');

if (projectItems.length > 0) {
    let isMobile = window.innerWidth <= 768;
    let currentIndex = 0;

    let touchStartY = 0;
    let touchEndY = 0;

    // --- FONCTION DE MISE À JOUR UNIQUE ---
    function updateActiveProject(index) {
        if (index < 0 || index >= projectItems.length) return;

        currentIndex = index;

        projectItems.forEach((item, i) => {
            item.classList.toggle('active', i === currentIndex);
        });

        backgroundImages.forEach((img, i) => {
            img.classList.toggle('active', i === currentIndex);
        });
    }

    // --- LOGIQUE SWIPE (Mobile uniquement) ---
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartY - touchEndY;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                const next = (currentIndex + 1) % projectItems.length;
                updateActiveProject(next);
            } else {
                const prev = (currentIndex - 1 + projectItems.length) % projectItems.length;
                updateActiveProject(prev);
            }
        }
    }

    // --- INITIALISATION MOBILE ---
    function initMobile() {
        updateActiveProject(0);

        // 
        if (tapIndicator) tapIndicator.style.display = 'none';

        document.addEventListener('touchstart', (e) => {
            touchStartY = e.touches[0].clientY;
        }, { passive: true });

        document.addEventListener('touchend', (e) => {
            touchEndY = e.changedTouches[0].clientY;
            handleSwipe();
        }, { passive: true });

        // Clic sur l'image de fond -> aller vers le projet actif
        if (rightSection) {
            rightSection.addEventListener('click', () => {
                const activeItem = projectItems[currentIndex];
                const link = activeItem.querySelector('a');
                if (link) {
                    window.location.href = link.getAttribute('href');
                }
            });
        }
    }

    // --- INITIALISATION DESKTOP ---
    // 
    function initDesktop() {
        projectItems.forEach(item => {
            item.addEventListener('mouseenter', function () {
                const index = parseInt(this.getAttribute('data-index'));
                updateActiveProject(index);
            });
        });

        if (leftSection) {
            leftSection.addEventListener('mouseleave', () => {
                updateActiveProject(0);
            });
        }
    }

    // --- GESTION DU RESIZE ---
    function handleResize() {
        const wasMobile = isMobile;
        isMobile = window.innerWidth <= 768;

        if (wasMobile !== isMobile) {
            location.reload();
        }
    }

    // --- LANCEMENT ---
    if (isMobile) {
        initMobile();
    } else {
        initDesktop();
    }

    window.addEventListener('resize', handleResize);
}

// ═══════════════════════════════════════════════════════
// PLAYER YOUTUBE SIMPLE AVEC PREVIEW
// ═══════════════════════════════════════════════════════

const videoContainer = document.getElementById('youtube-player');

if (videoContainer) {
    var tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    let player;
    let isPlayerReady = false;

    const videoPreview = document.querySelector(".video-preview");
    const videoId = videoContainer.getAttribute('data-video-id');

    window.onYouTubeIframeAPIReady = function () {
        if (!videoId) {
            console.error('Aucun ID vidéo trouvé !');
            return;
        }

        player = new YT.Player('youtube-player', {
            height: '100%',
            width: '100%',
            videoId: videoId,
            playerVars: {
                'controls': 1,
                'modestbranding': 1,
                'rel': 0,
                'showinfo': 0,
                'playsinline': 1,
                'fs': 1
            },
            events: {
                'onReady': onPlayerReady
            }
        });
    }

    function onPlayerReady() {
        isPlayerReady = true;
        console.log('Player YouTube prêt avec la vidéo:', videoId);
    }

    if (videoPreview) {
        videoPreview.addEventListener('click', () => {
            if (!isPlayerReady) {
                console.log('Player pas encore prêt...');
                return;
            }

            videoPreview.classList.add('hidden');

            setTimeout(() => {
                videoPreview.style.display = 'none';
            }, 1500);

            player.playVideo();
        });
    }
}