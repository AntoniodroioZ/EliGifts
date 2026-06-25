// ================================================================
//  CONFIGURACIÓN PRINCIPAL
// ================================================================

// ID de la pista de Spotify
const trackId = '6kdCN6gTWLcLxmLXoUcwuI';

// La combinación secreta para desbloquear (la fecha especial)
const combinacionSecreta = { dia: '28', mes: '06', anio: '2026' };

// URLs dinámicas de Spotify
const spotifyImgUrl = `https://scannables.scdn.co/uri/plain/svg/1DB954/white/640/spotify:track:${trackId}`;
const spotifyWidgetUrl = `https://open.spotify.com/embed/track/${trackId}?utm_source=generator&theme=0`;

// ================================================================
//  REFERENCIAS AL DOM
// ================================================================
const lockScreen = document.getElementById('lock-screen');
const heartLock = document.querySelector('.heart-lock');
const btnDesbloquear = document.getElementById('btn-desbloquear');
const mainContent = document.getElementById('main-content');

const comboDia = document.getElementById('combo-dia');
const comboMes = document.getElementById('combo-mes');
const comboAnio = document.getElementById('combo-anio');

const imgElement = document.getElementById('spotify-code');
const canvas = document.getElementById('scratch-canvas');
const ctx = canvas.getContext('2d');
const iframeElement = document.getElementById('spotify-widget');

// ================================================================
//  LÓGICA DEL CANDADO DE COMBINACIÓN (Spinners)
// ================================================================

// Configuración de rangos para cada selector
const rangos = {
    'combo-dia': { min: 1, max: 31, pad: 2 },
    'combo-mes': { min: 1, max: 12, pad: 2 },
    'combo-anio': { min: 2000, max: 2030, pad: 4 }
};

// Formatea un número con ceros a la izquierda
function padNumero(num, largo) {
    return String(num).padStart(largo, '0');
}

// Maneja los clics en los botones ▲ y ▼
function manejarSpin(evento) {
    const btn = evento.currentTarget;
    const targetId = btn.dataset.target;
    const direccion = btn.dataset.dir;
    const input = document.getElementById(targetId);
    const rango = rangos[targetId];

    let valorActual = parseInt(input.value, 10);

    if (direccion === 'up') {
        valorActual = valorActual >= rango.max ? rango.min : valorActual + 1;
    } else {
        valorActual = valorActual <= rango.min ? rango.max : valorActual - 1;
    }

    input.value = padNumero(valorActual, rango.pad);

    // Quitar la clase de error si la tenía al cambiar el valor
    input.classList.remove('error');
}

// Registrar los event listeners en todos los botones de spin
document.querySelectorAll('.spin-btn').forEach(btn => {
    btn.addEventListener('click', manejarSpin);
});

// ================================================================
//  LÓGICA DE DESBLOQUEO
// ================================================================
btnDesbloquear.addEventListener('click', () => {
    const diaIngresado = comboDia.value;
    const mesIngresado = comboMes.value;
    const anioIngresado = comboAnio.value;

    const esCorrecto =
        diaIngresado === padNumero(combinacionSecreta.dia, 2) &&
        mesIngresado === padNumero(combinacionSecreta.mes, 2) &&
        anioIngresado === padNumero(combinacionSecreta.anio, 4);

    if (esCorrecto) {
        // ¡DESBLOQUEADO! Animar el arco del candado abriéndose
        heartLock.classList.add('abierto');

        // Pequeño retardo antes de desvanecer todo el overlay
        setTimeout(() => {
            lockScreen.classList.add('desbloqueado');

            // Revelar el contenido principal
            mainContent.classList.remove('hidden');

            // Inicializar la raspadita ahora que el contenido es visible
            inicializarSpotify();
        }, 600);
    } else {
        // ¡INCORRECTO! Animación de sacudida (shake)
        heartLock.classList.add('shake');
        comboDia.classList.add('error');
        comboMes.classList.add('error');
        comboAnio.classList.add('error');

        // Quitar las clases de animación para que se pueda repetir
        setTimeout(() => {
            heartLock.classList.remove('shake');
        }, 500);

        setTimeout(() => {
            comboDia.classList.remove('error');
            comboMes.classList.remove('error');
            comboAnio.classList.remove('error');
        }, 1200);
    }
});

// ================================================================
//  INICIALIZACIÓN DE SPOTIFY Y RASPADITA
//  (Se ejecuta solo después de desbloquear para evitar carga innecesaria)
// ================================================================
function inicializarSpotify() {
    // Asignar las URLs a los elementos del DOM
    imgElement.src = spotifyImgUrl;
    iframeElement.src = spotifyWidgetUrl;

    // Dar un pequeño tiempo para que el layout se estabilice antes de pintar el canvas
    setTimeout(inicializarCanvas, 200);
}

// ================================================================
//  LÓGICA DE LA RASPADITA (Canvas)
// ================================================================
let estaRaspando = false;
const radioPincel = 30;
let reproductorDesbloqueado = false;

function inicializarCanvas() {
    // Establecemos las dimensiones reales del canvas igual a lo que el CSS le asignó
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Crear un degradado lineal (Dorado Premium)
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#e6ce8a');
    gradient.addColorStop(0.5, '#f5ebc8');
    gradient.addColorStop(1, '#d4af37');

    // Rellenamos todo el canvas con el degradado
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Texto decorativo
    ctx.fillStyle = '#8a6d1c';
    ctx.font = 'bold 24px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('✨ Raspa aquí ✨', canvas.width / 2, canvas.height / 2);

    // LA MAGIA: destination-out para que el dibujo borre la capa dorada
    ctx.globalCompositeOperation = 'destination-out';
}

function obtenerCoordenadas(evento) {
    const rect = canvas.getBoundingClientRect();
    let x, y;

    if (evento.touches && evento.touches.length > 0) {
        x = evento.touches[0].clientX - rect.left;
        y = evento.touches[0].clientY - rect.top;
    } else {
        x = evento.clientX - rect.left;
        y = evento.clientY - rect.top;
    }

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
        x: x * scaleX,
        y: y * scaleY
    };
}

function raspar(evento) {
    if (!estaRaspando || reproductorDesbloqueado) return;

    if (evento.cancelable) {
        evento.preventDefault();
    }

    const { x, y } = obtenerCoordenadas(evento);

    ctx.beginPath();
    ctx.arc(x, y, radioPincel, 0, Math.PI * 2);
    ctx.fill();
}

// Comprobamos si ya raspó suficiente para auto-revelar todo
function comprobarProgresoRaspado() {
    if (reproductorDesbloqueado) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixeles = imageData.data;
    let pixelesBorrados = 0;

    for (let i = 0; i < pixeles.length; i += 4) {
        if (pixeles[i + 3] < 128) {
            pixelesBorrados++;
        }
    }

    const maxPixeles = pixeles.length / 4;
    const porcentajeCompletado = (pixelesBorrados / maxPixeles) * 100;

    if (porcentajeCompletado > 60) {
        reproductorDesbloqueado = true;
        canvas.style.opacity = '0';
        canvas.style.pointerEvents = 'none';
        setTimeout(() => canvas.remove(), 800);
    }
}

// --- Event listeners PC ---
canvas.addEventListener('mousedown', (e) => { estaRaspando = true; raspar(e); });
canvas.addEventListener('mousemove', raspar);
canvas.addEventListener('mouseup', () => { estaRaspando = false; comprobarProgresoRaspado(); });
canvas.addEventListener('mouseleave', () => { estaRaspando = false; comprobarProgresoRaspado(); });

// --- Event listeners Móviles ---
canvas.addEventListener('touchstart', (e) => { estaRaspando = true; raspar(e); }, { passive: false });
canvas.addEventListener('touchmove', raspar, { passive: false });
canvas.addEventListener('touchend', () => { estaRaspando = false; comprobarProgresoRaspado(); });
canvas.addEventListener('touchcancel', () => { estaRaspando = false; comprobarProgresoRaspado(); });
