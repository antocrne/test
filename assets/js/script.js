// Récupérer tous les éléments
const titleItems = document.querySelectorAll('.title-item');
const backgrounds = document.querySelectorAll('.background');

// Détection mobile
const isMobile = window.innerWidth <= 768;

if (isMobile) {
    // === MOBILE: Slider avec swipe et pagination ===
    
    let currentSlide = 0;
    const totalSlides = titleItems.length; // Compte automatiquement le nombre de slides
    let touchStartY = 0;
    let touchEndY = 0;
    let isAnimating = false;

    // Créer la pagination avec numéros (vertical)
    const pagination = document.createElement('div');
    pagination.className = 'pagination';
    pagination.innerHTML = `
        <span class="current">${currentSlide + 1}</span>
        <span class="separator"></span>
        <span class="total">${totalSlides}</span>
    `;
    document.body.appendChild(pagination);

    // Fonction pour changer de slide
    function goToSlide(index) {
        if (isAnimating || index < 0 || index >= totalSlides) return;
        
        isAnimating = true;
        currentSlide = index;

        // Retirer la classe active de toutes les slides
        titleItems.forEach(item => {
            item.classList.remove('active-slide');
        });

        // Ajouter la classe active à la slide courante
        titleItems[currentSlide].classList.add('active-slide');

        // Mettre à jour la pagination
        pagination.querySelector('.current').textContent = currentSlide + 1;

        // Permettre la prochaine animation après un délai
        setTimeout(() => {
            isAnimating = false;
        }, 600);
    }

    // Initialiser la première slide
    goToSlide(0);

    // Gestion du touch/swipe
    document.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
    });

    document.addEventListener('touchend', (e) => {
        touchEndY = e.changedTouches[0].clientY;
        handleSwipe();
    });

    function handleSwipe() {
        const swipeThreshold = 50; // Distance minimale pour déclencher le swipe
        const diff = touchStartY - touchEndY;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe vers le haut = slide suivante
                goToSlide(currentSlide + 1);
            } else {
                // Swipe vers le bas = slide précédente
                goToSlide(currentSlide - 1);
            }
        }
    }

    // Gestion du scroll avec la molette (pour desktop en mode mobile)
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
    
    // Fonction pour changer l'image de fond
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

        // Mettre à jour la classe active sur les titres
        titleItems.forEach(item => {
            if (item.getAttribute('data-bg') === bgId) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    // Ajouter les événements de survol
    titleItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            const bgId = this.getAttribute('data-bg');
            changeBackground(bgId);
        });
    });
}

// Réinitialiser au resize
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        location.reload();
    }, 250);
});