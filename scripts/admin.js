

$(document).ready(function(){
    // Initialize Materialize components
    $('.sidenav').sidenav();
    $('.tabs').tabs();
    $('.modal').modal();
    $('select').formSelect();
    
    // Tab navigation
    $('.tab-link').on('click', function(e) {
        e.preventDefault();
        const tabId = $(this).attr('data-tab');
        
        $('.tab-link').removeClass('active');
        $(this).addClass('active');
        
        $('.tab-content').removeClass('active');
        $(`#${tabId}`).addClass('active');
    });
    
    // Quick action buttons
    $('.quick-actions a[data-tab]').on('click', function(e) {
        e.preventDefault();
        const tabId = $(this).attr('data-tab');
        
        $('.tab-link').removeClass('active');
        $(`.tab-link[data-tab="${tabId}"]`).addClass('active');
        
        $('.tab-content').removeClass('active');
        $(`#${tabId}`).addClass('active');
    });

    // Sample data storage (in a real app, this would be server-side)
    let adminData = {
        songs: JSON.parse(localStorage.getItem('adminSongs')) || [],
        videos: JSON.parse(localStorage.getItem('adminVideos')) || [],
        announcements: JSON.parse(localStorage.getItem('adminAnnouncements')) || [],
        analytics: JSON.parse(localStorage.getItem('adminAnalytics')) || {
            totalVisits: 1245,
            uniqueVisitors: 892,
            totalDownloads: 3567,
            avgSession: '3:45',
            bounceRate: '32%',
            trafficData: [65, 59, 80, 81, 56, 55, 40, 70, 65, 75, 80, 90],
            downloadData: [120, 190, 300, 500, 200, 300, 450, 300, 400, 350, 300, 420],
            topDownloads: []
        },
        users: JSON.parse(localStorage.getItem('adminUsers')) || [
            { id: 1, username: 'musiclover', email: 'user1@example.com', downloads: 45, lastActive: '2023-10-15', status: 'active' },
            { id: 2, username: 'videofan', email: 'user2@example.com', downloads: 23, lastActive: '2023-10-14', status: 'active' },
            { id: 3, username: 'beatsmaster', email: 'user3@example.com', downloads: 67, lastActive: '2023-10-13', status: 'inactive' }
        ],
        activityLog: JSON.parse(localStorage.getItem('adminActivity')) || []
    };

    // Initialize the dashboard
    initDashboard();

    // Song Upload Form
    $('#song-upload-form').on('submit', function(e) {
        e.preventDefault();
        uploadSong();
    });

    // Video Upload Form
    $('#video-upload-form').on('submit', function(e) {
        e.preventDefault();
        uploadVideo();
    });

    // Announcement Form
    $('#announcement-form').on('submit', function(e) {
        e.preventDefault();
        createAnnouncement();
    });

    // Search functionality
    $('#search-songs').on('input', function() {
        filterSongs($(this).val());
    });

    $('#search-videos').on('input', function() {
        filterVideos($(this).val());
    });

    $('#search-users').on('input', function() {
        filterUsers($(this).val());
    });

    // Logout functionality
    $('#logout-btn, #logout-btn-mobile').on('click', function() {
        if (confirm('Are you sure you want to logout?')) {
            window.location.href = 'index.html';
        }
    });

    // Initialize Charts
    initCharts();

    // Functions
    function initDashboard() {
        updateStats();
        renderSongsTable();
        renderVideosTable();
        renderAnnouncements();
        renderUsersTable();
        renderActivityLog();
        updateTopDownloads();
    }

    function updateStats() {
        $('#total-songs').text(adminData.songs.length);
        $('#total-videos').text(adminData.videos.length);
        $('#total-downloads').text(adminData.analytics.totalDownloads);
        $('#site-visits').text(adminData.analytics.totalVisits);
        $('#total-visitors').text(adminData.analytics.totalVisits);
        $('#unique-visitors').text(adminData.analytics.uniqueVisitors);
        $('#avg-session').text(adminData.analytics.avgSession);
        $('#bounce-rate').text(adminData.analytics.bounceRate);
    }

    function uploadSong() {
        const song = {
            id: Date.now(),
            title: $('#song-title').val(),
            artist: $('#song-artist').val(),
            duration: $('#song-duration').val(),
            size: $('#song-size').val(),
            description: $('#song-description').val(),
            downloads: 0,
            dateAdded: new Date().toISOString().split('T')[0]
        };

        // In a real app, you would upload the files to a server
        // For this demo, we'll just store the metadata
        adminData.songs.push(song);
        saveData();
        
        // Log activity
        logActivity(`New song uploaded: "${song.title}" by ${song.artist}`);
        
        // Reset form
        $('#song-upload-form')[0].reset();
        M.updateTextFields();
        
        // Update UI
        updateStats();
        renderSongsTable();
        
        // Show success message
        M.toast({html: 'Song uploaded successfully!'});
    }

    function uploadVideo() {
        const video = {
            id: Date.now(),
            title: $('#video-title').val(),
            duration: $('#video-duration').val(),
            size: $('#video-size').val(),
            description: $('#video-description').val(),
            downloads: 0,
            dateAdded: new Date().toISOString().split('T')[0]
        };

        // In a real app, you would upload the files to a server
        adminData.videos.push(video);
        saveData();
        
        
        function validateFile(file, type) {
    const maxSizes = {
        'image': 500 * 1024, // 500KB
        'audio': 10 * 1024 * 1024, // 10MB
        'video': 50 * 1024 * 1024 // 50MB
    };
    
    const allowedTypes = {
        'image': ['image/jpeg', 'image/png', 'image/webp'],
        'audio': ['audio/mpeg', 'audio/mp3', 'audio/wav'],
        'video': ['video/mp4', 'video/webm', 'video/ogg']
    };
    
    if (file.size > maxSizes[type]) {
        return `File too large. Maximum size for ${type} is ${maxSizes[type] / (1024*1024)}MB`;
    }
    
    if (!allowedTypes[type].includes(file.type)) {
        return `Invalid file type. Allowed types: ${allowedTypes[type].join(', ')}`;
    }
    
    return null; // No error
}
        
        // Log activity
        logActivity(`New video uploaded: "${video.title}"`);
        
        // Reset form
        $('#video-upload-form')[0].reset();
        M.updateTextFields();
        
        // Update UI
        updateStats();
        renderVideosTable();
        
        // Show success message
        M.toast({html: 'Video uploaded successfully!'});
    }

    function createAnnouncement() {
        const announcement = {
            id: Date.now(),
            title: $('#announcement-title').val(),
            content: $('#announcement-content').val(),
            type: $('#announcement-type').val(),
            expiry: $('#announcement-expiry').val() || null,
            dateCreated: new Date().toISOString(),
            active: true
        };

        adminData.announcements.push(announcement);
        saveData();
        
        // Log activity
        logActivity(`New announcement posted: "${announcement.title}"`);
        
        // Reset form
        $('#announcement-form')[0].reset();
        M.updateTextFields();
        
        // Update UI
        renderAnnouncements();
        
        // Show success message
        M.toast({html: 'Announcement posted successfully!'});
    }

    function renderSongsTable() {
        const tbody = $('#songs-table');
        tbody.empty();
        
        adminData.songs.forEach(song => {
            const row = `
                <tr>
                    <td>${song.title}</td>
                    <td>${song.artist}</td>
                    <td>${song.duration}</td>
                    <td>${song.downloads}</td>
                    <td>
                        <a href="#!" class="btn-small sea-blue action-btn edit-btn" data-id="${song.id}" data-type="song">
                            <i class="material-icons">edit</i>
                        </a>
                        <a href="#!" class="btn-small red action-btn delete-btn" data-id="${song.id}" data-type="song">
                            <i class="material-icons">delete</i>
                        </a>
                    </td>
                </tr>
            `;
            tbody.append(row);
        });
        
        // Add event listeners for edit and delete buttons
        $('.edit-btn').on('click', function() {
            const id = $(this).data('id');
            const type = $(this).data('type');
            editContent(id, type);
        });
        
        $('.delete-btn').on('click', function() {
            const id = $(this).data('id');
            const type = $(this).data('type');
            confirmDelete(id, type);
        });
    }

    function renderVideosTable() {
        const tbody = $('#videos-table');
        tbody.empty();
        
        adminData.videos.forEach(video => {
            const row = `
                <tr>
                    <td>${video.title}</td>
                    <td>${video.duration}</td>
                    <td>${video.size}</td>
                    <td>${video.downloads}</td>
                    <td>
                        <a href="#!" class="btn-small sea-blue action-btn edit-btn" data-id="${video.id}" data-type="video">
                            <i class="material-icons">edit</i>
                        </a>
                        <a href="#!" class="btn-small red action-btn delete-btn" data-id="${video.id}" data-type="video">
                            <i class="material-icons">delete</i>
                        </a>
                    </td>
                </tr>
            `;
            tbody.append(row);
        });
        
        // Add event listeners for edit and delete buttons
        $('.edit-btn').on('click', function() {
            const id = $(this).data('id');
            const type = $(this).data('type');
            editContent(id, type);
        });
        
        $('.delete-btn').on('click', function() {
            const id = $(this).data('id');
            const type = $(this).data('type');
            confirmDelete(id, type);
        });
    }

    function renderAnnouncements() {
        const container = $('#active-announcements');
        container.empty();
        
        const activeAnnouncements = adminData.announcements.filter(a => a.active);
        
        if (activeAnnouncements.length === 0) {
            container.append('<p>No active announcements</p>');
            return;
        }
        
        activeAnnouncements.forEach(announcement => {
            const announcementEl = `
                <div class="announcement ${announcement.type}">
                    <h6>${announcement.title}</h6>
                    <p>${announcement.content}</p>
                    <small>Posted: ${new Date(announcement.dateCreated).toLocaleDateString()}</small>
                    <div class="right">
                        <a href="#!" class="btn-small red" data-id="${announcement.id}">
                            <i class="material-icons">close</i>
                        </a>
                    </div>
                </div>
            `;
            container.append(announcementEl);
        });
        
        // Add event listeners for close buttons
        $('.announcement .btn-small').on('click', function() {
            const id = $(this).data('id');
            deactivateAnnouncement(id);
        });
    }

    function renderUsersTable() {
        const tbody = $('#users-table');
        tbody.empty();
        
        adminData.users.forEach(user => {
            const statusClass = user.status === 'active' ? 'green-text' : 'red-text';
            const row = `
                <tr>
                    <td>${user.username}</td>
                    <td>${user.email}</td>
                    <td>${user.downloads}</td>
                    <td>${user.lastActive}</td>
                    <td class="${statusClass}">${user.status}</td>
                    <td>
                        <a href="#!" class="btn-small sea-blue action-btn">
                            <i class="material-icons">visibility</i>
                        </a>
                        <a href="#!" class="btn-small ${user.status === 'active' ? 'red' : 'green'} action-btn">
                            <i class="material-icons">${user.status === 'active' ? 'block' : 'check'}</i>
                        </a>
                    </td>
                </tr>
            `;
            tbody.append(row);
        });
    }

    function renderActivityLog() {
        const container = $('#recent-activity');
        container.empty();
        
        // Show latest 5 activities
        const recentActivities = adminData.activityLog.slice(-5).reverse();
        
        if (recentActivities.length === 0) {
            container.append('<li class="collection-item">No recent activity</li>');
            return;
        }
        
        recentActivities.forEach(activity => {
            const activityEl = `
                <li class="collection-item">
                    <div>${activity.message}</div>
                    <small class="grey-text">${new Date(activity.timestamp).toLocaleString()}</small>
                </li>
            `;
            container.append(activityEl);
        });
    }

    function updateTopDownloads() {
        const container = $('#top-downloads');
        container.empty();
        
        // Combine songs and videos and sort by downloads
        const allContent = [...adminData.songs, ...adminData.videos];
        const topDownloads = allContent
            .sort((a, b) => b.downloads - a.downloads)
            .slice(0, 5);
        
        if (topDownloads.length === 0) {
            container.append('<li class="collection-item">No downloads yet</li>');
            return;
        }
        
        topDownloads.forEach(item => {
            const itemEl = `
                <li class="collection-item">
                    <div>${item.title}${item.artist ? ` by ${item.artist}` : ''}</div>
                    <small class="grey-text">${item.downloads} downloads</small>
                </li>
            `;
            container.append(itemEl);
        });
    }

    function filterSongs(query) {
        const filteredSongs = adminData.songs.filter(song => 
            song.title.toLowerCase().includes(query.toLowerCase()) ||
            song.artist.toLowerCase().includes(query.toLowerCase())
        );
        
        const tbody = $('#songs-table');
        tbody.empty();
        
        filteredSongs.forEach(song => {
            const row = `
                <tr>
                    <td>${song.title}</td>
                    <td>${song.artist}</td>
                    <td>${song.duration}</td>
                    <td>${song.downloads}</td>
                    <td>
                        <a href="#!" class="btn-small sea-blue action-btn edit-btn" data-id="${song.id}" data-type="song">
                            <i class="material-icons">edit</i>
                        </a>
                        <a href="#!" class="btn-small red action-btn delete-btn" data-id="${song.id}" data-type="song">
                            <i class="material-icons">delete</i>
                        </a>
                    </td>
                </tr>
            `;
            tbody.append(row);
        });
    }

    function filterVideos(query) {
        const filteredVideos = adminData.videos.filter(video => 
            video.title.toLowerCase().includes(query.toLowerCase())
        );
        
        const tbody = $('#videos-table');
        tbody.empty();
        
        filteredVideos.forEach(video => {
            const row = `
                <tr>
                    <td>${video.title}</td>
                    <td>${video.duration}</td>
                    <td>${video.size}</td>
                    <td>${video.downloads}</td>
                    <td>
                        <a href="#!" class="btn-small sea-blue action-btn edit-btn" data-id="${video.id}" data-type="video">
                            <i class="material-icons">edit</i>
                        </a>
                        <a href="#!" class="btn-small red action-btn delete-btn" data-id="${video.id}" data-type="video">
                            <i class="material-icons">delete</i>
                        </a>
                    </td>
                </tr>
            `;
            tbody.append(row);
        });
    }

    function filterUsers(query) {
        const filteredUsers = adminData.users.filter(user => 
            user.username.toLowerCase().includes(query.toLowerCase()) ||
            user.email.toLowerCase().includes(query.toLowerCase())
        );
        
        const tbody = $('#users-table');
        tbody.empty();
        
        filteredUsers.forEach(user => {
            const statusClass = user.status === 'active' ? 'green-text' : 'red-text';
            const row = `
                <tr>
                    <td>${user.username}</td>
                    <td>${user.email}</td>
                    <td>${user.downloads}</td>
                    <td>${user.lastActive}</td>
                    <td class="${statusClass}">${user.status}</td>
                    <td>
                        <a href="#!" class="btn-small sea-blue action-btn">
                            <i class="material-icons">visibility</i>
                        </a>
                        <a href="#!" class="btn-small ${user.status === 'active' ? 'red' : 'green'} action-btn">
                            <i class="material-icons">${user.status === 'active' ? 'block' : 'check'}</i>
                        </a>
                    </td>
                </tr>
            `;
            tbody.append(row);
        });
    }

    function editContent(id, type) {
        let content;
        if (type === 'song') {
            content = adminData.songs.find(song => song.id === id);
            $('#edit-artist-field').show();
        } else {
            content = adminData.videos.find(video => video.id === id);
            $('#edit-artist-field').hide();
        }
        
        if (!content) return;
        
        $('#edit-id').val(content.id);
        $('#edit-type').val(type);
        $('#edit-title').val(content.title);
        $('#edit-artist').val(content.artist || '');
        $('#edit-duration').val(content.duration);
        $('#edit-size').val(content.size);
        
        M.updateTextFields();
        $('#edit-modal').modal('open');
    }

    function confirmDelete(id, type) {
        let content;
        let message;
        
        if (type === 'song') {
            content = adminData.songs.find(song => song.id === id);
            message = `Are you sure you want to delete the song "${content.title}"?`;
        } else {
            content = adminData.videos.find(video => video.id === id);
            message = `Are you sure you want to delete the video "${content.title}"?`;
        }
        
        if (!content) return;
        
        $('#confirm-message').text(message);
        $('#confirm-action').off('click').on('click', function() {
            deleteContent(id, type);
            $('#confirm-modal').modal('close');
        });
        
        $('#confirm-modal').modal('open');
    }

    function deleteContent(id, type) {
        if (type === 'song') {
            adminData.songs = adminData.songs.filter(song => song.id !== id);
            // Log activity
            logActivity(`Song deleted: ID ${id}`);
        } else {
            adminData.videos = adminData.videos.filter(video => video.id !== id);
            // Log activity
            logActivity(`Video deleted: ID ${id}`);
        }
        
        saveData();
        updateStats();
        renderSongsTable();
        renderVideosTable();
        
        M.toast({html: 'Content deleted successfully!'});
    }

    function deactivateAnnouncement(id) {
        const announcement = adminData.announcements.find(a => a.id === id);
        if (announcement) {
            announcement.active = false;
            saveData();
            renderAnnouncements();
            // Log activity
            logActivity(`Announcement deactivated: "${announcement.title}"`);
            M.toast({html: 'Announcement deactivated!'});
        }
    }

    function initCharts() {
        // Traffic Chart
        const trafficCtx = document.getElementById('traffic-chart').getContext('2d');
        const trafficChart = new Chart(trafficCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                datasets: [{
                    label: 'Monthly Visits',
                    data: adminData.analytics.trafficData,
                    borderColor: '#1e88e5',
                    backgroundColor: 'rgba(30, 136, 229, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });

        // Downloads Chart
        const downloadsCtx = document.getElementById('downloads-chart').getContext('2d');
        const downloadsChart = new Chart(downloadsCtx, {
            type: 'doughnut',
            data: {
                labels: ['Songs', 'Videos'],
                datasets: [{
                    data: [
                        adminData.songs.reduce((sum, song) => sum + song.downloads, 0),
                        adminData.videos.reduce((sum, video) => sum + video.downloads, 0)
                    ],
                    backgroundColor: [
                        '#1e88e5',
                        '#64b5f6'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }

    function logActivity(message) {
        const activity = {
            message,
            timestamp: new Date().toISOString()
        };
        
        adminData.activityLog.push(activity);
        saveData();
        renderActivityLog();
    }

    function saveData() {
        localStorage.setItem('adminSongs', JSON.stringify(adminData.songs));
        localStorage.setItem('adminVideos', JSON.stringify(adminData.videos));
        localStorage.setItem('adminAnnouncements', JSON.stringify(adminData.announcements));
        localStorage.setItem('adminAnalytics', JSON.stringify(adminData.analytics));
        localStorage.setItem('adminUsers', JSON.stringify(adminData.users));
        localStorage.setItem('adminActivity', JSON.stringify(adminData.activityLog));
    }

    // Save edit functionality
    $('#save-edit').on('click', function() {
        const id = $('#edit-id').val();
        const type = $('#edit-type').val();
        const title = $('#edit-title').val();
        const artist = $('#edit-artist').val();
        const duration = $('#edit-duration').val();
        const size = $('#edit-size').val();
        
        if (type === 'song') {
            const song = adminData.songs.find(s => s.id == id);
            if (song) {
                song.title = title;
                song.artist = artist;
                song.duration = duration;
                song.size = size;
            }
        } else {
            const video = adminData.videos.find(v => v.id == id);
            if (video) {
                video.title = title;
                video.duration = duration;
                video.size = size;
            }
        }
        
        
        function uploadSong() {
    const songImageFile = $('#song-image')[0].files[0];
    const songAudioFile = $('#song-file')[0].files[0];
    
    if (!songAudioFile) {
        M.toast({html: 'Please select an MP3 file!'});
        return;
    }
    
    // Generate unique filenames
    const imageName = songImageFile ? `song-${Date.now()}-cover.jpg` : 'default-cover.jpg';
    const audioName = `song-${Date.now()}.mp3`;
    
    // In a real application, you would upload these files to your server
    // For GitHub Pages, you'll need to manually add files to the assets folder
    
    const song = {
        id: Date.now(),
        title: $('#song-title').val(),
        artist: $('#song-artist').val(),
        duration: $('#song-duration').val(),
        size: $('#song-size').val(),
        description: $('#song-description').val(),
        image: `assets/songs/covers/${imageName}`,
        file: `assets/songs/${audioName}`,
        downloadUrl: `assets/songs/${audioName}`,
        downloads: 0,
        dateAdded: new Date().toISOString().split('T')[0]
    };

    adminData.songs.push(song);
    saveData();
    
    // Log activity
    logActivity(`New song uploaded: "${song.title}" by ${song.artist}`);
    
    // Reset form
    $('#song-upload-form')[0].reset();
    M.updateTextFields();
    
    // Update UI
    updateStats();
    renderSongsTable();
    
    M.toast({html: 'Song metadata saved! Remember to upload files to assets folder.'});
}

function uploadVideo() {
    const videoThumbnailFile = $('#video-thumbnail')[0].files[0];
    const videoFile = $('#video-file')[0].files[0];
    
    if (!videoFile) {
        M.toast({html: 'Please select a video file!'});
        return;
    }
    
    // Generate unique filenames
    const thumbnailName = videoThumbnailFile ? `video-${Date.now()}-thumb.jpg` : 'default-thumb.jpg';
    const videoFileName = `video-${Date.now()}.mp4`;
    
    const video = {
        id: Date.now(),
        title: $('#video-title').val(),
        duration: $('#video-duration').val(),
        size: $('#video-size').val(),
        description: $('#video-description').val(),
        image: `assets/videos/thumbnails/${thumbnailName}`,
        file: `assets/videos/${videoFileName}`,
        downloadUrl: `assets/videos/${videoFileName}`,
        downloads: 0,
        dateAdded: new Date().toISOString().split('T')[0]
    };

    adminData.videos.push(video);
    saveData();
    
    // Log activity
    logActivity(`New video uploaded: "${video.title}"`);
    
    // Reset form
    $('#video-upload-form')[0].reset();
    M.updateTextFields();
    
    // Update UI
    updateStats();
    renderVideosTable();
    
    M.toast({html: 'Video metadata saved! Remember to upload files to assets folder.'});
}
        
        saveData();
        renderSongsTable();
        renderVideosTable();
        $('#edit-modal').modal('close');
        
        M.toast({html: 'Content updated successfully!'});
    });
});



