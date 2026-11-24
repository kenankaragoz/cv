document.addEventListener("DOMContentLoaded", () => {
    const header = document.getElementById("siteHeader");
    const menuTrigger = document.getElementById("menuTrigger");
    const mobileOverlay = document.getElementById("mobileOverlay");
    const mobileLinks = document.querySelectorAll(".mobile-link");
    const cursorGlow = document.getElementById("cursorGlow");

    // Scroll'da header arka planı
    const onScroll = () => {
        header.classList.toggle("scrolled", window.scrollY > 20);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    // Tam ekran mobil menü aç / kapat
    const toggleMenu = (forceClose = false) => {
        const isOpen = forceClose
            ? false
            : !mobileOverlay.classList.contains("open");

        mobileOverlay.classList.toggle("open", isOpen);
        menuTrigger.classList.toggle("open", isOpen);
        menuTrigger.setAttribute("aria-expanded", String(isOpen));
        mobileOverlay.setAttribute("aria-hidden", String(!isOpen));
        document.body.style.overflow = isOpen ? "hidden" : "";
    };

    menuTrigger.addEventListener("click", () => toggleMenu());
    mobileLinks.forEach((link) => {
        link.addEventListener("click", () => toggleMenu(true));
    });

    // Masaüstünde imleci takip eden hafif altın ışık
    if (cursorGlow && window.matchMedia("(pointer: fine)").matches) {
        window.addEventListener("mousemove", (e) => {
            cursorGlow.style.left = `${e.clientX}px`;
            cursorGlow.style.top = `${e.clientY}px`;
        });
    }

    // Tüm bölümler için ortak görünürlük (reveal) gözlemcisi
    const observer = new IntersectionObserver(
        (entries, obs) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    obs.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.12 }
    );

    document
        .querySelectorAll(".reveal, .reveal-clip")
        .forEach((el) => observer.observe(el));
    // Dil seviye çubuklarını ekrana gelince doldur
    const langBars = document.querySelectorAll(".lang-fill");
    const langObserver = new IntersectionObserver(
        (entries, obs) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const targetWidth = entry.target.getAttribute("data-width");
                    entry.target.style.width = targetWidth;
                    obs.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.35 }
    );
    langBars.forEach((bar) => langObserver.observe(bar));

    // Scroll sırasında aktif menü linkini otomatik güncelle
    const sections = document.querySelectorAll("section[id]");
    const desktopLinks = document.querySelectorAll(".desktop-nav .nav-item");

    const updateActiveNav = () => {
        const scrollPos = window.scrollY + 140;
        sections.forEach((sec) => {
            const top = sec.offsetTop;
            const height = sec.offsetHeight;
            const id = sec.getAttribute("id");
            if (scrollPos >= top && scrollPos < top + height) {
                desktopLinks.forEach((link) => {
                    link.classList.toggle(
                        "active",
                        link.getAttribute("href") === `#${id}`
                    );
                });
            }
        });
    };
    window.addEventListener("scroll", updateActiveNav, { passive: true });
    // ===== 3. BÖLÜM: DENEYİM DETAY & HARİTA MODU =====
    const EXPERIENCES = {
        fides: {
            title: "Fides Restaurant Bodrum",
            location: "Bitez · Bodrum / Muğla",
            category: "Restoran & Beach",
            image: "images/fides.jpg",
            address: "Bitez Mahallesi, Çökertme Caddesi No:100, 48470 Bodrum / Muğla",
            mapQuery: "Fides Restaurant Bitez Bodrum Mugla",
            desc: "Bitez sahilinde deniz manzaralı restoran ve plaj konseptinde misafir ağırlama, servis akışı ve ekip koordinasyonu deneyimi."
        },
        adaburnu: {
            title: "Adaburnu Gölmar Beach Spa Datça",
            location: "Emecik · Datça / Muğla",
            category: "Otel & Resort",
            image: "images/adaburnu.jpg",
            address: "Emecik Mahallesi, Emecik Mevkii, 48900 Datça / Muğla",
            mapQuery: "Adaburnu Golmar Beach Hotel Datca Mugla",
            desc: "Datça Emecik koyunda yüksek kapasiteli otel ve yiyecek-içecek operasyonlarında misafir memnuniyeti odaklı hizmet tecrübesi."
        },
        "little-caesars": {
            title: "Little Caesars Pizza",
            location: "Menteşe · Muğla",
            category: "Hızlı Servis & Zincir Restoran",
            image: "images/little-caesars.jpg",
            address: "Kötekli Mahallesi, 263. Sokak No:8A, Menteşe / Muğla",
            mapQuery: "Little Caesars Pizza Kotekli Mugla",
            desc: "Hızlı servis standartları, mutfak ve sipariş operasyonu, hijyen kuralları ve yoğun tempo yönetimi deneyimi."
        }
    };

    const expModal = document.getElementById("expModal");
    const expModalBackdrop = document.getElementById("expModalBackdrop");
    const expModalClose = document.getElementById("expModalClose");
    const expRows = document.querySelectorAll(".exp-row");

    const expModalTitle = document.getElementById("expModalTitle");
    const expModalLocation = document.getElementById("expModalLocation");
    const expModalCategory = document.getElementById("expModalCategory");
    const expModalImg = document.getElementById("expModalImg");
    const expModalDesc = document.getElementById("expModalDesc");
    const expModalAddress = document.getElementById("expModalAddress");
    const expModalMapFrame = document.getElementById("expModalMapFrame");
    const expModalExternalMap = document.getElementById("expModalExternalMap");

    const btnPhotoView = document.getElementById("btnPhotoView");
    const btnMapView = document.getElementById("btnMapView");
    const stagePhoto = document.getElementById("stagePhoto");
    const stageMap = document.getElementById("stageMap");
    const quickMapBtn = document.getElementById("quickMapBtn");
    const quickMapBtnText = document.getElementById("quickMapBtnText");

    let currentView = "photo";
    let currentMapQuery = "";

    const setModalView = (mode) => {
        currentView = mode;
        const isMap = mode === "map";

        stagePhoto.classList.toggle("active", !isMap);
        stageMap.classList.toggle("active", isMap);
        btnPhotoView.classList.toggle("active", !isMap);
        btnMapView.classList.toggle("active", isMap);
        btnPhotoView.setAttribute("aria-selected", String(!isMap));
        btnMapView.setAttribute("aria-selected", String(isMap));
        quickMapBtnText.textContent = isMap ? "Fotoğrafa Dön" : "Haritada Göster";

        // Haritayı yalnızca harita moduna geçince yükle (performans için)
        if (isMap && !expModalMapFrame.src.includes(encodeURIComponent(currentMapQuery))) {
            expModalMapFrame.src = `https://maps.google.com/maps?q=${encodeURIComponent(
                currentMapQuery
            )}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
        }
    };

    const openExpModal = (key) => {
        const item = EXPERIENCES[key];
        if (!item) return;

        expModalTitle.textContent = item.title;
        expModalLocation.textContent = item.location;
        expModalCategory.textContent = item.category;
        expModalImg.src = item.image;
        expModalImg.alt = item.title;
        expModalDesc.textContent = item.desc;
        expModalAddress.textContent = item.address;
        currentMapQuery = item.mapQuery;
        expModalMapFrame.src = "";
        expModalExternalMap.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
            item.mapQuery
        )}`;

        setModalView("photo");
        expModal.classList.add("open");
        expModal.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
    };

    const closeExpModal = () => {
        expModal.classList.remove("open");
        expModal.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
    };

    expRows.forEach((row) => {
        row.addEventListener("click", () => openExpModal(row.dataset.exp));
    });

    btnPhotoView.addEventListener("click", () => setModalView("photo"));
    btnMapView.addEventListener("click", () => setModalView("map"));
    quickMapBtn.addEventListener("click", () =>
        setModalView(currentView === "photo" ? "map" : "photo")
    );

    expModalClose.addEventListener("click", closeExpModal);
    expModalBackdrop.addEventListener("click", closeExpModal);
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && expModal.classList.contains("open")) {
            closeExpModal();
        }
    });
    // ===== 6. BÖLÜM: GALERİ SEKMELERİ & LIGHTBOX =====
    const galleryTabs = document.querySelectorAll(".gallery-tab");
    const panelPhotos = document.getElementById("panel-photos");
    const panelVideos = document.getElementById("panel-videos");

    galleryTabs.forEach((tab) => {
        tab.addEventListener("click", () => {
            const target = tab.dataset.tab;
            galleryTabs.forEach((t) => {
                const isActive = t === tab;
                t.classList.toggle("active", isActive);
                t.setAttribute("aria-selected", String(isActive));
            });
            panelPhotos.classList.toggle("active", target === "photos");
            panelVideos.classList.toggle("active", target === "videos");
        });
    });

    // Lightbox (Fotoğraf + Video)
    const lightbox = document.getElementById("lightbox");
    const lightboxBackdrop = document.getElementById("lightboxBackdrop");
    const lbClose = document.getElementById("lbClose");
    const lbPrev = document.getElementById("lbPrev");
    const lbNext = document.getElementById("lbNext");
    const lbImage = document.getElementById("lbImage");
    const lbVideo = document.getElementById("lbVideo");

    let activeTiles = [];
    let activeIndex = 0;

    const renderLightboxItem = () => {
        const tile = activeTiles[activeIndex];
        if (!tile) return;

        const type = tile.dataset.type;
        const src = tile.dataset.src;

        lbVideo.pause();
        lbVideo.removeAttribute("src");
        lbVideo.load();

        if (type === "video") {
            lbImage.classList.remove("active");
            lbVideo.classList.add("active");
            lbVideo.src = src;
            lbVideo.play().catch(() => { });
        } else {
            lbVideo.classList.remove("active");
            lbImage.classList.add("active");
            lbImage.src = src;
        }
    };

    const openLightbox = (tiles, index) => {
        activeTiles = Array.from(tiles);
        activeIndex = index;
        renderLightboxItem();
        lightbox.classList.add("open");
        lightbox.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
    };

    const closeLightbox = () => {
        lbVideo.pause();
        lbVideo.removeAttribute("src");
        lbVideo.load();
        lightbox.classList.remove("open");
        lightbox.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
    };

    const stepLightbox = (dir) => {
        if (!activeTiles.length) return;
        activeIndex = (activeIndex + dir + activeTiles.length) % activeTiles.length;
        renderLightboxItem();
    };

    const photoTiles = document.querySelectorAll("#panel-photos .media-tile");
    const videoTiles = document.querySelectorAll("#panel-videos .media-tile");

    photoTiles.forEach((tile, i) => {
        tile.addEventListener("click", () => openLightbox(photoTiles, i));
    });

    videoTiles.forEach((tile, i) => {
        tile.addEventListener("click", () => openLightbox(videoTiles, i));
    });

    lbClose.addEventListener("click", closeLightbox);
    lightboxBackdrop.addEventListener("click", closeLightbox);
    lbPrev.addEventListener("click", () => stepLightbox(-1));
    lbNext.addEventListener("click", () => stepLightbox(1));

    document.addEventListener("keydown", (e) => {
        if (!lightbox.classList.contains("open")) return;
        if (e.key === "Escape") closeLightbox();
        if (e.key === "ArrowLeft") stepLightbox(-1);
        if (e.key === "ArrowRight") stepLightbox(1);
    });
});