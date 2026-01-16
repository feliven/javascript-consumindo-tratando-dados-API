export class BuscarVideos {
  private inputBusca: HTMLInputElement | null = document.querySelector(".pesquisar__input");

  constructor() {
    if (this.inputBusca) {
      this.inputBusca.addEventListener("input", () => this.filtrarBusca());
    } else {
      console.warn("Input do campo de busca não foi encontrado! Confira o código HTML");
    }
  }

  public filtrarBusca() {
    const videos: NodeListOf<HTMLLIElement> = document.querySelectorAll(".videos__item");

    if (!this.inputBusca || !this.inputBusca.value || videos.length === 0) return;

    for (let video of videos) {
      const tituloVideo: HTMLHeadingElement | null = video.querySelector(".titulo-video");

      if (!tituloVideo) {
        console.error(`Título não encontrado para vídeo de id ${video.id}`);
        return;
      }

      let titulo = tituloVideo.textContent.toLowerCase();
      let valorFiltro = this.inputBusca.value.toLowerCase();

      if (!titulo.includes(valorFiltro)) {
        video.style.display = "none";
      } else {
        video.style.display = "block";
      }
    }
  }
}
