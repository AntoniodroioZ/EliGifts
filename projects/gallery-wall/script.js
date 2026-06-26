document.addEventListener('DOMContentLoaded', () => {
    // 1. Configuración de la Galería y Viewport
    const canvas = document.getElementById('canvas-wall');
    const viewport = document.getElementById('viewport');
    
    // Tamaño lógico del canvas infinito (20000x20000 px)
    const CANVAS_SIZE = 20000;
    
    // Centrar el canvas inicialmente
    let currentX = -(CANVAS_SIZE / 2 - window.innerWidth / 2);
    let currentY = -(CANVAS_SIZE / 2 - window.innerHeight / 2);
    canvas.style.transform = `translate(${currentX}px, ${currentY}px)`;

    // 2. Lógica de Panning (Arrastrar)
    let isDragging = false;
    let hasDragged = false;
    let startX, startY;

    // Ratón
    viewport.addEventListener('mousedown', (e) => {
        isDragging = true;
        hasDragged = false;
        startX = e.clientX - currentX;
        startY = e.clientY - currentY;
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        hasDragged = true;
        currentX = e.clientX - startX;
        currentY = e.clientY - startY;
        canvas.style.transform = `translate(${currentX}px, ${currentY}px)`;
    });

    window.addEventListener('mouseup', () => {
        isDragging = false;
    });

    // Touch / Móvil
    viewport.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1) {
            isDragging = true;
            hasDragged = false;
            startX = e.touches[0].clientX - currentX;
            startY = e.touches[0].clientY - currentY;
        }
    });

    window.addEventListener('touchmove', (e) => {
        if (!isDragging || e.touches.length !== 1) return;
        hasDragged = true;
        currentX = e.touches[0].clientX - startX;
        currentY = e.touches[0].clientY - startY;
        canvas.style.transform = `translate(${currentX}px, ${currentY}px)`;
    }, { passive: false });

    window.addEventListener('touchend', () => {
        isDragging = false;
        setTimeout(() => hasDragged = false, 50);
    });

    // 3. Modal Lightbox (Lógica y Funciones)
    const modal = document.getElementById('modal');
    const modalImage = document.getElementById('modal-image');
    const closeModalBtn = document.getElementById('close-modal');
    const modalBackdrop = document.getElementById('modal-backdrop');

    function openModal(imageUrl) {
        modalImage.src = imageUrl;
        modal.classList.remove('hidden');
    }

    function closeModal() {
        modal.classList.add('hidden');
        setTimeout(() => { modalImage.src = ''; }, 400);
    }

    closeModalBtn.addEventListener('click', closeModal);
    modalBackdrop.addEventListener('click', closeModal);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
            closeModal();
        }
    });

    // 4. Fetching Dinámico desde Cloudinary (Reemplazando Picsum)
    const cloudName = 'dmhrscavh';
    const tag = 'fotos-eli';
    const listUrl = `https://res.cloudinary.com/${cloudName}/image/list/${tag}.json`;

    async function cargarFotosGaleria() {
        try {
            const response = await fetch(listUrl);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            
            const data = await response.json();

            // Transformamos los datos de Cloudinary al formato que necesita nuestra pared infinita
            const fotosArray = data.resources.map((img, i) => {
                const version = img.version;
                const publicId = img.public_id;
                const extension = img.format;
                
                // Calculamos tamaño aleatorio manteniendo lo asimétrico
                const isLandscape = Math.random() > 0.5;
                const base = 250 + Math.random() * 200;
                const w = Math.floor(isLandscape ? base * 1.3 : base);
                const h = Math.floor(isLandscape ? base : base * 1.3);

                return {
                    id: i + 1,
                    // URL original en alta calidad
                    url: `https://res.cloudinary.com/${cloudName}/image/upload/v${version}/${publicId}.${extension}`,
                    // URL optimizada (crop y resize dinámico)
                    thumb: `https://res.cloudinary.com/${cloudName}/image/upload/c_fill,w_${w},h_${h}/v${version}/${publicId}.${extension}`,
                    width: w,
                    height: h
                };
            });
            
            console.log("¡Fotos de Cloudinary cargadas con éxito!", fotosArray);
            renderizarParedClasica(fotosArray);

        } catch (error) {
            console.error('Error al cargar la galería desde Cloudinary:', error);
            // Podrías poner aquí un arreglo de fallback si falla Cloudinary
        }
    }

    // 5. Algoritmo Procedural de la Pared Infinita
    function renderizarParedClasica(fotosArray) {
        const frameClasses = ['frame-gold', 'frame-wood', 'frame-silver', 'frame-oval'];
        const placedBoxes = [];
        const PADDING = 60; // Espaciado entre cuadros

        fotosArray.forEach((foto, index) => {
            const frameWrapper = document.createElement('div');
            frameWrapper.classList.add('picture-frame-wrapper');
            
            // Asignar un marco vintage al azar
            const randomFrame = frameClasses[Math.floor(Math.random() * frameClasses.length)];
            frameWrapper.classList.add(randomFrame);

            frameWrapper.style.width = `${foto.width}px`;
            frameWrapper.style.height = `${foto.height}px`;

            // Rotación sutil
            const randomRotation = (Math.random() * 8) - 4;
            frameWrapper.style.transform = `rotate(${randomRotation}deg)`;
            
            // Interactividad hover
            frameWrapper.addEventListener('mouseenter', () => {
                frameWrapper.style.transform = `scale(1.05) translateY(-5px) rotate(${randomRotation}deg)`;
            });
            frameWrapper.addEventListener('mouseleave', () => {
                frameWrapper.style.transform = `rotate(${randomRotation}deg)`;
            });

            // Imagen interior
            const img = document.createElement('img');
            img.src = foto.thumb;
            img.alt = `Cuadro recuerdo ${foto.id}`;
            img.classList.add('picture-img');
            
            // Para el marco ovalado, bordes redondos a la foto
            if(randomFrame === 'frame-oval') {
                img.style.borderRadius = "50%";
            }

            frameWrapper.appendChild(img);

            // Algoritmo en Espiral
            let angle = 0;
            let radius = index === 0 ? 0 : 50; 
            let placed = false;
            
            const centerX = CANVAS_SIZE / 2;
            const centerY = CANVAS_SIZE / 2;

            while (!placed) {
                const x = centerX + Math.cos(angle) * radius - (foto.width / 2);
                const y = centerY + Math.sin(angle) * radius - (foto.height / 2);

                const box = {
                    left: x - PADDING,
                    top: y - PADDING,
                    right: x + foto.width + PADDING,
                    bottom: y + foto.height + PADDING
                };

                // Detección de colisión simple con AABB
                let hasCollision = false;
                for (let i = 0; i < placedBoxes.length; i++) {
                    const p = placedBoxes[i];
                    if (!(box.right < p.left || box.left > p.right || box.bottom < p.top || box.top > p.bottom)) {
                        hasCollision = true;
                        break;
                    }
                }

                if (!hasCollision) {
                    placedBoxes.push({ left: x, top: y, right: x + foto.width, bottom: y + foto.height });
                    frameWrapper.style.left = `${x}px`;
                    frameWrapper.style.top = `${y}px`;
                    placed = true;
                } else {
                    angle += 0.5;
                    radius += 8;
                }
            }

            // Integración Lightbox
            frameWrapper.addEventListener('click', (e) => {
                if (hasDragged) return;
                e.preventDefault();
                openModal(foto.url);
            });

            canvas.appendChild(frameWrapper);
        });
    }

    // Iniciamos la secuencia de carga
    cargarFotosGaleria();
});
