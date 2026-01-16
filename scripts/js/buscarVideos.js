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
        if (videos.length === 0)
            return;
        videos.forEach((video) => {
            const tituloVideo = video.querySelector(".titulo-video");
            if (!tituloVideo) {
                console.error(`Título não encontrado para vídeo de id ${video.id}`);
                return;
            }
            if (!this.inputBusca || !this.inputBusca.value)
                return;
            let titulo = tituloVideo.textContent.toLowerCase();
            let valorFiltro = this.inputBusca.value.toLowerCase();
            video.style.display = valorFiltro ? (titulo.includes(valorFiltro) ? "block" : "none") : "block";
            /*
            First condition (valorFiltro ?): Checks if there's a search value
            If valorFiltro is empty/null/undefined → display is set to "block" (show all videos)
      
            Second condition (nested): If valorFiltro exists, checks if the video title contains the search term
      
            titulo.includes(valorFiltro) returns true → display is set to "block" (show video)
            titulo.includes(valorFiltro) returns false → display is set to "none" (hide video)
            */
            // Original:
            // if (!titulo.includes(valorFiltro)) {
            //   video.style.display = "none";
            // } else {
            //   video.style.display = "block";
            // }
        });
    }
}
//# sourceMappingURL=buscarVideos.js.map