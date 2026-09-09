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
