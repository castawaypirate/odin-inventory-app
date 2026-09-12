const closeButton = document.querySelector(".close");

if (closeButton) {
  closeButton.addEventListener("click", () => {
    window.location.href = window.location.href.replace("/delete", "");
  });
}
