import type { Video } from "./Video";

const containerVideos = document.querySelector(".videos__container");

const isBlank = (value: unknown) => value == null || (typeof value === "string" && value.trim() === "");

/*
v == null -> Returns "true" if the value is null or undefined
typeof v === "string" && v.trim() === "" -> Returns "true" if the value is a string AND it's empty after removing whitespace

it returns "true" if the value is null, undefined, or an empty/whitespace-only string, and "false" otherwise
*/

const missingProperties = (video: Partial<Video>) => {
  const required: Array<keyof Video> = ["titulo", "descricao", "url", "imagem", "categoria"];
  /* TypeScript will catch if you misspell a field name or if the Video interface changes, since the array must match keyof Video
   */
  return required.filter((key) => isBlank(video[key]));
};

const preencherCamposVazios = (video: Video) => {
  const placeholderImage =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23d3d3d3' width='100' height='100'/%3E%3Ctext x='50' y='50' font-size='12' fill='%23000' text-anchor='middle' dy='.3em'%3E[Sem imagem]%3C/text%3E%3C/svg%3E";
  const placeholderVideo =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200'%3E%3Crect fill='%23d3d3d3' width='600' height='400'/%3E%3Ctext x='150' y='100' font-size='24' fill='%23000' text-anchor='middle' dy='.3em'%3EErro ao carregar video%3C/text%3E%3C/svg%3E";

  if (!video.titulo) video.titulo = "[Erro ao carregar título]";
  if (!video.descricao) video.descricao = "[Erro ao carregar descrição]";
  if (!video.categoria) video.categoria = "[Categoria ausente]";
  if (!video.imagem) video.imagem = placeholderImage;
  if (!video.url) video.url = "https://placehold.co/600x400/lightgrey/black?text=[Erro+ao+carregar+vídeo]";
};

async function obterVideos() {
  if (!containerVideos) {
    alert("Erro ao carregar vídeos.");
    console.error("Container para vídeos não existe! Confira o código HTML");
    return;
  }

  try {
    const busca = await fetch("http://localhost:3000/videos");
    if (!busca.ok) throw new Error(`HTTP ${busca.status}`);

    const videos = await busca.json();
    // if (!videos) throw new Error("Nenhum vídeo foi encontrado.");

    console.log("videos:", videos);

    videos.forEach((video: Video) => {
      const missing = missingProperties(video);
      if (missing.length) {
        console.warn(
          `Vídeo de id ${video.id} com campo(s) ausente(s): ${missing.join(", ")} \nTítulo: ${
            video.titulo ?? "(sem título)"
          }`
        );
      }

      preencherCamposVazios(video);

      containerVideos.innerHTML += `
          <li class="videos__item">
          <iframe src="${video.url}" title="${video.titulo}" frameborder="0" allowfullscreen></iframe>
          <div class="descricao-video">
              <img class="img-canal" src="${video.imagem}" alt="Logo do Canal" />
              <h3 class="titulo-video">${video.titulo}</h3>
              <p class="titulo-canal">${video.descricao}</p>
              <p class="categoria" hidden>${video.categoria}</p>
          </div>
          </li>
        `;
    });
  } catch (error) {
    if (containerVideos) {
      containerVideos.innerHTML = `<p> Houve um erro ao carregar os vídeos: ${error} </p>`;
    } else {
      console.error("Erro ao buscar vídeos:", error);
    }
  }
}

obterVideos();

const inputBusca: HTMLInputElement | null = document.querySelector(".pesquisar__input");

function filtrarBusca() {
  if (inputBusca) {
    inputBusca.addEventListener("input", filtrarBusca);
  } else {
    console.warn("Input do campo de busca não foi encontrado! Confira o código HTML");
    return;
  }

  const videos: NodeListOf<HTMLLIElement> = document.querySelectorAll(".videos__item");

  if (!inputBusca.value || videos.length === 0) return;

  for (let video of videos) {
    const tituloVideo: HTMLHeadingElement | null = video.querySelector(".titulo-video");

    if (!tituloVideo) {
      console.error(`Título não encontrado para vídeo de id ${video.id}`);
      return;
    }

    let titulo = tituloVideo.textContent.toLowerCase();
    let valorFiltro = inputBusca.value.toLowerCase();

    if (!titulo.includes(valorFiltro)) {
      video.style.display = "none";
    } else {
      video.style.display = "block";
    }
  }
}

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
  }
}
