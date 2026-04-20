// ═══════════════════════════════════════════════════════
// HOMEPAGE - NAVIGATION PROJETS
// ═══════════════════════════════════════════════════════

const projectItems = document.querySelectorAll('.project-item');
const backgroundImages = document.querySelectorAll('.background-image');
const leftSection = document.querySelector('.left-section');
const rightSection = document.querySelector('.right-section');
const tapIndicator = document.querySelector('.tap-indicator');

// Si pas de projets, on arrête cette partie du script
if (projectItems.length > 0) {
    let isMobile = window.innerWidth <= 768;
    let currentIndex = 0;

    // Variables pour le swipe mobile
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
                // Swipe vers le haut -> Suivant
                const next = (currentIndex + 1) % projectItems.length;
                updateActiveProject(next);
            } else {
                // Swipe vers le bas -> Précédent
                const prev = (currentIndex - 1 + projectItems.length) % projectItems.length;
                updateActiveProject(prev);
            }
        }
    }

    // --- INITIALISATION MOBILE ---
function initMobile() {
    updateActiveProject(0);
    
    if (tapIndicator)

    // Écouteurs pour le swipe
    document.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
    }, { passive: true });

    document.addEventListener('touchend', (e) => {
        touchEndY = e.changedTouches[0].clientY;
        handleSwipe();
    }, { passive: true });

    // ✅ NOUVEAU : clic sur l'image de fond -> aller vers le projet actif
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

// Vérifier si on est sur une page avec vidéo
const videoContainer = document.getElementById('youtube-player');

if (videoContainer) {
    // Charger l'API YouTube
    var tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    let player;
    let isPlayerReady = false;

    const videoPreview = document.querySelector(".video-preview");
    const videoId = videoContainer.getAttribute('data-video-id');

    // Initialiser le player YouTube
    window.onYouTubeIframeAPIReady = function() {
        if (!videoId) {
            console.error('Aucun ID vidéo trouvé !');
            return;
        }
        
        player = new YT.Player('youtube-player', {
            height: '100%',
            width: '100%',
            videoId: videoId,
            playerVars: {
                'controls': 1,          // Contrôles YouTube natifs
                'modestbranding': 1,    // Réduit le branding YouTube
                'rel': 0,               // Pas de vidéos suggérées
                'showinfo': 0,          // Cache les infos
                'playsinline': 1,       // Lecture inline sur mobile
                'fs': 1                 // Fullscreen activé
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

    // Gestion du clic sur la preview
    if (videoPreview) {
        videoPreview.addEventListener('click', () => {
            if (!isPlayerReady) {
                console.log('Player pas encore prêt...');
                return;
            }
            
            // Cache la preview avec fondu
            videoPreview.classList.add('hidden');
            
            // Retire complètement après l'animation
            setTimeout(() => {
                videoPreview.style.display = 'none';
            }, 1500);
            
            // Lance la vidéo
            player.playVideo();
        });
    }
}