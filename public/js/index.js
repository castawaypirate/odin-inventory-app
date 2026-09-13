const closeButton = document.querySelector(".close");

if (closeButton) {
  closeButton.addEventListener("click", () => {
    if (window.location.href.includes("create")) {
      window.location.href = window.location.href.replace("/create", "");
    }
  });
}

const cards = document.querySelectorAll(".card");
for (const card of cards) {
  card.addEventListener("click", () => {
    window.location.href = `/game/${card.dataset.id}`;
  });
}
