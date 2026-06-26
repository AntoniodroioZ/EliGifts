document.addEventListener("DOMContentLoaded", () => {
    // --- 1. Lógica del Modal de Bienvenida ---
    const modal = document.getElementById("welcome-modal");
    const startBtn = document.getElementById("start-btn");
    const mainHub = document.getElementById("main-hub");

    startBtn.addEventListener("click", () => {
        // Añadir clase para animar la salida
        modal.classList.add("fade-out");
        
        // Esperar a que termine la animación de salida para ocultar el modal y mostrar el hub
        setTimeout(() => {
            modal.classList.add("hidden");
            mainHub.classList.remove("hidden");
            mainHub.classList.add("fade-in");
        }, 600); 
    });

    // --- 2. Configuración de Fechas y Regalos ---
    // Usamos el año actual de la máquina (2026 en este entorno) 
    // Fecha final: 28 de Junio a las 00:00:00 hrs
    const currentYear = new Date().getFullYear();
    const mainDeadline = new Date(`${currentYear}-06-28T00:00:00`);

    // Array de 6 regalos (del 23 al 28 de junio)
    const gifts = [
        { id: 1, date: new Date(`${currentYear}-06-23T09:00:00`), title: "Fin de semana en Airbnb", link: "projects/airbnb-weekend/index.html" },
        { id: 2, date: new Date(`${currentYear}-06-24T09:00:00`), title: "Campo de tulipanes", link: "projects/tulip-field/index.html" },
        { id: 3, date: new Date(`${currentYear}-06-25T09:00:00`), title: "Rasca y descubre", link: "projects/tickets-spotify/index.html" },
        { id: 4, date: new Date(`${currentYear}-06-26T09:00:00`), title: "Tengamos una playlist", link: "projects/vinyl-player/index.html" },
        { id: 5, date: new Date(`${currentYear}-06-27T09:00:00`), title: "Pared de Galería", link: "projects/gallery-wall/index.html" },
        { id: 6, date: new Date(`${currentYear}-06-28T09:00:00`), title: "Cajitas de regalo", link: "projects/gift-boxes.html" }
    ];

    const grid = document.getElementById("gifts-grid");

    // --- 3. Generación Dinámica de los Post-its ---
    gifts.forEach((gift, index) => {
        const postIt = document.createElement("div");
        postIt.className = "post-it locked";
        postIt.id = `gift-${gift.id}`;
        
        // Rotación aleatoria para que parezcan pegados al azar (entre -4deg y 4deg)
        const rotation = (Math.random() * 8 - 4).toFixed(1);
        postIt.style.setProperty('--rotation', `${rotation}deg`);

        postIt.innerHTML = `
            <div class="pin">📌</div>
            <h3>Día ${index + 1}</h3>
            
            <div class="status-container" id="status-${gift.id}">
                <div class="lock-icon">🔒</div>
                <div class="mini-countdown" id="mini-countdown-${gift.id}">--:--:--</div>
            </div>
            
            <div class="unlocked-content hidden" id="unlocked-${gift.id}">
                <h4>${gift.title}</h4>
                <a href="${gift.link}" class="gift-btn">Abrir Regalo 🎁</a>
            </div>
        `;
        grid.appendChild(postIt);
    });

    // --- 4. Lógica de Contadores (setInterval) ---
    // Variables para el slider de tiempo (Dev Controls)
    const timeSlider = document.getElementById("time-slider");
    const timeDisplay = document.getElementById("time-display");
    const sliderStartDate = new Date(`${currentYear}-06-22T00:00:00`).getTime();

    function getCurrentDate() {
        if (timeSlider) {
            // El slider va de 0 a 604800 (segundos en 7 días)
            const simulatedTime = sliderStartDate + (parseInt(timeSlider.value) * 1000);
            const simDate = new Date(simulatedTime);
            if (timeDisplay) {
                timeDisplay.innerText = simDate.toLocaleString();
            }
            return simDate;
        }
        return new Date();
    }

    function updateCounters() {
        const now = getCurrentDate();

        // 4.1 Actualizar Contador Principal
        const diffMain = mainDeadline - now;
        const mainDisplay = document.getElementById("main-countdown");
        
        if (diffMain <= 0) {
            mainDisplay.innerHTML = "¡FELIZ CUMPLEAÑOS ELI! 🎉❤️";
            mainDisplay.style.color = "var(--primary)";
        } else {
            // Restaurar estructura original si se retrocede el tiempo
            if (!document.getElementById("days")) {
                mainDisplay.innerHTML = `
                    Faltan: 
                    <div class="time-block"><span id="days">00</span><small>días</small></div> :
                    <div class="time-block"><span id="hours">00</span><small>horas</small></div> :
                    <div class="time-block"><span id="minutes">00</span><small>minutos</small></div> :
                    <div class="time-block"><span id="seconds">00</span><small>segundos</small></div>
                    <div class="target-text">para tu cumpleaños</div>
                `;
                mainDisplay.style.color = "var(--text-dark)";
            }

            const d = Math.floor(diffMain / (1000 * 60 * 60 * 24));
            const h = Math.floor((diffMain / (1000 * 60 * 60)) % 24);
            const m = Math.floor((diffMain / 1000 / 60) % 60);
            const s = Math.floor((diffMain / 1000) % 60);
            
            document.getElementById("days").innerText = d.toString().padStart(2, '0');
            document.getElementById("hours").innerText = h.toString().padStart(2, '0');
            document.getElementById("minutes").innerText = m.toString().padStart(2, '0');
            document.getElementById("seconds").innerText = s.toString().padStart(2, '0');
        }

        // 4.2 Actualizar Mini-contadores Individuales
        gifts.forEach(gift => {
            const diffGift = gift.date - now;
            const postItEl = document.getElementById(`gift-${gift.id}`);
            const statusContainer = document.getElementById(`status-${gift.id}`);
            const unlockedContent = document.getElementById(`unlocked-${gift.id}`);
            const miniCountdown = document.getElementById(`mini-countdown-${gift.id}`);

            if (diffGift <= 0) {
                // El regalo ya está disponible (Estado Desbloqueado)
                if (postItEl.classList.contains("locked")) {
                    postItEl.classList.remove("locked");
                    postItEl.classList.add("unlocked");
                    
                    // Manipulación del DOM para intercambiar visibilidad
                    statusContainer.classList.add("hidden");
                    unlockedContent.classList.remove("hidden");
                }
            } else {
                // El regalo aún está bloqueado (Estado Bloqueado)
                if (postItEl.classList.contains("unlocked")) {
                    postItEl.classList.add("locked");
                    postItEl.classList.remove("unlocked");
                    
                    statusContainer.classList.remove("hidden");
                    unlockedContent.classList.add("hidden");
                }

                const d = Math.floor(diffGift / (1000 * 60 * 60 * 24));
                const h = Math.floor((diffGift / (1000 * 60 * 60)) % 24);
                const m = Math.floor((diffGift / 1000 / 60) % 60);
                const s = Math.floor((diffGift / 1000) % 60);
                
                let timeStr = "";
                if (d > 0) {
                    // Si falta más de un día, mostramos días y horas para no saturar
                    timeStr = `${d}d ${h.toString().padStart(2, '0')}h`;
                } else {
                    // Si falta menos de un día, mostramos horas, minutos y segundos
                    timeStr = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
                }
                miniCountdown.innerText = timeStr;
            }
        });
    }

    if (timeSlider) {
        timeSlider.addEventListener("input", updateCounters);
    }

    // Llamada inicial para evitar el retraso de 1 segundo
    updateCounters();
    
    // Iniciar el ciclo de actualización cada segundo
    setInterval(updateCounters, 1000);
});
