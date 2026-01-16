import { VideosAPI } from "./obterVideosDaAPI.js";
import { BuscarVideos } from "./buscarVideos.js";
import { FiltrarPorCategoria } from "./filtrarCategoria.js";
import { renderizarVideos, renderizarErro } from "./renderizarVideos.js";

const containerVideos: HTMLUListElement | null = document.querySelector(".videos__container");

const iniciarApp = async () => {
  if (!containerVideos) {
    alert("Erro ao carregar vídeos.");
    console.error("Container para vídeos não existe! Confira o código HTML");
    return;
  }

  const videosAPI = new VideosAPI();

  try {
    const videos = await videosAPI.obterVideosDaAPI();
    renderizarVideos(videos, containerVideos);

    // Inicializa as funcionalidades de interação apenas DEPOIS que a renderização ocorre
    new BuscarVideos();
    new FiltrarPorCategoria();
  } catch (error) {
    renderizarErro(error, containerVideos);
  }
};

iniciarApp();
