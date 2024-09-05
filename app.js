import { typeThemeMap } from "./JavaScript/typeThemeMap.mjs";

document.querySelector("md-tabs").addEventListener("change", async (e) => {
  const type = e.target.activeTab.textContent.trim();
  const style = document.createElement("style");
  style.innerHTML = typeThemeMap.get(type);
  document.head.appendChild(style);
  await fetchJSON(type);
});

const fetchJSON = async (type = "water") => {
  const response = await fetch(`./Data/${type.toLowerCase()}.json`);
  const jsonData = await response.json();
  jsonData.forEach((data, index) => {
    createUI(data, index);
  });
};

const createUI = (data, index) => {
  console.log(data, index);
  const template = document.querySelector("template");
  const clone = template.content.cloneNode(true);
  const article = clone.querySelector("article");
  article.dataset.rank = "#" + ++index;
  article.dataset.variant = data.variant[0]?.toLowerCase();

  const h2 = article.querySelector("h2");
  h2.textContent = data.pokemon;
  const img = article.querySelector("img");
  img.src = `https://img.pokemondb.net/sprites/home/normal/${data.imageName}.png`;
  img.alt = data.pokemon;
  document.querySelector("div[role='region'").appendChild(article);
};
