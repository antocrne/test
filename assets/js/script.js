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
        if (tapIndicator);

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

const videoElements = document.querySelectorAll('.youtube-player');
 
if (videoElements.length > 0) {
 
    // Charge l'API YouTube une seule fois
    var tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
 
    // On stocke les infos de chaque vidéo dans un tableau
    // pour pouvoir les initialiser quand l'API sera prête
    const videosData = [];
 
    videoElements.forEach((el, i) => {
        const videoId = el.getAttribute('data-video-id');
        if (!videoId) return;
 
        // Donne un id unique à chaque élément si il n'en a pas
        if (!el.id) el.id = 'youtube-player-' + i;
 
        // Récupère la preview juste au-dessus dans le même .player
        const preview = el.closest('.player')?.querySelector('.video-preview');
 
        videosData.push({ el, videoId, preview, player: null, ready: false });
    });
 
    // L'API appelle cette fonction quand elle est chargée
    window.onYouTubeIframeAPIReady = function () {
        videosData.forEach((data, i) => {
            data.player = new YT.Player(data.el.id, {
                height: '100%',
                width: '100%',
                videoId: data.videoId,
                playerVars: {
                    'controls': 1,
                    'modestbranding': 1,
                    'rel': 0,
                    'showinfo': 0,
                    'playsinline': 1,
                    'fs': 1
                },
                events: {
                    'onReady': () => {
                        data.ready = true;
                        console.log('Player', i, 'prêt — vidéo:', data.videoId);
                    }
                }
            });
 
            // Branche le clic sur la preview de CETTE vidéo
            if (data.preview) {
                data.preview.addEventListener('click', () => {
                    if (!data.ready) return;
 
                    data.preview.classList.add('hidden');
                    setTimeout(() => {
                        data.preview.style.display = 'none';
                    }, 1500);
 
                    data.player.playVideo();
                });
            }
        });
    };
}
 