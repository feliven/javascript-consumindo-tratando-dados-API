import { VideosAPI } from "./obterVideos.js";
const videosAPI = new VideosAPI();
videosAPI.obterVideosDaAPI();
const inputBusca = document.querySelector(".pesquisar__input");
if (inputBusca) {
    inputBusca.addEventListener("input", filtrarBusca);
}
else {
    console.warn("Input do campo de busca não foi encontrado! Confira o código HTML");
}
function filtrarBusca() {
    const videos = document.querySelectorAll(".videos__item");
    if (!inputBusca || !inputBusca.value || videos.length === 0)
        return;
    for (let video of videos) {
        const tituloVideo = video.querySelector(".titulo-video");
        if (!tituloVideo) {
            console.error(`Título não encontrado para vídeo de id ${video.id}`);
            return;
        }
        let titulo = tituloVideo.textContent.toLowerCase();
        let valorFiltro = inputBusca.value.toLowerCase();
        if (!titulo.includes(valorFiltro)) {
            video.style.display = "none";
        }
        else {
            video.style.display = "block";
        }
    }
}
const botaoCategoria = document.querySelectorAll(".superior__item");
/*
querySelectorAll() never returns null. It always returns a NodeList, even if no elements match the selector. When no elements are found, it returns an empty NodeList (with length 0), not null. This is different from querySelector(), which returns null when no element is found.

You should check .length instead of checking for null when using querySelectorAll().
*/
if (botaoCategoria.length != 0) {
    botaoCategoria.forEach((botao) => {
        let nomeCategoria = botao.getAttribute("name");
        if (!nomeCategoria)
            return;
        botao.addEventListener("click", () => filtrarPorCategoria(nomeCategoria));
    });
}
function filtrarPorCategoria(filtro) {
    const videos = document.querySelectorAll(".videos__item");
    if (videos.length === 0)
        return;
    for (let video of videos) {
        const categoriaVideo = video.querySelector(".categoria");
        if (!categoriaVideo)
            return;
        let categoria = categoriaVideo.textContent.toLowerCase();
        let valorFiltro = filtro.toLowerCase();
        if (!categoria.includes(valorFiltro) && valorFiltro != "tudo") {
            video.style.display = "none";
        }
        else {
            video.style.display = "block";
        }
    }
}
//# sourceMappingURL=main.js.map