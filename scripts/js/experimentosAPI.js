const enderecoAPI = fetch("http://localhost:3000/videos");
console.log("api:", enderecoAPI);
const resposta = fetch("http://localhost:3000/videos").then((resposta) => {
    console.log("resposta:", resposta);
});
const testeAPI = fetch("http://localhost:3000/videos").then((resposta) => {
    console.log("JSON:", resposta.json());
});
const obtendoVideos = fetch("http://localhost:3000/videos").then((resposta) => {
    resposta.json().then((videos) => console.log("teste:", videos));
});
const obtendoVideos2 = fetch("http://localhost:3000/videos").then((resposta) => {
    try {
        resposta.json().then((videos) => console.log("teste2:", videos));
    }
    catch (error) {
        console.log("erro2:", error);
        throw new Error();
    }
});
const obtendoVideos3 = fetch("http://localhost:3000/videos")
    .then((resposta) => {
    if (!resposta.ok) {
        throw new Error(`HTTP error! status: ${resposta.status}`);
    }
    return resposta.json();
})
    .then((videos) => {
    console.log("teste3:", videos);
    return videos;
})
    .catch((error) => {
    console.log("erro3:", error);
    throw error;
});
export {};
//# sourceMappingURL=experimentosAPI.js.map