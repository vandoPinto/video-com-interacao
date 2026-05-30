
// function atualizarOrientacao() {

//     if (window.innerHeight > window.innerWidth) {
//         $("#status").html("📱 Modo Retrato");
//     } else {
//         $("#status").html("📺 Modo Paisagem");
//     }

// }

$("#playButton").on("click", async function () {

    try {

        // Entrar em fullscreen
        if (document.documentElement.requestFullscreen) {
            await document.documentElement.requestFullscreen();
        }

        // Tentar bloquear em retrato
        if (screen.orientation && screen.orientation.lock) {

            try {
                await screen.orientation.lock("portrait");

                $("#status").html(
                    "✅ Fullscreen ativado<br>🔒 Orientação travada em Retrato"
                );

            } catch (e) {

                $("#status").html(
                    "✅ Fullscreen ativado<br>⚠️ Seu navegador não permite travar a orientação"
                );

            }

        }

    } catch (err) {

        $("#status").html(
            "❌ Fullscreen não permitido"
        );

    }

});

// $(window).on("resize orientationchange", function () {
//     atualizarOrientacao();
// });

// atualizarOrientacao();