

function mostrarOpcoes() {
    console.log("mostrarOpcoes");
    const $caixaExemplo = $(".caixa-exemplo");

    $caixaExemplo.css("display", "flex");

    iniciarLoopVideo(25.615, 26.300);

    function removerEventosOpcoes() {

        $("#opcao_1").off("click");
        $("#opcao_2").off("click");
        $("#opcao_3").off("click");
        $("#opcao_4").off("click");

    }

    $("#opcao_1")
        .off("click")
        .on("click", function () {

            removerEventosOpcoes();

            reproduzirVideoSobreposto("./arquivos/videos/sei.mp4", function () {

                pararLoopVideo();

                $caixaExemplo.hide();

                video.currentTime = 28.000;

            });

        });

    $("#opcao_2")
        .off("click")
        .on("click", function () {

            removerEventosOpcoes();

            console.log("será 2");

            reproduzirVideoSobreposto("./arquivos/videos/sera.mp4", function () {

                pararLoopVideo();

                $caixaExemplo.hide();

                video.currentTime = 28.000;

            });

        });

    $("#opcao_3")
        .off("click")
        .on("click", function () {

            removerEventosOpcoes();

            console.log("será 3");

            reproduzirVideoSobreposto("./arquivos/videos/sera.mp4", function () {

                pararLoopVideo();

                $caixaExemplo.hide();

                video.currentTime = 28.000;

            });

        });

    $("#opcao_4")
        .off("click")
        .on("click", function () {

            removerEventosOpcoes();

            console.log("muito tempo");

            reproduzirVideoSobreposto("./arquivos/videos/muito_tempo.mp4", function () {

                pararLoopVideo();

                $caixaExemplo.hide();

                video.currentTime = 28.000;

            });

        });

}

function iniciar() {

    const $caixaIniciar = $(".caixa-iniciar");

    $caixaIniciar.css("display", "flex");

    pararLoopVideo();

    iniciarLoopVideo(
        62.27,
        63.08
    );

    $("#iniciar")
        .off("click")
        .on("click", function () {

            pararLoopVideo();
            video.currentTime = 64.00;
            // video.play();

            $caixaIniciar.hide();

        });

}

/* CONTROLE */

aoChegarNoTempo(22.042, mostrarOpcoes);

aoChegarNoTempo(60.00, iniciar);