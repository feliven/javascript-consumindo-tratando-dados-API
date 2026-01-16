import { VideosAPI } from "./obterVideos.js";
import { BuscarVideos } from "./buscarVideos.js";

const videosAPI = new VideosAPI();
videosAPI.obterVideosDaAPI();

const buscarVideos = new BuscarVideos();
buscarVideos.filtrarBusca();

const botaoCategoria: NodeListOf<HTMLAnchorElement> = document.querySelectorAll(".superior__item");

/*
querySelectorAll() never returns null. It always returns a NodeList, even if no elements match the selector. When no elements are found, it returns an empty NodeList (with length 0), not null. This is different from querySelector(), which returns null when no element is found.

You should check .length instead of checking for null when using querySelectorAll().
*/

if (botaoCategoria.length != 0) {
  botaoCategoria.forEach((botao) => {
    let nomeCategoria = botao.getAttribute("name");

    if (!nomeCategoria) return;

    botao.addEventListener("click", () => filtrarPorCategoria(nomeCategoria));
  });
}

function filtrarPorCategoria(filtro: string) {
  const videos: NodeListOf<HTMLLIElement> = document.querySelectorAll(".videos__item");

  if (videos.length === 0) return;

  for (let video of videos) {
    const categoriaVideo: HTMLParagraphElement | null = video.querySelector(".categoria");

    if (!categoriaVideo) return;

    let categoria = categoriaVideo.textContent.toLowerCase();
    let valorFiltro = filtro.toLowerCase();

    if (!categoria.includes(valorFiltro) && valorFiltro != "tudo") {
      video.style.display = "none";
    } else {
      video.style.display = "block";
    }
  }
}
