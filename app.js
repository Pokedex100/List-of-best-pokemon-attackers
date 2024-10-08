import { typeThemeMap } from "./JavaScript/typeThemeMap.mjs";

const template = document.querySelector("template");

document.addEventListener("DOMContentLoaded", () => {
  fetchJSON();
  document.body.classList.add("loaded");
});

document.querySelector("md-tabs").addEventListener("change", async (e) => {
  const type = e.target.activeTab.textContent.trim();
  const style = document.createElement("style");
  style.innerHTML = typeThemeMap.get(type);
  document.head.appendChild(style);
  document.querySelector("main").innerHTML = "";
  await fetchJSON(type);
});

const fetchJSON = async (type = "water") => {
  const response = await fetch(`./Data/${type.toLowerCase()}.json`);
  const jsonData = await response.json();
  const parent = document.createElement("div");

  parent.setAttribute("role", "region");
  parent.setAttribute("aria-live", "polite");
  parent.setAttribute("aria-atomic", "true");
  parent.setAttribute("tabindex", "0");

  jsonData.forEach((data, index) => {
    createUI(data, index, parent);
  });
  document.querySelector("main").appendChild(parent);
};

const createUI = (data, index, parent) => {
  const clone = template.content.cloneNode(true);
  const article = clone.querySelector("article");
  article.dataset.rank = "#" + ++index;
  article.dataset.variant = data.variant[0]?.toLowerCase();

  const h2 = article.querySelector("h2");
  h2.textContent = data.pokemon;
  const img = article.querySelector("img");
  img.src = `https://img.pokemondb.net/sprites/home/normal/${data.imageName}.png`;
  img.alt = data.pokemon;
  parent.appendChild(article);

  const firstChips = article.querySelectorAll(".fast md-assist-chip");
  data.first_move.forEach((move, index) => {
    moveAssign(firstChips, move, index);
  });
  if (data.first_move.length === 1) {
    firstChips[1].remove();
  }

  const secondChips = article.querySelectorAll(".charged md-assist-chip");
  data.second_move.forEach((move, index) => {
    moveAssign(secondChips, move, index);
  });
  if (data.second_move.length === 1) {
    secondChips[1].remove();
  }
};

const moveAssign = (chips, move, index) => {
  chips[index].label = move.replace(/\(.*/, "").replace("*", "");
  const img = chips[index].querySelector("img");
  const type = move.replace(/.*\(([^)]+)\).*/, "$1");
  img.src = `./icons/${type}.svg`;
  img.alt = `${type} type icon`;
  img.classList.add(type);
  if (move.includes("*")) chips[index].dataset.legacy = "true";
};

document.querySelector("md-switch").addEventListener("change", (e) => {
  switchAnimation(e);
});

const switchAnimation = (e) => {
  if (e.target.selected) document.body.classList.remove("reduced");
  else document.body.classList.add("reduced");
  localStorage.setItem("animation", e.target.selected.toString());
};

if (localStorage.getItem("animation") === "true") {
  document.querySelector("md-switch").click();
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("./service-worker.js")
      .then((registration) => {
        console.log(
          "Service Worker registered with scope:",
          registration.scope
        );
      })
      .catch((error) => {
        console.error("Service Worker registration failed:", error);
      });
  });
}
