document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.nav-link');
    const contents = document.querySelectorAll('.tab-content');
    const transitionOverlay = document.getElementById('page-transition');
    let twitchEmbed = null;
    let liveStandingsInterval = null;

    // Trigger initial load transition
    triggerTransition();
    
    initTitleTypewriter();
    initGameModals();
    initPlayers();
    initPreviousEvents();

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.getAttribute('data-tab');
            if (!tab.classList.contains('active')) {
                triggerTransition(() => switchTab(target));
            }
        });
    });

    // Handle internal tab switches
    document.querySelectorAll('[data-tab-switch]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const target = btn.getAttribute('data-tab-switch');
            triggerTransition(() => switchTab(target));
        });
    });

    function triggerTransition(callback = null) {
        transitionOverlay.classList.add('active');
        document.body.classList.add('loading');

        // Halfway through transition, execute callback
        setTimeout(() => {
            if (callback) callback();
        }, 500);

        // End transition
        setTimeout(() => {
            transitionOverlay.classList.remove('active');
            document.body.classList.remove('loading');
        }, 1200);
    }

    function switchTab(target) {
        // Update active states
        tabs.forEach(t => {
            if (t.getAttribute('data-tab') === target) {
                t.classList.add('active');
            } else {
                t.classList.remove('active');
            }
        });

        contents.forEach(c => {
            if (c.getAttribute('id') === target) {
                c.classList.add('active');
            } else {
                c.classList.remove('active');
            }
        });

        // Initialize Twitch if Live tab is clicked and not already initialized
        if (liveStandingsInterval) {
            clearInterval(liveStandingsInterval);
            liveStandingsInterval = null;
        }

        if (target === 'live') {
            if (!twitchEmbed) {
                initTwitch();
            }
            updateLiveStandings(); // Fetch and update scores
            // Auto-refresh every 30 seconds
            liveStandingsInterval = setInterval(updateLiveStandings, 30000);
        }

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

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
            const playerModal = document.getElementById('player-modal');
            if (event.target === modal) {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
            if (event.target === playerModal) {
                playerModal.style.display = 'none';
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

        const parents = [host, "challengertrials.com", "www.challengertrials.com"];
        if (host === "localhost" || host === "127.0.0.1") {
            if (!parents.includes("localhost")) parents.push("localhost");
            if (!parents.includes("127.0.0.1")) parents.push("127.0.0.1");
        }
        
        twitchEmbed = new Twitch.Player("twitch-embed", {
            width: "100%",
            height: "100%",
            channel: "challengertrials",
            parent: parents
        });
    }

    function initPlayers() {
        const grid = document.getElementById('players-grid');
        const modal = document.getElementById('player-modal');
        const closeBtn = document.querySelector('.player-close-modal');

        // Populate grid
        playerData.forEach(player => {
            const card = document.createElement('div');
            card.className = 'player-card';
            card.innerHTML = `
                <div class="player-card-inner">
                    <img src="https://crafatar.com/avatars/${player.uuid}?size=128&overlay" alt="${player.name}" class="player-card-skin" onerror="this.src='https://minotar.net/helm/${player.uuid}/128'">
                    <div class="player-card-info">
                        <span class="player-card-name">${player.name}</span>
                        <button class="stats-btn">Stats</button>
                    </div>
                </div>
            `;

            card.addEventListener('click', () => showPlayerStats(player));
            grid.appendChild(card);
        });

        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });

        function showPlayerStats(player) {
            document.getElementById('player-detail-name').textContent = player.name;
            document.getElementById('player-detail-uuid').textContent = player.uuid;
            
            const detailSkin = document.getElementById('player-detail-skin');
            detailSkin.src = `https://mc-heads.net/body/${player.uuid}/512`;
            detailSkin.onerror = function() {
                this.src = `https://crafatar.com/renders/body/${player.uuid}?size=512&overlay`;
            };

            document.getElementById('stat-won').textContent = player.won;
            document.getElementById('stat-rank').textContent = player.rank;
            document.getElementById('stat-avg').textContent = player.avg;
            document.getElementById('stat-events').textContent = player.events;

            const scoresList = document.getElementById('player-scores-list');
            scoresList.innerHTML = '';
            
            if (player.scores.length === 0) {
                scoresList.innerHTML = '<p class="no-data">No event history available yet.</p>';
            } else {
                player.scores.forEach((score, index) => {
                    const scoreItem = document.createElement('div');
                    scoreItem.className = 'score-item';
                    scoreItem.innerHTML = `
                        <span class="event-name">Event ${index + 1}</span>
                        <span class="event-score">${score}</span>
                    `;
                    scoresList.appendChild(scoreItem);
                });
            }

            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
    }

    function initPreviousEvents() {
        const grid = document.getElementById('previous-events-list');
        const modal = document.getElementById('event-modal');
        const closeBtn = document.querySelector('.event-close-modal');
        const detailTag = document.getElementById('event-detail-tag');
        const detailTitle = document.getElementById('event-detail-title');
        const detailInfo = document.getElementById('event-detail-full-info');

        if (!grid) return;

        const eventDataMap = {
            1: {
                tag: "Beta #1",
                title: "Challenger Trials Beta 1",
                description: "The FIRST Challenger Trials Beta event!",
                winner: { name: "Blue Beacons", icon: "blue-beacons.png" },
                teams: [
                    { name: "Green Geese", color: "green", icon: "green-geese.png", score: 9740, players: [
                        { name: "hiitzhunter", score: 2968 },
                        { name: "SaltContent", score: 2572 },
                        { name: "sandich", score: 1600 },
                        { name: "Skate8", score: 2600 }
                    ]},
                    { name: "Blue Beacons", color: "blue", icon: "blue-beacons.png", score: 9171, players: [
                        { name: "madnes__", score: 1663 },
                        { name: "nooobi", score: 2285 },
                        { name: "Sacronix", score: 2980 },
                        { name: "Snoae", score: 2243 }
                    ]},
                    { name: "Cyan Cyclones", color: "cyan", icon: "cyan-cyclones.png", score: 8258, players: [
                        { name: "Faistara", score: 2595 },
                        { name: "g4vy", score: 1846 },
                        { name: "itsnuku", score: 1829 },
                        { name: "Kbelik", score: 1988 }
                    ]},
                    { name: "Orange Owls", color: "orange", icon: "orange-owls.png", score: 7920, players: [
                        { name: "C12dawg", score: 1852 },
                        { name: "QuartzIsCanon", score: 2237 },
                        { name: "Wo0o0o0ble_", score: 2072 },
                        { name: "WolfieLiam", score: 1759 }
                    ]},
                    { name: "Yellow Yetis", color: "yellow", icon: "yellow-yetis.png", score: 7810, players: [
                        { name: "Ess4nce", score: 2124 },
                        { name: "HoodieDuck_", score: 2204 },
                        { name: "ItzChoco", score: 1887 },
                        { name: "quizky", score: 1595 }
                    ]},
                    { name: "Red Robots", color: "red", icon: "red-robots.png", score: 7423, players: [
                        { name: "daneloldane", score: 1354 },
                        { name: "Krumbld", score: 2257 },
                        { name: "MiniBoru", score: 1502 },
                        { name: "MrCakeness", score: 2310 }
                    ]},
                    { name: "Pink Pilots", color: "pink", icon: "pink-pilots.png", score: 6840, players: [
                        { name: "Percee_", score: 941 },
                        { name: "PizzaBuff", score: 1815 },
                        { name: "PorcChrysus", score: 2252 },
                        { name: "ProfPie2000", score: 1832 }
                    ]},
                    { name: "Aqua Aliens", color: "aqua", icon: "aqua-aliens.png", score: 6768, players: [
                        { name: "Chandiggitydog", score: 2286 },
                        { name: "Ka1b23i", score: 974 },
                        { name: "SpoonyTable", score: 2026 },
                        { name: "TinyRiotx", score: 1482 }
                    ]},
                    { name: "Lime Lizards", color: "lime", icon: "lime-lizards.png", score: 6686, players: [
                        { name: "DylanWMC", score: 1538 },
                        { name: "McZeal", score: 1062 },
                        { name: "Messyo", score: 2312 },
                        { name: "xd_Bayern", score: 1774 }
                    ]},
                    { name: "Purple Pirates", color: "purple", icon: "purple-pirates.png", score: 5147, players: [
                        { name: "CHALLY073763", score: 1130 },
                        { name: "RedTheCactus", score: 983 },
                        { name: "SlothRSR", score: 1161 },
                        { name: "Stehllar_", score: 1873 }
                    ]}
                ],
                topPlayers: [
                    { name: "Sacronix", score: 2980 },
                    { name: "hiitzhunter", score: 2968 },
                    { name: "Skate8", score: 2600 }
                ]
            }
        };

        // Generate Previous Events (just Beta #1 for now)
        for (let i = 1; i >= 1; i--) {
            let eventData;
            
            if (eventDataMap[i]) {
                eventData = eventDataMap[i];
                eventData.id = i;
            } else {
                eventData = {
                    id: i,
                    tag: `Beta #${i}`,
                    title: `Challenger Trials Beta ${i}`,
                    description: "Event information coming soon! Stay tuned for actual results and standings.",
                    placeholder: true
                };
            }

            const card = document.createElement('div');
            card.className = 'event-card';
            
            let winnerInfo = '<span>Details coming soon...</span>';
            if (eventData.winner) {
                winnerInfo = `
                    <img src="${eventData.winner.icon}" alt="${eventData.winner.name}" class="winner-icon">
                    <span>Winner: ${eventData.winner.name}</span>
                `;
            }

            card.innerHTML = `
                <div class="event-card-header">
                    <div class="event-info">
                        <span class="event-tag">${eventData.tag}</span>
                        <h3 class="event-title">${eventData.title}</h3>
                    </div>
                    <div class="event-winner-brief">
                        ${winnerInfo}
                    </div>
                </div>
            `;

            card.addEventListener('click', () => {
                detailTag.textContent = eventData.tag;
                detailTitle.textContent = eventData.title;
                
                if (eventData.placeholder) {
                    detailInfo.innerHTML = `
                        <div class="event-detail-grid">
                            <div class="event-detail-section">
                                <h3><span class="icon">🏆</span> Top Teams</h3>
                                <p>Data will be updated shortly.</p>
                            </div>
                            <div class="event-detail-section">
                                <h3><span class="icon">👤</span> Top Players</h3>
                                <p>Data will be updated shortly.</p>
                            </div>
                        </div>
                    `;
                } else {
                    let teamStandingsHtml = eventData.teams.map((team, idx) => `
                        <div class="mini-standing-row">
                            <span class="rank">${idx + 1}${idx === 0 ? 'st' : idx === 1 ? 'nd' : idx === 2 ? 'rd' : 'th'}</span>
                            <div class="team-name color-${team.color}">
                                <img src="${team.icon}" alt="${team.name}" class="mini-team-icon">
                                <span>${team.name}</span>
                            </div>
                            <span class="points">${team.score.toLocaleString()}</span>
                        </div>
                    `).join('');

                    let topPlayersHtml = eventData.topPlayers.map((player, idx) => `
                        <div class="mini-indiv-row">
                            <span class="rank">${idx + 1}${idx === 0 ? 'st' : idx === 1 ? 'nd' : idx === 2 ? 'rd' : 'th'}</span>
                            <span class="player-name">${player.name}</span>
                            <span class="points">${player.score.toLocaleString()}</span>
                        </div>
                    `).join('');

                    // Full team details for wide view
                    let fullStandingsHtml = eventData.teams.map(team => {
                        const playerHtml = team.players.map(p => {
                            const pData = playerData.find(pd => pd.name.toLowerCase() === p.name.toLowerCase());
                            const uuid = pData ? pData.uuid : 'steve';
                            const faceUrl = `https://mc-heads.net/avatar/${uuid}/32`;
                            return `
                                <div class="player-score-item">
                                    <div class="player-name-face">
                                        <img src="${faceUrl}" alt="${p.name}" class="mini-player-face" onerror="this.src='https://mc-heads.net/avatar/steve/32'">
                                        <span>${p.name}</span>
                                    </div>
                                    <strong>${p.score.toLocaleString()}</strong>
                                </div>
                            `;
                        }).join('');

                        return `
                            <div class="event-detail-section">
                                <h3 class="team-header-with-icon">
                                    <img src="${team.icon}" alt="${team.name}" class="mini-team-icon-header">
                                    <span>${team.name} - ${team.score.toLocaleString()}</span>
                                </h3>
                                <div class="player-score-grid">
                                    ${playerHtml}
                                </div>
                            </div>
                        `;
                    }).join('');

                    detailInfo.innerHTML = `
                        <div class="event-detail-section">
                            <h3><span class="icon">🎮</span> Games Played</h3>
                            <div class="games-played-icons">
                                <div class="game-icon-wrapper" data-game-name="Clockwork"><img src="clockwork-icon.png" alt="Clockwork"></div>
                                <div class="game-icon-wrapper arrow">→</div>
                                <div class="game-icon-wrapper" data-game-name="Farm Rush"><img src="farmrush-icon.png" alt="Farm Rush"></div>
                                <div class="game-icon-wrapper arrow">→</div>
                                <div class="game-icon-wrapper" data-game-name="Footrace"><img src="footrace-icon.png" alt="Footrace"></div>
                                <div class="game-icon-wrapper arrow">→</div>
                                <div class="game-icon-wrapper" data-game-name="Parkour Pathway"><img src="parkour-icon.png" alt="Parkour Pathway"></div>
                                <div class="game-icon-wrapper arrow">→</div>
                                <div class="game-icon-wrapper" data-game-name="Spleef"><img src="spleef-icon.png" alt="Spleef"></div>
                                <div class="game-icon-wrapper arrow">→</div>
                                <div class="game-icon-wrapper" data-game-name="Survival Games"><img src="survivalgames-icon.png" alt="Survival Games"></div>
                                <div class="game-icon-wrapper arrow">→</div>
                                <div class="game-icon-wrapper" data-game-name="Capture the Flag"><img src="ctf-icon.png" alt="Capture the Flag"></div>
                                <div class="game-icon-wrapper arrow">→</div>
                                <div class="game-icon-wrapper finale" data-game-name="Finale"><img src="ct-crown.png" alt="Finale"></div>
                            </div>
                        </div>
                        <div class="event-detail-grid">
                            <div class="event-detail-section">
                                <h3><span class="icon">🏆</span> Final Standings</h3>
                                ${teamStandingsHtml}
                            </div>
                            <div class="event-detail-section">
                                <h3><span class="icon">👤</span> Top Players</h3>
                                ${topPlayersHtml}
                            </div>
                        </div>
                        <div class="event-detail-section full-stats-divider">
                            <h2 class="section-subtitle">Individual Team Scores</h2>
                        </div>
                        <div class="full-event-stats">
                            ${fullStandingsHtml}
                        </div>
                    `;
                }
                modal.style.display = 'block';
                document.body.style.overflow = 'hidden';
            });

            grid.appendChild(card);
        }

        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            });
        }

        window.addEventListener('click', (event) => {
            if (event.target === modal) {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }

    async function updateLiveStandings() {
        // REPLACE THIS with your actual Koyeb URL
        const API_URL = 'https://determined-kore-challengertrials-f861d4c5.koyeb.app/teams';
        const grid = document.querySelector('.teams-grid');
        if (!grid) return;
        
        try {
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error('API request failed');
            
            const data = await response.json();
            
            // Sort data by total score descending
            data.sort((a, b) => b.total_score - a.total_score);
            
            data.forEach((team, index) => {
                // Finds the card (e.g., .team-red, .team-orange)
                const teamCard = document.querySelector(`.team-card-score.team-${team.team_id}`);
                
                if (teamCard) {
                    // Remove existing crown if any
                    const oldCrown = teamCard.querySelector('.team-crown');
                    if (oldCrown) oldCrown.remove();

                    // Add crown to the winner
                    // We check for a winner flag from the API, or if it's the Beta 1 demo, Blue Beacons
                    if (team.winner || team.is_winner || (team.team_id === 'blue' && team.total_score === 9171)) {
                        const crown = document.createElement('img');
                        crown.src = 'ct-crown.png';
                        crown.className = 'team-crown';
                        crown.alt = 'Champion Crown';
                        teamCard.prepend(crown);
                    }

                    // Update main score
                    teamCard.querySelector('.score-main').textContent = team.total_score.toLocaleString();
                    
                    // Update player list
                    const playerList = teamCard.querySelector('.player-list');
                    if (playerList && team.players) {
                        playerList.innerHTML = team.players.map(p => {
                            const pData = playerData.find(pd => pd.name.toLowerCase() === p.name.toLowerCase());
                            const uuid = p.uuid || (pData ? pData.uuid : 'steve');
                            const faceUrl = `https://mc-heads.net/avatar/${uuid}/24`;
                            return `
                                <div class="live-player-row">
                                    <img src="${faceUrl}" alt="${p.name}" class="live-player-face" onerror="this.src='https://mc-heads.net/avatar/steve/24'">
                                    <span>${p.name}: ${p.score.toLocaleString()}</span>
                                </div>
                            `;
                        }).join('');
                    }

                    // Re-append to grid to reorder based on sorted data
                    grid.appendChild(teamCard);
                }
            });
        } catch (error) {
            console.warn('Live standings API error or not available. Sorting existing cards by static scores.');
            
            // Fallback: Sort existing cards in the DOM by their current displayed scores
            const cards = Array.from(grid.querySelectorAll('.team-card-score'));
            cards.sort((a, b) => {
                const scoreA = parseInt(a.querySelector('.score-main').textContent.replace(/,/g, '')) || 0;
                const scoreB = parseInt(b.querySelector('.score-main').textContent.replace(/,/g, '')) || 0;
                return scoreB - scoreA;
            });

            // Re-append in sorted order and ensure faces are shown
            cards.forEach((card, index) => {
                // Remove existing crown if any
                const oldCrown = card.querySelector('.team-crown');
                if (oldCrown) oldCrown.remove();

                // Add crown to the actual winner (Blue Beacons for Beta 1)
                const teamName = card.querySelector('h3').textContent;
                if (teamName === "Blue Beacons") {
                    const crown = document.createElement('img');
                    crown.src = 'ct-crown.png';
                    crown.className = 'team-crown';
                    crown.alt = 'Champion Crown';
                    card.prepend(crown);
                }

                // Update static player list to include faces if not already there
                const playerList = card.querySelector('.player-list');
                if (playerList) {
                    const players = Array.from(playerList.querySelectorAll('p, .live-player-row'));
                    playerList.innerHTML = players.map(pElement => {
                        const text = pElement.textContent;
                        const [name, score] = text.split(':').map(s => s.trim());
                        const pData = playerData.find(pd => pd.name.toLowerCase() === name.toLowerCase());
                        const uuid = pData ? pData.uuid : 'steve';
                        const faceUrl = `https://mc-heads.net/avatar/${uuid}/24`;
                        return `
                            <div class="live-player-row">
                                <img src="${faceUrl}" alt="${name}" class="live-player-face" onerror="this.src='https://mc-heads.net/avatar/steve/24'">
                                <span>${name}: ${score}</span>
                            </div>
                        `;
                    }).join('');
                }
                
                grid.appendChild(card);
            });
        }
    }
});
