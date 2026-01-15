import type { Video } from "./Video";

const containerVideos = document.querySelector(".videos__container");

const isBlank = (v: unknown) => v == null || (typeof v === "string" && v.trim() === "");

const missingProperties = (video: Partial<Video>) => {
  const required: Array<keyof Video> = ["titulo", "descricao", "url", "imagem", "categoria"];
  return required.filter((key) => isBlank(video[key]));
};

async function obterVideos() {
  try {
    const busca = await fetch("http://localhost:3000/videos");
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

      if (containerVideos) {
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
      }
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
