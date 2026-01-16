export class VideosAPI {
    isBlank = (value) => value == null || (typeof value === "string" && value.trim() === "");
    /*
      v == null -> Returns "true" if the value is null or undefined
      typeof v === "string" && v.trim() === "" -> Returns "true" if the value is a string AND it's empty after removing whitespace
  
      it returns "true" if the value is null, undefined, or an empty/whitespace-only string, and "false" otherwise
    */
    missingProperties = (video) => {
        const required = ["titulo", "descricao", "url", "imagem", "categoria"];
        /* TypeScript will catch if you misspell a field name or if the Video interface changes,
        since the array must match keyof Video
         */
        return required.filter((key) => this.isBlank(video[key]));
    };
    preencherCamposVazios = (video) => {
        const placeholderImage = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23d3d3d3' width='100' height='100'/%3E%3Ctext x='50' y='50' font-size='12' fill='%23000' text-anchor='middle' dy='.3em'%3E[Sem imagem]%3C/text%3E%3C/svg%3E";
        const placeholderVideo = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200'%3E%3Crect fill='%23d3d3d3' width='600' height='400'/%3E%3Ctext x='150' y='100' font-size='24' fill='%23000' text-anchor='middle' dy='.3em'%3EErro ao carregar video%3C/text%3E%3C/svg%3E";
        if (!video.titulo)
            video.titulo = "[Erro ao carregar título]";
        if (!video.descricao)
            video.descricao = "[Erro ao carregar descrição]";
        if (!video.categoria)
            video.categoria = "[Categoria ausente]";
        if (!video.imagem)
            video.imagem = placeholderImage;
        if (!video.url)
            video.url = "https://placehold.co/700x400/lightgrey/black?text=[Erro+ao+carregar+vídeo]";
    };
    async obterVideosDaAPI() {
        try {
            const busca = await fetch("http://localhost:3000/videos");
            if (!busca.ok)
                throw new Error(`HTTP ${busca.status}`);
            const videos = await busca.json();
            if (!videos)
                throw new Error("Nenhum vídeo foi encontrado.");
            console.log("videos:", videos);
            videos.forEach((video) => {
                const missing = this.missingProperties(video);
                if (missing.length) {
                    console.warn(`Vídeo de id ${video.id} com campo(s) ausente(s): ${missing.join(", ")} \nTítulo: ${video.titulo ?? "(sem título)"}`);
                }
                this.preencherCamposVazios(video);
            });
            return videos;
        }
        catch (error) {
            console.error("Erro ao buscar vídeos:", error);
            throw error; // Propagate error so main.ts can handle UI feedback
        }
    }
}
//# sourceMappingURL=obterVideosDaAPI.js.map