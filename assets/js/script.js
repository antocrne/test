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

// ======================================================
// I18N — LANGUAGE SWITCHER (FR / EN)
// ======================================================

const translations = {
    fr: {
        nav_work: "Projets",
        nav_info: "Info",
        cat_branding: "(Branding)",
        cat_lifestyle: "(Lifestyle & Branding)",
        cat_events: "(Photographie événementielle)",
        cat_sport: "(Sport)",
        cat_food: "(Food & Événements)",
        info_txt1: "Je suis Steven Roussel, photographe et réalisateur indépendant basé (la plupart du temps 🌍) à Paris, France 🇫🇷. Parfois créateur de contenu, gestionnaire de réseaux sociaux ou monteur… J'ai forgé mes compétences avec une passion pour le storytelling visuel, combinant différents médiums pour créer des récits captivants.",
        info_txt2: "Du lifestyle aux paysages en passant par le sport, je vous invite à découvrir mon univers et sa polyvalence ➡️ <a href=\"index.html\" class=\"a-link\">quelques projets.</a>",
        info_txt3: "Je serai ravi d'échanger autour d'un café sur votre prochaine idée et projet. ☕",
        panasonic_desc: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Iste dolorem ea ipsam vero officia, facere sapiente. Rem enim alias impedit praesentium ex veritatis. Id aliquid in accusamus nisi. Praesentium, vitae?",
        label_client: "Client :",
        label_type: "Type :",
        label_stills: "Stills",
        macif_desc: "Le programme Skipper Macif, initié par Macif en 2008, est une initiative sportive innovante axée sur le monde de la course au large. Depuis 2021, je suis les skippers Macif tout au long de leurs engagements, en créant du contenu visuel authentique — photos et vidéos — autour de leurs courses.",
        macif_type: "Sport",
        macif_client: "Agence disobey. - Macif",
        macif_stills_desc: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nobis repellendus, iste voluptas id corporis non nulla mollitia perferendis tenetur assumenda molestiae itaque! Quas natus error architecto, deleniti alias magni assumenda!",
        macif_subtitle: "Skipper Macif — Solitaire du Figaro",
        dune_desc: "Christopher Ward est une marque britannique qui propose des montres automatiques de haute qualité, fabriquées en Suisse. Pour promouvoir le lancement de la série C65 Dune, nous avons collaboré avec Maxime Horlaville pour produire une série de vidéos et de photos mettant les montres en situation.",
        dune_type: "Lifestyle & Branding",
        dune_client: "Christopher Ward",
        dune_about_title: "À propos de C65 Dune",
        dune_about_desc: "Cette nouvelle collection de Christopher Ward est plus qu'un simple nom de code. Elle s'inspire de la région Aquitaine et de la Dune du Pilat, la plus grande dune de sable d'Europe. Nous avons passé quatre jours à explorer la dune et à capturer des photos et vidéos. Ce qui a commencé comme une mission s'est rapidement transformé en aventure pour toute l'équipe, avec beaucoup de fous rires en chemin.",
        nantais_desc: "Imaginez votre pause déjeuner avec vue, entouré de tables de pique-nique au bord d'un lac, un après-work animé par des jeux en plein air et un marché mettant en avant des créateurs locaux avec de la musique live… Bienvenue aux « Nantais » ! <br><br>Maxime Horlaville et moi assurons la création de photos et vidéos autour de la guinguette. Partager la programmation, mettre en avant l'ambiance conviviale et détendue des événements sur les réseaux sociaux… Alexandre et Romain nous font confiance depuis 2022.",
        nantais_type: "Food & Événements",
        nantais_client: "Les Nantais",
        nantais_food_title: "« Food, drinks, marchés, jeux »",
        nantais_food_desc: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Non vero ipsa debitis eveniet distinctio voluptatum ad in unde nostrum facere. Cumque, dolores possimus. Quam dicta vel quae tenetur, officiis molestias?",
        nantais_slip_title: "Le Slipfest",
        nantais_slip_desc: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Non vero ipsa debitis eveniet distinctio voluptatum ad in unde nostrum facere. Cumque, dolores possimus. Quam dicta vel quae tenetur, officiis molestias?",
        camara_desc: "Camara est une enseigne française reconnue pour son expertise dans le domaine de la photo et de la vidéo. Avec un réseau de magasins répartis sur tout le territoire, Camara se positionne comme un spécialiste incontournable pour les passionnés d'image et les professionnels en France. <br><br>Depuis 2023, je collabore avec la coopérative pour créer du contenu authentique et inspirant. Que ce soit pour des packshots, des tests de produits ou la couverture de lancements, cette collaboration me permet de m'immerger au cœur des innovations du monde audiovisuel.",
        camara_type: "Vidéo promotionnelle",
        camara_client: "Camara France",
        camara_canon_title: "Canon R6 Mark III",
        camara_canon_desc: "Pour célébrer le lancement du nouveau Canon R6 Mark III, Camara France a demandé à Maxime Horlaville et moi de mettre cet appareil révolutionnaire à l'épreuve. J'ai eu l'opportunité de collaborer à ce projet, contribuant ainsi à mettre en valeur les capacités exceptionnelles de ce dispositif de pointe.",
        camara_fuji_title: "FUJIFILM GFX100RF",
        camara_fuji_desc: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Non vero ipsa debitis eveniet distinctio voluptatum ad in unde nostrum facere. Cumque, dolores possimus. Quam dicta vel quae tenetur, officiis molestias?",
        info_role: "Photographe & Réalisateur",
        tag_photo: "Photographie",
        tag_video: "Vidéo",
        tag_da: "Direction artistique",
        tag_stock: "Stock media",
        tag_coffee: "Coffee addict",
        gear_title: "Matériel utilisé",
        gear_main: "Boîtier principal",
        gear_video: "Vidéo / low-light",
        gear_signature: "Objectif signature",
        gear_portrait: "Portrait & lifestyle",
        gear_versatile: "Polyvalent",
        gear_stab: "Stabilisation & son"
    },
    en: {
        nav_work: "Work",
        nav_info: "Info",
        cat_branding: "(Branding)",
        cat_lifestyle: "(Lifestyle & Branding)",
        cat_events: "(Events Photography)",
        cat_sport: "(Sport)",
        cat_food: "(Food & Events)",
        info_txt1: "I'm Steven Roussel, an independent photographer and filmmaker based (most of the time 🌍) in Paris, France 🇫🇷. Sometimes content creator, social media manager or editor… I crafted my skills with a passion for visual storytelling as a multitool combining different mediums to create compelling narratives.",
        info_txt2: "From lifestyle to landscapes with a pit stop in sports, I invite you to discover my world and its versatility ➡️ <a href=\"index.html\" class=\"a-link\">some projects.</a>",
        info_txt3: "I'll be happy to chat over coffee about your next idea and project. ☕",
        panasonic_desc: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Iste dolorem ea ipsam vero officia, facere sapiente. Rem enim alias impedit praesentium ex veritatis. Id aliquid in accusamus nisi. Praesentium, vitae?",
        label_client: "Client:",
        label_type: "Type:",
        label_stills: "Stills",
        macif_desc: "The Skipper Macif program initiated by Macif in 2008, is an innovative sports initiative focused on the world of offshore racing. Since 2021, I have been following the Macif skippers throughout their engagements, curating authentic visual content such as photos and videos around their races.",
        macif_type: "Sport",
        macif_client: "Agence disobey. - Macif",
        macif_stills_desc: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nobis repellendus, iste voluptas id corporis non nulla mollitia perferendis tenetur assumenda molestiae itaque! Quas natus error architecto, deleniti alias magni assumenda!",
        macif_subtitle: "Skipper Macif — Solitaire du Figaro",
        dune_desc: "Christopher Ward is a British brand that offers high-quality, Swiss-made automatic watches to its customers. To promote the launch of the C65 Dune series, we collaborated with Maxime Horlaville to produce a series of videos and photos showcasing the watches in action.",
        dune_type: "Lifestyle & Branding",
        dune_client: "Christopher Ward",
        dune_about_title: "About C65 Dune",
        dune_about_desc: "This new watch collection from Christopher Ward is more than just a code name. It is inspired by the Aquitaine region and the Dune du Pilat, the largest sand dune in Europe. We spent four days exploring the dune and capturing stills and videos. What started as an assignment quickly turned into an adventure for the entire crew, and we shared many laughs along the way.",
        nantais_desc: "Imagine your lunch break with a view, surrounded by picnic tables around a lake, an afterwork gathering with outdoor games and a market featuring local creators with live music… Welcome to \"Les Nantais\"! <br><br>Maxime Horlaville and I provide and create photos and videos around the guinguette. Share the planning, showcase the fun and relaxed atmosphere of events on social media… Alexandre and Romain have trusted us since 2022.",
        nantais_type: "Food & Events",
        nantais_client: "Les Nantais",
        nantais_food_title: "\"Food, drinks, marchés, jeux\"",
        nantais_food_desc: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Non vero ipsa debitis eveniet distinctio voluptatum ad in unde nostrum facere. Cumque, dolores possimus. Quam dicta vel quae tenetur, officiis molestias?",
        nantais_slip_title: "Le Slipfest",
        nantais_slip_desc: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Non vero ipsa debitis eveniet distinctio voluptatum ad in unde nostrum facere. Cumque, dolores possimus. Quam dicta vel quae tenetur, officiis molestias?",
        camara_desc: "Camara is a French brand recognized for its expertise in the field of photography and video. With a network of stores spread across the country, Camara positions itself as an essential specialist for image enthusiasts and professionals in France. <br><br>Since 2023, I have been helping the cooperative create authentic and inspiring content. Whether it's for packshots, product testing, or covering launches, this collaboration allows me to immerse myself in the heart of audiovisual world innovations and individual practices.",
        camara_type: "Promotional Video",
        camara_client: "Camara France",
        camara_canon_title: "Canon R6 Mark III",
        camara_canon_desc: "To celebrate the launch of the new Canon R6 Mark III, Camara France asked Maxime Horlaville and I to put this groundbreaking camera to the test. I had the opportunity to collaborate on this project, helping showcase the exceptional capabilities of this cutting-edge device.",
        camara_fuji_title: "FUJIFILM GFX100RF",
        camara_fuji_desc: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Non vero ipsa debitis eveniet distinctio voluptatum ad in unde nostrum facere. Cumque, dolores possimus. Quam dicta vel quae tenetur, officiis molestias?",
        info_role: "Photographer & Filmmaker",
        tag_photo: "Photography",
        tag_video: "Video",
        tag_da: "Art Direction",
        tag_stock: "Stock media",
        tag_coffee: "Coffee addict",
        gear_title: "Equipment used",
        gear_main: "Main body",
        gear_video: "Video / low-light",
        gear_signature: "Signature lens",
        gear_portrait: "Portrait & lifestyle",
        gear_versatile: "Versatile",
        gear_stab: "Stabilization & audio"
    }
};

function getLang() {
    return localStorage.getItem('lang') || 'fr';
}

function applyTranslations() {
    const lang = getLang();
    const t = translations[lang];

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (t[key]) el.innerHTML = t[key];
    });

    const btn = document.getElementById('lang-switcher');
    if (btn) btn.textContent = lang === 'fr' ? 'EN' : 'FR';

    document.documentElement.lang = lang;
}

const langBtn = document.getElementById('lang-switcher');
if (langBtn) {
    langBtn.addEventListener('click', () => {
        const newLang = getLang() === 'fr' ? 'en' : 'fr';
        localStorage.setItem('lang', newLang);
        applyTranslations();
    });
}

applyTranslations();

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
 