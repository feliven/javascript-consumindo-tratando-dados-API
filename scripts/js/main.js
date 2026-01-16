import { VideosAPI } from "./obterVideos.js";
import { BuscarVideos } from "./buscarVideos.js";
import { FiltrarPorCategoria } from "./filtrarCategoria.js";
const videosAPI = new VideosAPI();
videosAPI.obterVideosDaAPI();
const buscarVideos = new BuscarVideos();
buscarVideos.filtrarBusca();
new FiltrarPorCategoria();
//# sourceMappingURL=main.js.map