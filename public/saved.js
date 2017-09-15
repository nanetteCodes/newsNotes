// Grab the saved blogs as a json
document.ready(){
  $.getJSON("/getsaved", function(data) {
    for (var i = 0; i < data.length; i++) {
      var savedStuff = '<div class="col s12 m4"><div class="card card-color darken-1 z-depth-5"><div class="card-content white-text" ><span class="card-title">' + data.title + '</span><p>' + data.summary + '</p></div><div class="card-action"><a href="' + data.link + '" id="link">link</a><a href="#" id="delete-note"><i class="material-icons right">delete</i></a>
      <a href="#modalNotes" id="notesModal" class="modal-trigger editBtn"><i class="material-icons right">edit</i></a></div></div></div>';
      $("#saved-cards").append(savedStuff);
    }
  })
});
