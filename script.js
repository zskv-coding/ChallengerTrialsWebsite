document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.nav-link');
    const contents = document.querySelectorAll('.tab-content');
    let twitchEmbed = null;

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
