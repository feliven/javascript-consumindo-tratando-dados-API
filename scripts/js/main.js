const containerVideos = document.querySelector(".videos__container");
async function obterVideos() {
    try {
        const busca = await fetch("http://localhost:3000/videos");
        const videos = await busca.json();
        console.log("videos:", videos);
        videos.forEach((video) => {
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
    }
    catch (error) {
        if (containerVideos) {
            containerVideos.innerHTML = `<p> Houve um erro ao carregar os vídeos: ${error} </p>`;
        }
        else {
            console.error("Erro ao buscar vídeos:", error);
        }
    }
}
obterVideos();
export {};
//# sourceMappingURL=main.js.map