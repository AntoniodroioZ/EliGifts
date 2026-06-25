// Base de datos simulada de canciones
const playlistData = [
    {
        id: 1,
        titulo: "Reptilia",
        artista: "The Strokes",
        url_audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        url_portada: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&q=80"
    },
    {
        id: 2,
        titulo: "Pastel Skies",
        artista: "Dream Pop Band",
        url_audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
        url_portada: "https://images.unsplash.com/photo-1493225457124-a1a2a5f5f923?w=500&q=80"
    },
    {
        id: 3,
        titulo: "Neon Lights",
        artista: "Synthwave Duo",
        url_audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
        url_portada: "https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=500&q=80"
    },
    {
        id: 3,
        titulo: "Neon Lights",
        artista: "Synthwave Duo",
        url_audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
        url_portada: "https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=500&q=80"
    },
    {
        id: 3,
        titulo: "Neon Lights",
        artista: "Synthwave Duo",
        url_audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
        url_portada: "https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=500&q=80"
    },
    {
        id: 3,
        titulo: "Neon Lights",
        artista: "Synthwave Duo",
        url_audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
        url_portada: "https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=500&q=80"
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
    playIcon.classList.add('hidden');
    pauseIcon.classList.remove('hidden');
}

function pauseTrack() {
    audioPlayer.pause();
    isPlaying = false;
    vinyl.classList.remove('playing');
    pauseIcon.classList.add('hidden');
    playIcon.classList.remove('hidden');
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
