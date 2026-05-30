$("#playButton").on("click", async function () {
    try {
        // Entrar em fullscreen
        if (document.documentElement.requestFullscreen) {
            await document.documentElement.requestFullscreen();
        }

        // Tentar bloquear em retrato
        if (screen.orientation && screen.orientation.lock) {

            try {
                await screen.orientation.lock("landscape");
            } catch (err) {
                console.warn("Não foi possível bloquear a orientação:", err);
            }
        }
    } catch (err) {
        $("#status").html(
            "❌ Fullscreen não permitido"
        );
    }
});