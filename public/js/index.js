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

  // remove from URLSearchParams keys of formdata
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
  }

  let formParams = "";
  if (formData[0][1] !== "") {
    formParams = `${formData[0][0]}=${formData[0][1]}`;
  }
  if (urlParams !== "" && formParams) {
    window.location.href = `${window.location.origin}/search?${urlParams}&${formParams}`;
  } else if (urlParams && formParams === "") {
    window.location.href = `${window.location.origin}/search?${urlParams}`;
  } else {
    window.location.href = `${window.location.origin}/search?${formParams}`;
  }
});

const sideForms = document.querySelectorAll(".side-form");
for (let form of sideForms) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const formArray = [...new FormData(form)];

    let urlParams = "";
    if (window.location.search) {
      let params = new URLSearchParams(window.location.search);
      const paramsArray = [...params];

      paramsArray.forEach(([key, value], index, array) => {
        if (key !== formArray[0][0]) {
          if (index < array.length - 1) {
            urlParams += `${key}=${value}&`;
          } else {
            urlParams += `${key}=${value}`;
          }
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

    // console.log(urlParams);
    // console.log(formParams);

    if (urlParams !== "") {
      // console.log(
      //   `${window.location.origin}/search?${urlParams}&${formParams}`,
      // );
      window.location.href = `${window.location.origin}/search?${urlParams}&${formParams}`;
    } else {
      // console.log(`${window.location.origin}/search?${formParams}`);
      window.location.href = `${window.location.origin}/search?${formParams}`;
    }
  });
}
