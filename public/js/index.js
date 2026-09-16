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

const searchForm = document.querySelector(".search-form");
searchForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = [...new FormData(searchForm)];
  let urlParams = "";
  if (window.location.search) {
    let params = new URLSearchParams(window.location.search);
    const paramsArray = [...params];

    paramsArray.forEach(([key, value], index, array) => {
      if (key !== "search") {
        if (index < array.length - 1) {
          urlParams += `${key}=${value}&`;
        } else {
          urlParams += `${key}=${value}`;
        }
      }
    });

    if (urlParams.endsWith("&")) {
      urlParams = urlParams.slice(0, -1);
    }
  }

  let formParams = "";
  if (formData[0][1] !== "") {
    formParams = `${formData[0][0]}=${formData[0][1]}`;
  }
  if (urlParams !== "" && formParams !== "") {
    window.location.href = `${window.location.origin}/search?${urlParams}&${formParams}`;
  } else if (urlParams !== "" && formParams === "") {
    window.location.href = `${window.location.origin}/search?${urlParams}`;
  } else {
    window.location.href = `${window.location.origin}/search?${formParams}`;
  }
});

const sideForm = document.querySelector(".side-form");
sideForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const formArray = [...new FormData(sideForm)];

  let excludeArr = [];
  if (formArray.length === 0) {
    excludeArr.push("genres");
    excludeArr.push("publishers");
    excludeArr.push("developers");
  }

  let urlParams = "";
  if (window.location.search) {
    let params = new URLSearchParams(window.location.search);
    const paramsArray = [...params];

    paramsArray.forEach(([key, value]) => {
      if (key === "search") {
        urlParams = `${key}=${value}`;
      }
    });
  }

  let formParams = "";
  formArray.forEach(([key, value], index, array) => {
    if (index < array.length - 1) {
      formParams += `${key}=${value}&`;
    } else {
      formParams += `${key}=${value}`;
    }
  });

  let finalParams = "";
  if (urlParams !== "") {
    finalParams += urlParams;
  }
  if (formParams !== "") {
    if (finalParams === "") {
      finalParams += formParams;
    } else {
      finalParams += "&" + formParams;
    }
  }

  window.location.href = `${window.location.origin}/search?${finalParams}`;
});
