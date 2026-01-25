document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.nav-link');
    const contents = document.querySelectorAll('.tab-content');
    let twitchEmbed = null;

    initTitleTypewriter();
    initGameModals();

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.getAttribute('data-tab');

            // Update active states
            tabs.forEach(t => t.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));

            tab.classList.add('active');
            document.getElementById(target).classList.add('active');

            // Initialize Twitch if Live tab is clicked and not already initialized
            if (target === 'live' && !twitchEmbed) {
                initTwitch();
            }
        });
    });

    function initGameModals() {
        const modal = document.getElementById('game-modal');
        const modalTitle = document.getElementById('modal-title');
        const modalDesc = document.getElementById('modal-description');
        const closeBtn = document.querySelector('.close-modal');
        const gameCards = document.querySelectorAll('.game-card');
        const galleryImages = document.querySelectorAll('.gallery-img');
        const lightbox = document.getElementById('lightbox');
        const lightboxImg = document.getElementById('lightbox-img');
        const closeLightbox = document.querySelector('.close-lightbox');

        const descriptions = {
            'capture-the-flag': `
                <p>Two teams will be placed in a court, first one to collect the banner on the opposite side and deliver it to their own banner wins! After all teams have played each other, the game ends (So get them points!)</p>
                <p><strong>Classes:</strong></p>
                <ul>
                    <li><strong>Assassin:</strong> Iron sword, no armor.</li>
                    <li><strong>Knight:</strong> Leather boots and chestplate, stone sword.</li>
                    <li><strong>Arbalist:</strong> Leather pants, wooden sword, crossbow (1 slowness arrow, 8 regular arrows).</li>
                    <li><strong>Archer:</strong> Wooden sword, leather boots and tunic, bow, 16 arrows.</li>
                    <li><strong>Potioneer:</strong> 2 healing pots, 1 harming pot, wooden sword, leather boots and chestplate.</li>
                </ul>
                <p>Only one of each class may be selected on a team, so best that you coordinate!</p>
            `,
            'footrace': `
                <p>Circle the map a total of 3 times! Watch out for soul sand and warped stem! Make sure you stay up front, because the lead earns more points than everyone else!</p>
                <p><strong>Tip:</strong> Keep your feet on the ground so that the effects of speed will still work (Don't jump!)</p>
            `,
            'spleef': `
                <p>Everyone knows how to play Spleef! Swing your shovel at the dirt below your opponents and be the last one standing! The ground will slowly disintegrate so be careful!</p>
                <p>This game will also be played 3 times in succession! There are powerups like snowballs that break blocks and swap players. There is also an auto shield that has a small chance of dropping that can block the player swapper.</p>
            `,
            'survival-games': `
                <p>It's just Survival Games. When the game starts you will have 20 seconds of immunity after that you must race through the map to collect armor, weapons, and tools to carry you and your team to victory! Last team standing wins!</p>
            `,
            'parkour-pathway': `
                <p>It's parkour, but with a stricter path... way. Get tournament points at each checkpoint, and even more if you make it to the end!</p>
            `,
            'clockwork': `
                <p>A bell will ring X amount of times ranging from 1-12. Run to the corresponding granite platform and watch the others die. Things will speed up and get more difficult as time goes on, so be careful!</p>
                <p><a href="https://youtu.be/WCzQCja0yOw" target="_blank" class="modal-link">Watch Gameplay Video (Credit: Xcla)</a></p>
            `,
            'farm-rush': `
                <p>Collect items and sell them for points as quick as you can. First to the point max wins and any other items not sold when the max is hit will not be counted and the game will end. Use crop growers and animal growers to speed up cooldowns and timers.</p>
                <p><a href="https://youtu.be/3zD9BHEu7ig" target="_blank" class="modal-link">Watch Tutorial Video</a></p>
            `,
            'colossal-combat': `
                <p>The top two teams face off in the finale of the event. First team to 3 rounds won will win the entire event.</p>
                <p><strong>Goal:</strong> Knock the opposing team off the platforms. The lava will rise throughout the round, making it harder to traverse the map.</p>
                <p><strong>Kits:</strong></p>
                <ul>
                    <li><strong>Archer:</strong> Punch 1 bow, ability to punch opposition. Ammo: Arrows.</li>
                    <li><strong>Skirmisher:</strong> Start with nothing, not able to punch. Ammo: Wind Charges.</li>
                </ul>
                <p>Kits receive ammo every couple of seconds. You can change your kit before every round. <strong>Tip:</strong> Wind charging the lower half of a player launches them high; the upper half sends them backwards.</p>
            `
        };

        gameCards.forEach(card => {
            card.addEventListener('click', () => {
                const gameKey = card.getAttribute('data-game');
                if (descriptions[gameKey]) {
                    modalTitle.textContent = card.querySelector('h2').textContent;
                    modalDesc.innerHTML = descriptions[gameKey];
                    
                    // Update gallery images
                    galleryImages.forEach((img, index) => {
                        img.src = `${gameKey}-${index + 1}.png`;
                        img.alt = `${modalTitle.textContent} Screenshot ${index + 1}`;
                    });

                    modal.style.display = 'block';
                    document.body.style.overflow = 'hidden'; // Prevent scrolling
                }
            });
        });

        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });

        window.addEventListener('click', (event) => {
            if (event.target === modal) {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
            if (event.target === lightbox) {
                lightbox.classList.remove('active');
            }
        });

        // Lightbox logic
        galleryImages.forEach(img => {
            img.addEventListener('click', () => {
                lightboxImg.src = img.src;
                lightbox.classList.add('active');
            });
        });

        closeLightbox.addEventListener('click', () => {
            lightbox.classList.remove('active');
        });
    }

    function initTitleTypewriter() {
        const fullTitle = "Challenger Trials";
        let i = 0;
        
        function type() {
            if (i <= fullTitle.length) {
                document.title = fullTitle.substring(0, i) + (i < fullTitle.length ? "_" : "");
                i++;
                setTimeout(type, 150);
            } else {
                let blinks = 0;
                const blinkInterval = setInterval(() => {
                    document.title = fullTitle + (blinks % 2 === 0 ? " " : "_");
                    blinks++;
                    if (blinks > 5) {
                        clearInterval(blinkInterval);
                        document.title = fullTitle;
                    }
                }, 500);
            }
        }
        
        type();
    }

    function initTwitch() {
        const host = window.location.hostname;
        
        // Twitch embeds do not work on file:// protocol
        if (!host) {
            console.error("Twitch Embed Error: You must use a local web server (like Live Server) or host the site online. Twitch embeds do not work when opening HTML files directly.");
            document.getElementById('twitch-embed').innerHTML = '<div style="color: white; padding: 20px; text-align: center;">Twitch embed requires a web server to function. Please run this through a local server or host it online.</div>';
            return;
        }

        const parents = [host];
        if (host === "localhost" || host === "127.0.0.1") {
            if (!parents.includes("localhost")) parents.push("localhost");
            if (!parents.includes("127.0.0.1")) parents.push("127.0.0.1");
        }
        
        twitchEmbed = new Twitch.Embed("twitch-embed", {
            width: "100%",
            height: "100%",
            channel: "challengertrials",
            parent: parents,
            layout: "video"
        });
    }
});
