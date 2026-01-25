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
        const parents = [host];
        if (host === "127.0.0.1") parents.push("localhost");
        
        twitchEmbed = new Twitch.Embed("twitch-embed", {
            width: "100%",
            height: "100%",
            channel: "challengertrials",
            parent: parents
        });
    }
});
