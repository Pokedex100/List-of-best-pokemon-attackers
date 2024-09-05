import { typeThemeMap } from "./JavaScript/typeThemeMap.mjs";

document.querySelector("md-tabs").addEventListener("change", (e) => {
  const type = e.target.activeTab.textContent.trim();
  const style = document.createElement("style");
  style.innerHTML = typeThemeMap.get(type);
  document.head.appendChild(style);
  fetchJSON(type);
});

const fetchJSON = (type = "water") => {};
