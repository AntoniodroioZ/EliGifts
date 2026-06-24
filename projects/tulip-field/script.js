document.addEventListener('DOMContentLoaded', () => {
    // Create celestial bodies
    const sun = document.createElement('div');
    sun.className = 'celestial sun';
    const moon = document.createElement('div');
    moon.className = 'celestial moon';
    const sky = document.querySelector('.sky');
    if (sky) {
        sky.appendChild(sun);
        sky.appendChild(moon);
    }

    // Determine time of day for sky theme and celestial bodies
    function updateSky(hour) {
        document.body.classList.remove('morning', 'day', 'sunset', 'night');
        let timeClass = 'day';
        if (hour >= 6 && hour < 10) timeClass = 'morning';
        else if (hour >= 10 && hour < 17) timeClass = 'day';
        else if (hour >= 17 && hour < 20) timeClass = 'sunset';
        else timeClass = 'night';
        document.body.classList.add(timeClass);

        // Update Sun position (active 6 to 18)
        if (hour >= 6 && hour <= 18) {
            const progress = (hour - 6) / 12; // 0 to 1
            sun.style.left = `calc(${progress * 100}vw - 40px)`;
            sun.style.top = `calc(${10 + Math.pow(progress - 0.5, 2) * 4 * 50}vh - 40px)`;
            sun.style.opacity = 1;
        } else {
            sun.style.opacity = 0;
            // hide it off screen so it doesn't block clicks just in case
            sun.style.top = `100vh`; 
        }

        // Update Moon position (active 18 to 6)
        if (hour >= 18 || hour <= 6) {
            let progress;
            if (hour >= 18) progress = (hour - 18) / 12;
            else progress = (hour + 6) / 12;
            
            moon.style.left = `calc(${progress * 100}vw - 30px)`;
            moon.style.top = `calc(${10 + Math.pow(progress - 0.5, 2) * 4 * 50}vh - 30px)`;
            moon.style.opacity = 1;
        } else {
            moon.style.opacity = 0;
            moon.style.top = `100vh`;
        }
    }

    const currentHour = new Date().getHours();
    updateSky(currentHour);

    const hourSlider = document.getElementById('hour-slider');
    const hourDisplay = document.getElementById('hour-display');

    if (hourSlider && hourDisplay) {
        hourSlider.value = currentHour;
        hourDisplay.innerText = `${currentHour.toString().padStart(2, '0')}:00`;

        hourSlider.addEventListener('input', (e) => {
            const h = parseInt(e.target.value);
            hourDisplay.innerText = `${h.toString().padStart(2, '0')}:00`;
            updateSky(h);
        });
    }

    const ground = document.getElementById('ground');
    
    // Dynamic number of tulips based on screen width
    const isMobile = window.innerWidth <= 768;
    const numberOfTulips = isMobile ? 26 : 52; 

    // Generate stars for the night sky
    const starsContainer = document.createElement('div');
    starsContainer.className = 'stars-container';
    for (let i = 0; i < 80; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = `${Math.random() * 100}vw`;
        star.style.top = `${Math.random() * 60}vh`; // Solo en la parte superior (cielo)
        star.style.animationDelay = `${Math.random() * 3}s`;
        starsContainer.appendChild(star);
    }
    for (let i = 0; i < 4; i++) {
        const sStar = document.createElement('div');
        sStar.className = 'shooting-star';
        sStar.style.left = `${20 + Math.random() * 80}vw`;
        sStar.style.top = `${Math.random() * 20}vh`;
        sStar.style.animationDelay = `${Math.random() * 15}s`;
        starsContainer.appendChild(sStar);
    }

    if (sky) sky.appendChild(starsContainer);

    // Vibrant tulip colors
    const colorPalettes = [
        { dark: '#ff1493', light: '#ff69b4' }, // Pink
        { dark: '#d32f2f', light: '#f44336' }, // Red
        { dark: '#ff8f00', light: '#ffb300' }, // Yellow-Orange
        { dark: '#7b1fa2', light: '#ba68c8' }, // Purple
        { dark: '#c2185b', light: '#e91e63' }, // Magenta
        { dark: '#fbc12d', light: '#fbc12d' }, // Yellow
        { dark: '#f57c00', light: '#ff9800' }  // Orange
    ];

    function createTulip() {
        const tulip = document.createElement('div');
        tulip.className = 'tulip';

        // 1. Pick a random color
        const palette = colorPalettes[Math.floor(Math.random() * colorPalettes.length)];
        tulip.style.setProperty('--color-dark', palette.dark);
        tulip.style.setProperty('--color-light', palette.light);

        // 2. Determine position and depth
        // x-position (left): 5% to 95%
        const leftPos = 2 + Math.random() * 96; 
        tulip.style.left = `${leftPos}%`;

        // y-position (bottom) for depth: 0px to 80px above bottom of ground
        const bottomPos = Math.random() * 150; 
        tulip.style.bottom = `${bottomPos}px`;

        // z-index based on depth (higher bottom = further away = lower z-index)
        const zIndex = Math.floor(100 - bottomPos);
        tulip.style.zIndex = zIndex;

        // Scale based on depth (further away = smaller)
        const scale = 0.6 + ((80 - bottomPos) / 80) * 0.4; // Ranges from 0.6 to 1.0

        // Stem height: Random between 120 and 220
        const finalHeight = 120 + Math.random() * 100;

        // Base transform with scale
        tulip.style.transform = `scale(${scale})`;

        // Generate fireflies
        const numFireflies = 1 + Math.floor(Math.random() * 3);
        let fireflyHTML = '';
        for (let j = 0; j < numFireflies; j++) {
            const flyX = (Math.random() - 0.5) * 2; // -1 to 1
            const flyDelay = Math.random() * 3;
            fireflyHTML += `<div class="firefly" style="--fly-x: ${flyX}; animation-delay: ${flyDelay}s; left: ${20 + Math.random() * 20}px; top: ${20 + Math.random() * 20}px;"></div>`;
        }

        // Build HTML structure
        tulip.innerHTML = `
            <div class="stem"></div>
            <div class="leaf left"></div>
            <div class="leaf right"></div>
            <div class="flower">
                <div class="inner"></div>
                <div class="petal left"></div>
                <div class="petal middle"></div>
                <div class="petal right"></div>
                ${fireflyHTML}
            </div>
        `;

        ground.appendChild(tulip);

        // Animation timing
        const growthDelay = Math.random() * 2000; // 0 to 2 seconds
        const swayDelay = Math.random() * 5; // 0 to 5 seconds
        const swayDuration = 3 + Math.random() * 2; // 3 to 5 seconds

        // Start animations
        setTimeout(() => {
            tulip.style.height = `${finalHeight}px`;

            // Adjust leaf positions relative to stem
            const leaves = tulip.querySelectorAll('.leaf');
            leaves[0].classList.add('grow');
            leaves[1].classList.add('grow');

            setTimeout(() => {
                const flower = tulip.querySelector('.flower');
                flower.classList.add('bloom');
                
                // Add sway animation after blooming
                tulip.style.animation = `sway ${swayDuration}s ease-in-out infinite`;
                tulip.style.animationDelay = `-${swayDelay}s`; // Use negative delay to randomize start state
            }, 1000); // Bloom starts 1s after stem growth starts

        }, growthDelay);
    }

    // Generate field
    for (let i = 0; i < numberOfTulips; i++) {
        createTulip();
    }

    // --- Fireworks System ---
    function launchFirework() {
        const fw = document.createElement('div');
        fw.className = 'firework-container';
        
        // Position near center: 35% to 65% with slight deviation
        const startX = 35 + Math.random() * 30;
        fw.style.left = `${startX}vw`;
        
        const sky = document.querySelector('.sky');
        if (!sky) return;
        sky.appendChild(fw);
        
        // Trail
        const trail = document.createElement('div');
        trail.className = 'firework-trail';
        fw.appendChild(trail);
        
        // Flight path
        const flightHeight = 20 + Math.random() * 10; // upwards height
        const curve = (Math.random() - 0.5) * 20; // left/right deviation
        
        const flightAnim = fw.animate([
            { transform: `translate(0, 0)`, opacity: 1 },
            { transform: `translate(${curve}vw, -${flightHeight}vh)`, opacity: 1 }
        ], {
            duration: 1000 + Math.random() * 500,
            easing: 'ease-out',
            fill: 'forwards'
        });
        
        trail.animate([
            { transform: `rotate(${curve > 0 ? 15 : -15}deg)`, opacity: 1 },
            { transform: `rotate(${curve > 0 ? 15 : -15}deg)`, opacity: 0 }
        ], {
            duration: 1000 + Math.random() * 500,
            easing: 'ease-in',
            fill: 'forwards'
        });
        
        flightAnim.onfinish = () => {
            trail.remove();
            explodeFirework(fw);
        };
    }

    function explodeFirework(container) {
        const fireworkColors = ['#4caf50', '#ffeb3b', '#ff69b4']; // Verde, Amarillo, Rosa
        const fwColor = fireworkColors[Math.floor(Math.random() * fireworkColors.length)];
        const numParticles = 30 + Math.random() * 20;
        
        for (let i = 0; i < numParticles; i++) {
            const p = document.createElement('div');
            p.className = 'firework-particle';
            p.style.backgroundColor = fwColor;
            p.style.boxShadow = `0 0 6px ${fwColor}`;
            container.appendChild(p);
            
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 100 + 25; // radius expansion
            const destX = Math.cos(angle) * speed;
            const destY = Math.sin(angle) * speed;
            
            p.animate([
                { transform: 'translate(0,0) scale(1)', opacity: 1 },
                { transform: `translate(${destX}px, ${destY + 20}px) scale(0)`, opacity: 0 } 
            ], {
                duration: 800 + Math.random() * 4000,
                easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
                fill: 'forwards'
            });
        }
        
        setTimeout(() => container.remove(), 1500);
    }

    function scheduleFireworks() {
        const is28th = new Date().getDate() === 28;
        // Si es 28: cada 1 a 2 segundos. Si no: cada 1 a 5 segundos aprox.
        const delay = is28th ? (1000 + Math.random() * 1000) : (1000 + Math.random() * 4000);
        
        setTimeout(() => {
            if (document.body.classList.contains('night')) {
                // Si es 28: de 3 a 7 fuegos. Si no: de 1 a 4.
                const count = is28th 
                    ? (3 + Math.floor(Math.random() * 15)) 
                    : (1 + Math.floor(Math.random() * 6));

                for (let i = 0; i < count; i++) {
                    setTimeout(launchFirework, Math.random() * 800);
                }
            }
            scheduleFireworks();
        }, delay);
    }
    
    // Start firework loop
    scheduleFireworks();

    // --- Blimp System ---
    const blimpMessages = [
        "¡Tu eres el mejor regalo que la vida pudo darme! 🎁",
        "Pensando en ti... 💭",
        "Un campo entero solo para ti 🌷",
        "¡Sonríe, te ves hermosa! ✨",
        "Te quiero muchísimo ❤️",
        "Eres mi persona favorita 🌟",
        "Cada tulipán es un abrazo y beso para ti 🌷",
        "Haces mis días más felices ☀️"
    ];

    function spawnBlimp() {
        const sky = document.querySelector('.sky');
        if (!sky) return;

        const wrapper = document.createElement('div');
        wrapper.className = 'blimp-wrapper';
        
        // Randomize vertical position slightly
        wrapper.style.top = `${5 + Math.random() * 20}%`;

        const blimp = document.createElement('div');
        blimp.className = 'blimp';
        
        const tail = document.createElement('div');
        tail.className = 'blimp-tail';
        
        const cabin = document.createElement('div');
        cabin.className = 'blimp-cabin';

        blimp.appendChild(tail);
        blimp.appendChild(cabin);

        const ropes = document.createElement('div');
        ropes.className = 'blimp-ropes';

        const sign = document.createElement('div');
        sign.className = 'blimp-sign';
        // Select random message
        sign.textContent = blimpMessages[Math.floor(Math.random() * blimpMessages.length)];

        wrapper.appendChild(blimp);
        wrapper.appendChild(ropes);
        wrapper.appendChild(sign);

        sky.appendChild(wrapper);

        // Remove after animation completes (25s)
        setTimeout(() => wrapper.remove(), 26000);
    }

    function scheduleBlimp() {
        // Spawn every 40 to 60 seconds
        const delay = 40000 + Math.random() * 20000;
        setTimeout(() => {
            spawnBlimp();
            scheduleBlimp();
        }, delay);
    }

    // Spawn first blimp after 5 seconds
    setTimeout(spawnBlimp, 5000);
    scheduleBlimp();
});
