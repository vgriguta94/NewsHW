document.addEventListener('DOMContentLoaded', function() {
    // Get the hamburger menu button and the navigation menu
    const menuButton = document.getElementById('menu');
    const navMenu = document.querySelector('.nav-menu');

    if (menuButton && navMenu) {
        // Add click event listener to the hamburger menu button
        menuButton.addEventListener('click', function() {
            console.log("Hamburger menu clicked"); // For debugging purposes
            navMenu.classList.toggle('open'); // Toggle 'open' class
        });
    }

    // Gallery and YouTube Initialization
    const gallery = document.querySelector('.video-gallery');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');

    // Load YouTube API
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    let players = [];
    let currentPlayer = null;

    // Initialize YouTube players when API is ready
    window.onYouTubeIframeAPIReady = function() {
        document.querySelectorAll('.video-thumbnail iframe').forEach((iframe, index) => {
            players[index] = new YT.Player(iframe, {
                events: {
                    'onStateChange': onPlayerStateChange
                }
            });
        });
    };

    // Handle player state changes
    function onPlayerStateChange(event) {
        if (event.data === YT.PlayerState.PLAYING) {
            const playingPlayer = event.target;

            // Stop other videos if they're playing
            players.forEach(player => {
                if (player !== playingPlayer) {
                    player.stopVideo();
                }
            });

            currentPlayer = playingPlayer;
        }
    }

    // Handle thumbnail clicks
    const videoThumbnails = document.querySelectorAll('.video-thumbnail');
    videoThumbnails.forEach((thumbnail, index) => {
        thumbnail.style.cursor = 'pointer';
        thumbnail.addEventListener('click', function() {
            const player = players[index];

            if (currentPlayer === player) {
                // Toggle play/pause for current video
                if (player.getPlayerState() === YT.PlayerState.PLAYING) {
                    player.pauseVideo();
                } else {
                    player.playVideo();
                }
            } else {
                // Stop current video if exists
                if (currentPlayer) {
                    currentPlayer.stopVideo();
                }
                // Play new video
                player.playVideo();
                currentPlayer = player;
            }
        });
    });

    // Scroll function with different amounts per view
    function scrollGallery(direction) {
        const thumbnailWidth = gallery.querySelector('.video-thumbnail').offsetWidth;
        let scrollAmount;

        if (window.innerWidth < 768) {
            // Mobile: scroll 1 thumbnail
            scrollAmount = thumbnailWidth;
        } else if (window.innerWidth < 1024) {
            // Tablet: scroll 2 thumbnails
            scrollAmount = thumbnailWidth * 2;
        } else {
            // Desktop: scroll 3 thumbnails
            scrollAmount = thumbnailWidth * 3;
        }

        gallery.scrollBy({
            left: direction * scrollAmount,
            behavior: 'smooth'
        });
    }

    if (nextBtn && prevBtn) {
        nextBtn.addEventListener('click', () => scrollGallery(1));
        prevBtn.addEventListener('click', () => scrollGallery(-1));
    }

    // Update button visibility
    function updateButtons() {
        const isAtStart = gallery.scrollLeft <= 0;
        const isAtEnd = gallery.scrollLeft >= gallery.scrollWidth - gallery.clientWidth;

        if (prevBtn && nextBtn) {
            prevBtn.style.display = isAtStart ? 'none' : 'block';
            nextBtn.style.display = isAtEnd ? 'none' : 'block';
        }
    }

    if (gallery) {
        gallery.addEventListener('scroll', updateButtons);
        window.addEventListener('resize', updateButtons);
        updateButtons(); =
    }
});
