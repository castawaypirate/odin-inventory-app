$(document).ready(function () {
  $("#genres").select2({ tags: true, placeholder: "Select genres" });
});

$(document).ready(function () {
  $("#publishers").select2({ tags: true, placeholder: "Select publishers" });
});

$(document).ready(function () {
  $("#developers").select2({ tags: true, placeholder: "Select developers" });
});

$(document).ready(function () {
  $("#game_engine").select2({
    tags: true,
    placeholder: {
      id: "-1",
      text: "Select game engine",
    },
    allowClear: true,
  });
});

const remove = document.querySelector(".remove");

if (remove) {
  remove.addEventListener("click", () => {
    document.querySelector(".cover_message").remove();
    const input = document.createElement("input");
    input.type = "file";
    input.name = "game_cover";
    document.querySelector(".cover_input").appendChild(input);
  });
}

const modal = document.querySelector(".modal");

//ok what is happening here is a mix between client side and server side things
//in order for this to work correctly I should make the endpoints return json
//and dynamically display them in the html - now the server returns raw html with
//either render or redirect when I document.write(...) it removes all the event
//listeners
const form = document.querySelector(".game-form");
form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const data = new FormData(form);
  const formDataObj = {};
  data.forEach((value, key) => (formDataObj[key] = value));
  console.log(formDataObj);

  const response = await fetch("/game/create", {
    method: "POST",
    body: data,
    // body: JSON.stringify({ username: "example" }),
    // …
  });
  let test = await response.text();
  console.log(test);
  document.open();
  document.write(test);
  document.close();
  // modal.style.display = "block";
});
