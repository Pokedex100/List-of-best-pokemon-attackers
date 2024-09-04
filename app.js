document.querySelector("md-tabs").addEventListener("change", (e) => {
  console.log(e.target.activeTab.textContent);
});
