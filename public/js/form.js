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

const select2Selectors = ["genres", "publishers", "developers", "game_engine"];
select2Selectors.forEach((sel) => {
  const label = document.querySelector(`label[for="${sel}"]`);
  if (label) {
    label.addEventListener("click", (event) => {
      event.preventDefault();
      const $select = $(`#${sel}`);
      if ($select.hasClass("select2-hidden-accessible")) {
        $select.select2("open");
      }
    });
  }
});
