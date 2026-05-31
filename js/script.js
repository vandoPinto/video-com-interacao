// ==========================================
// ELEMENTOS
// ==========================================

const $video = $("#video");
const $overlay = $("#overlay");
const $overlayContent = $("#overlay-content");
const $playButton = $("#playButton");
const $videoTimer = $("#videoTimer");

const video = $video[0];

const BASE_WIDTH = 1920;
const BASE_HEIGHT = 1080;

let loopInterval = null;

let webcamFile = null;
let stream = null;

// ==========================================
// FORMATAÇÃO DO TIMER
// ==========================================

function formatarTempo(segundos) {

    segundos = Number(segundos) || 0;

    return segundos.toFixed(3);

}

function atualizarTimer() {

    $videoTimer.text(
        `${formatarTempo(video.currentTime)} / ${formatarTempo(video.duration)}`
    );

}

// ==========================================
// AJUSTE DO OVERLAY
// ==========================================

function ajustarOverlay() {

    const $container = $("#player-container");

    const containerWidth = $container.width();
    const containerHeight = $container.height();

    const videoWidth = video.videoWidth;
    const videoHeight = video.videoHeight;

    if (!videoWidth || !videoHeight) return;

    const videoRatio = videoWidth / videoHeight;
    const containerRatio = containerWidth / containerHeight;

    let renderWidth;
    let renderHeight;
    let offsetLeft;
    let offsetTop;

    if (containerRatio > videoRatio) {

        renderHeight = containerHeight;
        renderWidth = renderHeight * videoRatio;

        offsetLeft = (containerWidth - renderWidth) / 2;
        offsetTop = 0;

    } else {

        renderWidth = containerWidth;
        renderHeight = renderWidth / videoRatio;

        offsetLeft = 0;
        offsetTop = (containerHeight - renderHeight) / 2;

    }

    $overlay.css({
        left: offsetLeft + "px",
        top: offsetTop + "px",
        width: renderWidth + "px",
        height: renderHeight + "px"
    });

    const escalaX = renderWidth / BASE_WIDTH;
    const escalaY = renderHeight / BASE_HEIGHT;

    $overlayContent.css(
        "transform",
        `scale(${escalaX}, ${escalaY})`
    );

}

// ==========================================
// PLAY INICIAL
// ==========================================

$playButton.on("click", async function () {

    try {

        await video.play();

        $playButton.hide();

    } catch (error) {

        console.error(error);

    }

});

// ==========================================
// EVENTOS DO VÍDEO
// ==========================================

$video.on("timeupdate", function () {

    atualizarTimer();
    verificarEventosVideo();

});

$video.on("loadedmetadata", function () {

    ajustarOverlay();
    atualizarTimer();

});

// ==========================================
// EVENTOS DE JANELA
// ==========================================

$(window).on("resize", ajustarOverlay);

$(window).on("orientationchange", function () {

    setTimeout(ajustarOverlay, 300);

});

$(document).on("fullscreenchange", function () {

    setTimeout(ajustarOverlay, 300);

});


/* PLAY INICIAL */

$("#playButton").on("click", async function () {

    try {

        await video.play();

        $(this).hide();

    } catch (error) {

        console.error(error);

    }

});

/* CONTROLES DO TECLADO

ESPAÇO = PLAY/PAUSE
← = VOLTA 1 SEGUNDO
→ = AVANÇA 1 SEGUNDO
↑ = VOLTA 5 SEGUNDOS
↓ = AVANÇA 5 SEGUNDOS

*/

$(document).on("keydown", async function (e) {

    switch (e.code) {

        case "Space":

            e.preventDefault();

            console.log(
                "Espaço pressionado",
                "paused:",
                video.paused
            );

            if (video.paused) {

                try {

                    await video.play();

                    console.log("PLAY");

                } catch (err) {

                    console.error(err);

                }

            } else {

                console.log("PAUSE");

                video.pause();

            }

            break;

        case "ArrowLeft":

            e.preventDefault();

            video.currentTime =
                Math.max(0, video.currentTime - 1);

            break;

        case "ArrowRight":

            e.preventDefault();

            video.currentTime =
                Math.min(
                    video.duration,
                    video.currentTime + 1
                );

            break;

        case "ArrowDown":

            e.preventDefault();

            video.currentTime =
                Math.max(0, video.currentTime - 5);

            break;

        case "ArrowUp":

            e.preventDefault();

            video.currentTime =
                Math.min(
                    video.duration,
                    video.currentTime + 5
                );

            break;

    }

});

/* EVENTOS */

$(video).on("timeupdate", function () {

    atualizarTimer();
    verificarEventosVideo();

});

$(video).on("loadedmetadata", function () {

    ajustarOverlay();
    atualizarTimer();

});

/* EVENTOS DE JANELA */

$(window).on("resize", ajustarOverlay);

$(window).on("orientationchange", function () {

    setTimeout(ajustarOverlay, 300);

});

$(document).on("fullscreenchange", function () {

    setTimeout(ajustarOverlay, 300);

});



/* ==========================================
EVENTOS POR TEMPO DO VÍDEO
========================================== */

const eventosVideo = [];
const eventosExecutados = new Set();

let ultimoTempo = 0;

function aoChegarNoTempo(tempo, funcao, repetir = false) {

    eventosVideo.push({
        tempo,
        funcao,
        repetir
    });

}

function verificarEventosVideo() {

    const tempoAtual = video.currentTime;

    if (tempoAtual < ultimoTempo) {

        $.each(eventosVideo, function (indice, evento) {

            if (evento.repetir) {

                eventosExecutados.delete(indice);

            }

        });

    }

    $.each(eventosVideo, function (indice, evento) {

        if (
            tempoAtual >= evento.tempo &&
            !eventosExecutados.has(indice)
        ) {

            evento.funcao();

            eventosExecutados.add(indice);

        }

    });

    ultimoTempo = tempoAtual;

}

/* ==========================================
LOOP DE VÍDEO
========================================== */

function iniciarLoopVideo(inicio, fim) {

    if (loopInterval) {

        clearInterval(loopInterval);

    }

    loopInterval = setInterval(function () {

        if (video.currentTime >= fim) {

            video.currentTime = inicio;

        }

    }, 50);

}

function pararLoopVideo() {

    if (loopInterval) {

        clearInterval(loopInterval);

        loopInterval = null;

    }

}

/* ==========================================
VÍDEO SOBREPOSTO
========================================== */

function reproduzirVideoSobreposto(caminhoVideo, aoFinalizar) {

    const tempoOriginal = video.currentTime;

    video.pause();

    const $videoOverlay = $("<video>", {
        src: caminhoVideo
    });

    $videoOverlay.css({
        position: "absolute",
        left: "0",
        top: "0",
        width: "100%",
        height: "100%",
        objectFit: "contain",
        zIndex: "2"
    });

    $("#player-container").append($videoOverlay);

    const videoOverlay = $videoOverlay[0];

    videoOverlay.play();

    $videoOverlay.one("ended", function () {

        $videoOverlay.remove();

        video.currentTime = tempoOriginal;

        video.play();

        if (aoFinalizar) {

            aoFinalizar();

        }

    });

}

