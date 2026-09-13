const closeButton = document.querySelector(".close");

if (closeButton) {
  closeButton.addEventListener("click", () => {
    if (window.location.href.includes("delete")) {
      window.location.href = window.location.href.replace("/delete", "");
    }
    if (window.location.href.includes("update")) {
      window.location.href = window.location.href.replace("/update", "");
    }
  });
}
