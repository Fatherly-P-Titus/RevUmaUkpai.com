
$(document).ready(function(){
    // Initialize Materialize components
    $('.sidenav').sidenav();
    
    // Sample data for songs and videos
    const songsData = [
        {
            id: 1,
            title: "Ocean Waves",
            artist: "Marine Beats",
            duration: "3:45",
            size: "4.2 MB",
            image: "https://source.unsplash.com/300x200/?ocean,water",
            downloadUrl: "#"
        },
        {
            id: 2,
            title: "Summer Breeze",
            artist: "Coastal Sounds",
            duration: "4:12",
            size: "5.1 MB",
            image: "https://source.unsplash.com/300x200/?summer,beach",
            downloadUrl: "#"
        },
        {
            id: 3,
            title: "Deep Blue",
            artist: "Aqua Melodies",
            duration: "3:28",
            size: "3.9 MB",
            image: "https://source.unsplash.com/300x200/?blue,sea",
            downloadUrl: "#"
        },
        {
            id: 4,
            title: "Tropical Paradise",
            artist: "Island Vibes",
            duration: "4:35",
            size: "5.3 MB",
            image: "https://source.unsplash.com/300x200/?tropical,paradise",
            downloadUrl: "#"
        },
        {
            id: 5,
            title: "Sunset Serenade",
            artist: "Horizon Harmony",
            duration: "3:52",
            size: "4.5 MB",
            image: "https://source.unsplash.com/300x200/?sunset,ocean",
            downloadUrl: "#"
        },
        {
            id: 6,
            title: "Coastal Calm",
            artist: "Seaside Symphony",
            duration: "4:08",
            size: "4.8 MB",
            image: "https://source.unsplash.com/300x200/?coast,calm",
            downloadUrl: "#"
        },
    {
    id: 7,
    title: "Your Song Title",
    artist: "Artist Name",
    duration: "3:30",
    size: "4.5 MB",
    image: "assets/songs/covers/your-song-cover.jpg",
    file: "assets/songs/your-song.mp3",
    downloadUrl: "assets/songs/your-song.mp3"
}
    ];

    const videosData = [
        {
            id: 1,
            title: "Underwater Wonders",
            duration: "2:45",
            size: "15.2 MB",
            image: "https://source.unsplash.com/300x200/?underwater,fish",
            downloadUrl: "#"
        },
        {
            id: 2,
            title: "Beach Sunset",
            duration: "3:20",
            size: "18.7 MB",
            image: "https://source.unsplash.com/300x200/?beach,sunset",
            downloadUrl: "#"
        },
        {
            id: 3,
            title: "Ocean Waves 4K",
            duration: "4:15",
            size: "25.3 MB",
            image: "https://source.unsplash.com/300x200/?waves,ocean",
            downloadUrl: "#"
        },
        {
            id: 4,
            title: "Marine Life",
            duration: "3:50",
            size: "20.1 MB",
            image: "https://source.unsplash.com/300x200/?marine,life",
            downloadUrl: "#"
        },
        {
            id: 5,
            title: "Coastal Drone View",
            duration: "2:30",
            size: "16.8 MB",
            image: "https://source.unsplash.com/300x200/?coast,drone",
            downloadUrl: "#"
        },
        {
            id: 6,
            title: "Tropical Island",
            duration: "3:45",
            size: "22.5 MB",
            image: "https://source.unsplash.com/300x200/?tropical,island",
            downloadUrl: "#"
        }
    ];

    // Function to render songs
    function renderSongs(songs) {
        const container = $('#songs-container');
        container.empty();
        
        songs.forEach(song => {
            const card = `
                <div class="col s12 m6 l4">
                    <div class="card">
                        <div class="card-image">
                            <img src="${song.image}" alt="${song.title}">
                        </div>
                        <div class="card-content">
                            <span class="card-title truncate">${song.title}</span>
                            <p><strong>Artist:</strong> ${song.artist}</p>
                            <p><strong>Duration:</strong> ${song.duration}</p>
                            <p><strong>Size:</strong> ${song.size}</p>
                        </div>
                        <div class="card-action">
                            <a href="${song.downloadUrl}" class="btn sea-blue download-btn waves-effect waves-light">
                                <i class="material-icons left">file_download</i>Download
                            </a>
                        </div>
                    </div>
                </div>
            `;
            container.append(card);
        });
    }

    // Function to render videos
    function renderVideos(videos) {
        const container = $('#videos-container');
        container.empty();
        
        videos.forEach(video => {
            const card = `
                <div class="col s12 m6 l4">
                    <div class="card">
                        <div class="card-image">
                            <img src="${video.image}" alt="${video.title}">
                            <span class="card-title video-title">${video.title}</span>
                        </div>
                        <div class="card-content">
                            <p><strong>Duration:</strong> ${video.duration}</p>
                            <p><strong>Size:</strong> ${video.size}</p>
                        </div>
                        <div class="card-action">
                            <a href="${video.downloadUrl}" class="btn sea-blue download-btn waves-effect waves-light">
                                <i class="material-icons left">file_download</i>Download
                            </a>
                        </div>
                    </div>
                </div>
            `;
            container.append(card);
        });
    }

    // Search functionality for songs
    $('#song-search').on('input', function() {
        const searchTerm = $(this).val().toLowerCase();
        const filteredSongs = songsData.filter(song => 
            song.title.toLowerCase().includes(searchTerm) || 
            song.artist.toLowerCase().includes(searchTerm)
        );
        renderSongs(filteredSongs);
    });

    // Search functionality for videos
    $('#video-search').on('input', function() {
        const searchTerm = $(this).val().toLowerCase();
        const filteredVideos = videosData.filter(video => 
            video.title.toLowerCase().includes(searchTerm)
        );
        renderVideos(filteredVideos);
    });

    // Initialize the page with all songs and videos
    renderSongs(songsData);
    renderVideos(videosData);
    
    // Smooth scrolling for navigation links
    $('a[href*="#"]').on('click', function(e) {
        e.preventDefault();
        
        $('html, body').animate(
            {
                scrollTop: $($(this).attr('href')).offset().top - 70,
            },
            500,
            'linear'
        );
    });
});
