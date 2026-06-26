document.addEventListener('DOMContentLoaded', () => {
    // Array de premios
    let prizes = [
        "Una carta súper especial 💌",
        "Tus flores favoritas (Tulipanes) 🌷",
        "Caja de cartitas de Hello Kitty 🎀",
        "Una comidita cumpleañera 🍲"
    ];
    
    // Mezclar premios al inicio
    prizes = prizes.sort(() => Math.random() - 0.5);
    
    let currentPrizeIndex = 0;
    
    // Variables de estado del Clicker
    const CLICKS_REQUIRED = 10;
    let currentClicks = 0;
    let isClickable = false;
    
    // Elementos del DOM
    const girarBtn = document.getElementById('girarBtn');
    const machine = document.querySelector('.gachapon-machine');
    const capsule = document.getElementById('activeCapsule');
    const messageBox = document.getElementById('messageBox');
    const progressContainer = document.getElementById('progressContainer');
    const progressFill = document.getElementById('progressFill');
    const modal = document.getElementById('prizeModal');
    const prizeText = document.getElementById('prizeText');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const confettiContainer = document.getElementById('confettiContainer');
    const bgCapsules = document.querySelectorAll('.bg-capsule');
    
    // Función para girar la máquina
    girarBtn.addEventListener('click', () => {
        if (currentPrizeIndex >= prizes.length) return;
        
        // Deshabilitar botón
        girarBtn.disabled = true;
        messageBox.textContent = "Sacando sorpresa...";
        
        // Animación de la máquina
        machine.classList.add('shake');
        
        setTimeout(() => {
            machine.classList.remove('shake');
            dropCapsule();
        }, 1500); // 1.5 segundos de giro
    });
    
    function dropCapsule() {
        // Encontrar una cápsula de fondo visible y ocultarla
        let visibleBgCapsule = null;
        let capsuleColor = 'var(--pink-pastel)';
        
        for (let i = 0; i < bgCapsules.length; i++) {
            if (!bgCapsules[i].classList.contains('hidden-capsule')) {
                visibleBgCapsule = bgCapsules[i];
                capsuleColor = visibleBgCapsule.style.background;
                break;
            }
        }
        
        if (visibleBgCapsule) {
            visibleBgCapsule.classList.add('hidden-capsule');
        }
        
        capsule.querySelector('.capsule-top').style.background = capsuleColor;
        
        // Mostrar cápsula cayendo
        capsule.classList.remove('hidden', 'pop');
        capsule.classList.add('falling');
        
        setTimeout(() => {
            capsule.classList.remove('falling');
            startClickerMode();
        }, 800); // Duración de la animación de caída
    }
    
    function startClickerMode() {
        isClickable = true;
        currentClicks = 0;
        progressFill.style.width = '0%';
        progressContainer.classList.remove('hidden');
        messageBox.textContent = "¡Toca la cápsula rápido para abrirla!";
    }
    
    // Lógica del Clicker en la cápsula
    capsule.addEventListener('click', () => {
        if (!isClickable) return;
        
        currentClicks++;
        
        // Efecto de vibración
        capsule.classList.remove('vibrate');
        void capsule.offsetWidth; // Trigger reflow
        capsule.classList.add('vibrate');
        
        // Actualizar barra de progreso
        const progressPercentage = (currentClicks / CLICKS_REQUIRED) * 100;
        progressFill.style.width = `${progressPercentage}%`;
        
        if (currentClicks >= CLICKS_REQUIRED) {
            openCapsule();
        }
    });
    
    function openCapsule() {
        isClickable = false;
        progressContainer.classList.add('hidden');
        messageBox.textContent = "¡Wow!";
        
        // Efecto de explosión de la cápsula
        capsule.classList.add('pop');
        
        setTimeout(() => {
            showPrize();
        }, 300);
    }
    
    function showPrize() {
        const prize = prizes[currentPrizeIndex];
        prizeText.textContent = prize;
        modal.classList.remove('hidden');
        createConfetti();
    }
    
    function createConfetti() {
        confettiContainer.innerHTML = ''; // Limpiar confeti anterior
        const emojis = ['✨', '🌸', '🎀', '🎉', '💖', '⭐'];
        
        for (let i = 0; i < 30; i++) {
            const confetti = document.createElement('div');
            confetti.classList.add('confetti');
            confetti.textContent = emojis[Math.floor(Math.random() * emojis.length)];
            
            // Posición y duración aleatoria
            confetti.style.left = `${Math.random() * 100}%`;
            confetti.style.animationDuration = `${1.5 + Math.random() * 2}s`;
            confetti.style.animationDelay = `${Math.random() * 0.5}s`;
            
            confettiContainer.appendChild(confetti);
        }
    }
    
    closeModalBtn.addEventListener('click', () => {
        modal.classList.add('hidden');
        capsule.classList.add('hidden');
        capsule.classList.remove('pop');
        currentPrizeIndex++;
        
        if (currentPrizeIndex < prizes.length) {
            girarBtn.disabled = false;
            messageBox.textContent = "¡Gira la perilla para sacar otro premio!";
        } else {
            messageBox.textContent = "¡Feliz Cumpleaños Eli! Disfruta tus regalitos 🎂💕";
        }
    });
});
