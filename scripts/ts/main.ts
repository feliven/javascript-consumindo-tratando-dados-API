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
  if (!video.titulo) video.titulo = "[Erro ao carregar título]";
  if (!video.descricao) video.descricao = "[Erro ao carregar descrição]";
  if (!video.categoria) video.categoria = "[Categoria ausente]";
};

async function obterVideos() {
  if (!containerVideos) return;

  try {
    const busca = await fetch("http://localhost:3000/videos");
    if (!busca.ok) throw new Error(`HTTP ${busca.status}`);

    const videos = await busca.json();
    console.log("videos:", videos);

    videos.forEach((video: Video) => {
      const missing = missingProperties(video);
      if (missing.length) {
        console.log(
          `Vídeo de id ${video.id} com campo(s) ausente(s): ${missing.join(", ")} \nTítulo: ${
            video.titulo ?? "(sem título)"
          }`
        );
      }

      if (!video.url) return;

      preencherCamposVazios(video);

      containerVideos.innerHTML += `
          <li class="videos__item">
          <iframe src="${video.url}" title="${video.titulo}" frameborder="0" allowfullscreen></iframe>
          <div class="descricao-video">
              <img class="img-canal" src="${video.imagem}" alt="Logo do Canal" />
              <h3 class="titulo-video">${video.titulo}</h3>
              <p class="titulo-canal">${video.descricao}</p>
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
