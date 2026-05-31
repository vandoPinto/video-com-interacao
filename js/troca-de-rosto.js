$(() => {

    let webcamFile = null;
    let targetFile = null;
    let stream = null;

    // =========================
    // Upload da imagem do usuário
    // =========================
    $("#userImage").on("change", function () {

        const file = this.files[0];

        if (!file) return;

        if (stream) {

            stream.getTracks().forEach(track => track.stop());

            $("#webcam")[0].srcObject = null;

            stream = null;

        }

        webcamFile = null;

        $("#previewUser")
            .attr("src", URL.createObjectURL(file))
            .show();

    });

    // =========================
    // Upload da imagem base
    // =========================
    $("#targetImageUpload").on("change", function () {

        const file = this.files[0];

        if (!file) return;

        targetFile = file;

        $("#targetImage")
            .attr("src", URL.createObjectURL(file));

    });

    // =========================
    // Abrir câmera
    // =========================
    $("#startCamera").on("click", async function () {

        try {

            $("#webcam").show();

            stream = await navigator.mediaDevices.getUserMedia({
                video: true
            });

            $("#webcam")[0].srcObject = stream;

        } catch (erro) {

            alert("Não foi possível acessar a câmera.");

            console.error(erro);

        }

    });

    // =========================
    // Tirar foto
    // =========================
    $("#capturePhoto").on("click", function () {

        const video = $("#webcam")[0];

        if (!video.srcObject) {

            alert("Abra a câmera primeiro.");

            return;

        }

        const canvas = $("#canvas")[0];

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const ctx = canvas.getContext("2d");

        ctx.drawImage(video, 0, 0);

        canvas.toBlob(function (blob) {

            webcamFile = new File(
                [blob],
                "webcam.jpg",
                {
                    type: "image/jpeg"
                }
            );

            $("#previewUser")
                .attr("src", URL.createObjectURL(blob))
                .show();

            // Desliga câmera
            if (stream) {

                stream.getTracks().forEach(track => track.stop());

                $("#webcam")[0].srcObject = null;

                stream = null;

            }

            $("#webcam").hide();

        }, "image/jpeg", 0.95);

    });

    // =========================
    // Face Swap
    // =========================
    $("#swapButton").on("click", async function () {

        try {

            const uploadFile =
                $("#userImage")[0].files[0];

            const sourceFile =
                webcamFile || uploadFile;

            if (!sourceFile) {

                alert(
                    "Selecione uma imagem ou tire uma foto."
                );

                return;

            }

            $("#loading").show();

            $("#resultContainer").html(`
                <h2>Resultado</h2>
                <div id="resultsGrid"
                    style="
                        display:flex;
                        flex-wrap:wrap;
                        gap:15px;
                    ">
                </div>
            `);

            // =========================
            // Lista de imagens padrão
            // =========================
            const imagensBase = [
                "../arquivos/imagens/cena1.png",
                "../arquivos/imagens/cena2.png",
                "../arquivos/imagens/cena3.png",
                "../arquivos/imagens/casa.jpg"
            ];

            // Se o usuário escolheu uma imagem base,
            // ela entra primeiro na fila
            if (targetFile) {

                imagensBase.unshift(targetFile);

            }

            // =========================
            // Processa todas as imagens
            // =========================
            for (const imagemBase of imagensBase) {

                try {

                    let targetBlob;

                    if (imagemBase instanceof File) {

                        targetBlob = imagemBase;

                    } else {

                        const response =
                            await fetch(imagemBase);

                        targetBlob =
                            await response.blob();

                    }

                    const form = new FormData();

                    form.append(
                        "source_image",
                        sourceFile
                    );

                    form.append(
                        "target_image",
                        targetBlob,
                        targetBlob.name || "imagem.jpg"
                    );

                    form.append(
                        "source_url",
                        ""
                    );

                    form.append(
                        "target_url",
                        ""
                    );

                    form.append(
                        "face_index",
                        "0"
                    );

                    const resultado =
                        await $.ajax({

                            async: true,

                            crossDomain: true,

                            url: "https://deepfake-face-swap-ai.p.rapidapi.com/target-face",

                            method: "POST",

                            headers: {
                                "x-rapidapi-key":
                                    API_KEY,

                                "x-rapidapi-host":
                                    "deepfake-face-swap-ai.p.rapidapi.com"
                            },

                            processData: false,

                            contentType: false,

                            data: form

                        });

                    let resposta = resultado;

                    try {

                        resposta =
                            typeof resultado === "string"
                                ? JSON.parse(resultado)
                                : resultado;

                    } catch (e) { }

                    const imageUrl =
                        resposta.image_url ||
                        resposta.result_url ||
                        resposta.image;

                    if (imageUrl) {

                        $("#resultsGrid").append(`
                            <div style="
                                display:flex;
                                flex-direction:column;
                                align-items:center;
                            ">
                                <img
                                    src="${imageUrl}"
                                    style="
                                        width:300px;
                                        border:1px solid #ccc;
                                        border-radius:8px;
                                    "
                                >
                            </div>
                        `);

                    }

                }
                catch (erroCena) {

                    console.error(
                        "Erro na cena:",
                        imagemBase,
                        erroCena
                    );

                }

            }

            $("#loading").hide();

        }
        catch (erro) {

            $("#loading").hide();

            console.error(erro);

            alert(
                "Erro: " + erro.message
            );

        }

    });

});