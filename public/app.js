//materialize js
$('#textarea1').val('New Text');
$('#textarea1').trigger('autoresize');
$('.parallax').parallax();
$('.modal').modal({
  dismissible: true, // dismissed clicking out the modal
  });

//scraper btn route
$('#scrape').click(function() {
  $.ajax({
      type: 'GET',
      url: '/blog'
  });
  location.href = location.href;
});

// Grab the blogs as a json
$.getJSON("/blogs", function(data) {
  // loop through the data and append it to the page on cards
  for (var i = 0; i < data.length; i++) {
    var blogStuff = '<div class="col s12 m4"><div class="card card-color darken-1 z-depth-5"><div class="card-content white-text" ><span class="card-title">' + data[i].title + '</span><p>' + data[i].summary + '</p></div><div class="card-action"><a href="' + data[i].link + '" id="link">link</a><a href="#" id="save" data-id="' + data[i]._id + '" data-title="' + data[i].title + '" data-summary="' + data[i].summary + '" data-link="' + data[i].link + '"><i class="material-icons right">save</i></a></div></div></div>';
    $("#blogs").append(blogStuff);
  }
});


//save blogs btn route
$(document).on("click", "#save", function() {
 console.log('saved');
  var thisId = $(this).attr("data-id");

  $.ajax({
      type: 'POST',
      url: '/blogs/' + thisId,

  });
});



// Whenever someone clicks edit note btn
$(document).on("click", "#notesModal", function() {
  console.log("notes");
  // Empty the notes from the note section
  $("#notes").empty();
  // Save the id
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the blog
  $.ajax({
    method: "GET",
    url: "/blogs/" + thisId
  })
  // With that done, add the note information to the page
    .done(function(data) {
      console.log(data);
      // title of the article
      $("#notes").append("<h4 class = 'center-align'>" + data.title + "</h4><div class='row'><form class = 'col s12'><div class='row'><div class='input-field col s12'><i class='material-icons prefix'>mode_edit</i>");
      // textarea to add a new note body
      $("#notes").append("<textarea id='bodyinput' class='materialize-texterea' name='body'></textarea>" + data.body + "</div></div></form></div></div>");
      // button to submit a new note, with the id of the article saved to it
      $("#notes").append("<div class='modal-footer'><a data-id='" + data._id + "' id='savenote' class='modal-action modal-close waves-effect waves-green btn-flat'>Save Note</a></div>");

      // If there's a note in the article
      if (data.note) {
        // Place the title of the note in the title input
        $("#titleinput").val(data.note.title);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.note.body);
      }
    });
});
// When you click the save note button in modal
$(document).on("click", "#saveBtn", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/blogs/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .done(function(data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#notes").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});
