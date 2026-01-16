export class BuscarVideos {
    inputBusca = document.querySelector(".pesquisar__input");
    constructor() {
        if (this.inputBusca) {
            this.inputBusca.addEventListener("input", () => this.filtrarBusca());
        }
        else {
            console.warn("Input do campo de busca não foi encontrado! Confira o código HTML");
        }
    }
    filtrarBusca() {
        const videos = document.querySelectorAll(".videos__item");
        if (!this.inputBusca || !this.inputBusca.value || videos.length === 0)
            return;
        for (let video of videos) {
            const tituloVideo = video.querySelector(".titulo-video");
            if (!tituloVideo) {
                console.error(`Título não encontrado para vídeo de id ${video.id}`);
                continue; // usar continue ao invés de return para não parar o loop inteiro
            }
            let titulo = tituloVideo.textContent.toLowerCase();
            let valorFiltro = this.inputBusca.value.toLowerCase();
            if (!titulo.includes(valorFiltro)) {
                video.style.display = "none";
            }
            else {
                video.style.display = "block";
            }
        }
    }
}
//# sourceMappingURL=buscarVideos.js.map