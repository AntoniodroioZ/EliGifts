// Base de datos simulada de canciones
const playlistData = [
    {
        id: 1,
        titulo: "The way you make me feel",
        artista: "Michael Jackson",
        url_audio: "https://res.cloudinary.com/dmhrscavh/video/upload/v1782442964/The_Way_You_Make_Me_Feel_2012_Remaster_q2jxyu.mp3",
        url_portada: "https://res.cloudinary.com/dmhrscavh/image/upload/v1782443278/1900x1900-000000-80-0-0_yxxuob.jpg"
    },
    {
        id: 2,
        titulo: "Es por ti",
        artista: "Juanes",
        url_audio: "https://res.cloudinary.com/dmhrscavh/video/upload/v1782444057/Juanes_-_Es_Por_Ti_Remastered_2022_Visualizer_nfnj6g.mp3",
        url_portada: "https://res.cloudinary.com/dmhrscavh/image/upload/v1782444077/ab67616d0000b27323a1613112c1ecf946f51177_xwdfgp.jpg"
    },
    {
        id: 3,
        titulo: "Eres",
        artista: "Café Tacuba",
        url_audio: "https://res.cloudinary.com/dmhrscavh/video/upload/v1782444135/Eres_-_Caf%C3%A9_Tacuba_e4x2wy.mp3",
        url_portada: "https://res.cloudinary.com/dmhrscavh/image/upload/v1782444134/ab67616d00001e02624927252564ef4625307897_i7ro4t.jpg"
    }
];

// Elementos del DOM
const audioPlayer = document.getElementById('audio-player');
const vinyl = document.getElementById('vinyl');
const coverImage = document.getElementById('cover-image');
const playBtn = document.getElementById('play-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const playIcon = document.getElementById('play-icon');
const pauseIcon = document.getElementById('pause-icon');
const playlistContainer = document.getElementById('playlist');
const progressBar = document.getElementById('progress-bar');
const currentTimeEl = document.getElementById('current-time');
const totalTimeEl = document.getElementById('total-time');
const tonearm = document.getElementById('tonearm');

// Estado de la aplicación
let currentTrackIndex = 0;
let isPlaying = false;

// Inicialización
function init() {
    renderPlaylist();
    loadTrack(currentTrackIndex);
    
    // Event Listeners para controles
    playBtn.addEventListener('click', togglePlay);
    nextBtn.addEventListener('click', playNext);
    prevBtn.addEventListener('click', playPrev);
    
    // Event Listeners para progreso
    audioPlayer.addEventListener('timeupdate', updateProgress);
    audioPlayer.addEventListener('loadedmetadata', setTotalTime);
    progressBar.addEventListener('input', setProgress);
    
    // Event Listener para cuando la canción termine
    audioPlayer.addEventListener('ended', playNext);
}

// Cargar una canción en el reproductor
function loadTrack(index) {
    const track = playlistData[index];
    audioPlayer.src = track.url_audio;
    coverImage.src = track.url_portada;
    
    // Actualizar lista visualmente
    updateActivePlaylistItem(index);
}

// Reproducir o pausar
function togglePlay() {
    if (isPlaying) {
        pauseTrack();
    } else {
        playTrack();
    }
}

function playTrack() {
    audioPlayer.play();
    isPlaying = true;
    vinyl.classList.add('playing');
    tonearm.classList.add('playing');
    playIcon.classList.add('hidden');
    pauseIcon.classList.remove('hidden');
    
    // Calculate initial tonearm angle if there is progress
    if (audioPlayer.duration) {
        const progressPercent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        const tonearmAngle = 0 + (progressPercent / 100) * 25;
        tonearm.style.transform = `rotate(${tonearmAngle}deg)`;
    } else {
        tonearm.style.transform = `rotate(0deg)`;
    }
}

function pauseTrack() {
    audioPlayer.pause();
    isPlaying = false;
    vinyl.classList.remove('playing');
    tonearm.classList.remove('playing');
    pauseIcon.classList.add('hidden');
    playIcon.classList.remove('hidden');
    
    // Return tonearm to rest position
    tonearm.style.transform = `rotate(-25deg)`;
}

// Siguiente canción
function playNext() {
    currentTrackIndex = (currentTrackIndex + 1) % playlistData.length;
    loadTrack(currentTrackIndex);
    if (isPlaying) playTrack();
}

// Canción anterior
function playPrev() {
    currentTrackIndex = (currentTrackIndex - 1 + playlistData.length) % playlistData.length;
    loadTrack(currentTrackIndex);
    if (isPlaying) playTrack();
}

// Progreso de la canción
function updateProgress() {
    if (audioPlayer.duration) {
        const progressPercent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        progressBar.value = progressPercent;
        currentTimeEl.textContent = formatTime(audioPlayer.currentTime);
        
        // Mover la aguja basado en el progreso (de 0deg a 25deg)
        if (isPlaying) {
            const tonearmAngle = 0 + (progressPercent / 100) * 25;
            tonearm.style.transform = `rotate(${tonearmAngle}deg)`;
        }
    }
}

function setTotalTime() {
    totalTimeEl.textContent = formatTime(audioPlayer.duration);
}

function setProgress(e) {
    const newTime = (e.target.value / 100) * audioPlayer.duration;
    audioPlayer.currentTime = newTime;
    
    // Si la aguja debe moverse al hacer click en el slider
    if (isPlaying) {
        const tonearmAngle = 0 + (e.target.value / 100) * 25;
        tonearm.style.transform = `rotate(${tonearmAngle}deg)`;
    }
}

function formatTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

// Renderizar la lista de canciones en el DOM
function renderPlaylist() {
    playlistContainer.innerHTML = '';
    
    playlistData.forEach((track, index) => {
        const li = document.createElement('li');
        li.className = 'playlist-item';
        li.dataset.index = index;
        
        li.innerHTML = `
            <span class="song-title">${track.titulo}</span>
            <span class="song-artist">${track.artista}</span>
        `;
        
        li.addEventListener('click', () => {
            currentTrackIndex = index;
            loadTrack(currentTrackIndex);
            playTrack();
        });
        
        playlistContainer.appendChild(li);
    });
}

// Actualizar la clase active en el DOM
function updateActivePlaylistItem(activeIndex) {
    const items = playlistContainer.querySelectorAll('.playlist-item');
    items.forEach((item, index) => {
        if (index === activeIndex) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

// Iniciar la aplicación
init();
