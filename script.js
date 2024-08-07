document.addEventListener("DOMContentLoaded", function () {
  const feedContainer = document.getElementById("feed");
  const loader = document.getElementById("loader");
  const error = document.getElementById("error");

  function fetchInstagramFeed() {
    loader.style.display = "block";
    fetch("https://us-central1-squid-apis.cloudfunctions.net/test-front-basic")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erro na rede");
        }
        return response.json();
      })
      .then((data) => {
        loader.style.display = "none";
        if (Array.isArray(data)) {
          renderFeed(data);
        } else {
          throw new Error("Formato de dados inválido");
        }
      })
      .catch((err) => {
        loader.style.display = "none";
        error.style.display = "block";
        error.textContent =
          "Erro ao carregar o feed. Tente novamente mais tarde.";
        console.error(err);
      });
  }

  function renderFeed(data) {
    data.forEach((item) => {
      const feedItem = document.createElement("div");
      feedItem.classList.add("feed-item");

      const imgElement = document.createElement("img");
      imgElement.src = item.imagens.resolucaoPadrao.url;
      imgElement.alt = item.legenda;
      imgElement.addEventListener("click", () => {
        window.open(item.link, "_blank");
      });

      const overlay = document.createElement("div");
      overlay.classList.add("overlay");

      const ul = document.createElement("ul");

      const usernameLi = document.createElement("li");
      usernameLi.innerHTML = ` @${item.usuario.username}`;
      ul.appendChild(usernameLi);

      const likesLi = document.createElement("li");
      likesLi.innerHTML = `<img src="assets/heart-icon.svg" alt="Heart Icon"> ${item.upvotes}`;
      ul.appendChild(likesLi);

      const commentsLi = document.createElement("li");
      commentsLi.innerHTML = `<img src="assets/comment-icon.svg" alt="Comment Icon"> ${item.comentarios}`;
      ul.appendChild(commentsLi);

      const dateLi = document.createElement("li");
      const formattedDate = new Date(item.criadoEm).toLocaleString("pt-BR", {
        dateStyle: "short",
        timeStyle: "short",
      });
      dateLi.innerHTML = `<img src="assets/date-icon.svg" alt="Date Icon"> ${formattedDate}`;
      ul.appendChild(dateLi);

      overlay.appendChild(ul);
      feedItem.appendChild(imgElement);
      feedItem.appendChild(overlay);
      feedContainer.appendChild(feedItem);
    });
  }

  fetchInstagramFeed();
});
