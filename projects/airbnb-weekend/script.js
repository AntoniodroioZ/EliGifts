document.addEventListener('DOMContentLoaded', () => {
  // Elements for Screen 1
  const screen1 = document.getElementById('screen1');
  const screen2 = document.getElementById('screen2');
  const items = document.querySelectorAll('.item');
  const suitcase = document.getElementById('suitcase');
  const skipBtn = document.getElementById('skip-btn');
  
  // Elements for Screen 2
  const confirmBtn = document.getElementById('confirm-btn');
  const realDetails = document.getElementById('real-details');
  const confettiContainer = document.getElementById('confetti-container');

  // Game Logic
  let itemsPacked = 0;
  const totalItems = items.length;

  items.forEach(item => {
    item.addEventListener('click', () => {
      if (!item.classList.contains('packed')) {
        // Calculate center of suitcase relative to item's current position to animate properly
        const suitcaseRect = suitcase.getBoundingClientRect();
        const itemRect = item.getBoundingClientRect();
        
        const deltaX = suitcaseRect.left + suitcaseRect.width / 2 - (itemRect.left + itemRect.width / 2);
        const deltaY = suitcaseRect.top + suitcaseRect.height / 2 - (itemRect.top + itemRect.height / 2);
        
        item.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(0.1)`;
        item.style.opacity = '0';
        item.classList.add('packed');
        
        // Slight shake of the suitcase when an item is added
        suitcase.classList.remove('shake');
        void suitcase.offsetWidth; // trigger reflow
        suitcase.classList.add('shake');
        
        itemsPacked++;
        
        if (itemsPacked === totalItems) {
          setTimeout(transitionToScreen2, 800);
        }
      }
    });
  });

  skipBtn.addEventListener('click', () => {
    transitionToScreen2();
  });

  function transitionToScreen2() {
    suitcase.classList.add('zoom');
    
    setTimeout(() => {
      screen1.classList.remove('active');
      screen1.classList.add('hidden');
      
      screen2.classList.remove('hidden');
      screen2.classList.add('active');
    }, 600);
  }

  // Airbnb Screen Logic
  confirmBtn.addEventListener('click', () => {
    confirmBtn.innerText = "¡Ya está pagado! 🎉";
    confirmBtn.style.backgroundColor = "#00A699"; // Verde estilo Airbnb
    confirmBtn.disabled = true;
    
    realDetails.style.display = "block";
    createConfetti();

    // Scroll suave hacia los detalles reales después de un pequeño delay para permitir el renderizado
    setTimeout(() => {
      realDetails.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  });

  function createConfetti() {
    const emojis = ['🎉', '💖', '✨', '🌷', '🎊'];
    const amount = 50;
    
    for (let i = 0; i < amount; i++) {
      const confetti = document.createElement('div');
      confetti.classList.add('confetti');
      confetti.innerText = emojis[Math.floor(Math.random() * emojis.length)];
      
      confetti.style.left = Math.random() * 100 + 'vw';
      confetti.style.top = -20 - Math.random() * 20 + 'px';
      
      const duration = Math.random() * 3 + 2;
      confetti.style.animationDuration = duration + 's';
      
      // Add random delay to make it more natural
      confetti.style.animationDelay = Math.random() * 2 + 's';
      
      confettiContainer.appendChild(confetti);
      
      // Cleanup after animation ends
      setTimeout(() => {
        confetti.remove();
      }, (duration + 2) * 1000);
    }
  }
});
