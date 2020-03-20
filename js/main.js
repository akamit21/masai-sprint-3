$(document).ready(function() {
  $("#submit").click(function(e) {
    e.preventDefault();
    // get input
    var name = $("#searchInput").val();
    var type = $("input[name='searchType']:checked").val();
    // validate input
    var validate = validateInput();
    $("#message").html(validate);
    setTimeout(function() {
      $("#message").empty();
    }, 3000);

    if (validate.length == 0) {
      $.ajax({
        type: "GET",
        url: "https://www.omdbapi.com/",
        data: { type: type, s: name, apikey: "5732ac07" },
        dataType: "json",
        success: function(data, xhr) {
          console.log(xhr.status);
          $("#searchInput").val("");
          if (data.Response == "True") {
            getMovie(data.Search, type);
          }
        },
        error: function(error, status) {
          $("#message").html("Result: " + status + "\nError Message: " + error);
        }
      });
    }
  });

  // input validation
  function validateInput() {
    var errorMessage = "";
    if ($("#searchInput").val() == "") {
      errorMessage +=
        "<div class='alert alert-danger fw-700' role='alert'>Error, Enter movie name!</div>";
    }
    return errorMessage;
  }

  // movie constructor
  function Movie(title, year, imdbID, type, poster) {
    this.title = title;
    this.year = year;
    this.imdbID = imdbID;
    this.type = type;
    this.image = function() {
      var output = "";
      if (poster == "N/A") {
        output = "img/movie-poster.jpg";
      } else {
        output = poster;
      }
      return output;
    };
  }

  function getMovie(movies, type) {
    $("#movieContainer").removeClass("d-none");
    $("#movieList").empty();
    movies.forEach(function(details) {
      var movie = new Movie(
        details.Title,
        details.Year,
        details.imdbID,
        details.Type,
        details.Poster
      );
      var ui = createMovieCard(movie, type);
      $("#movieList").append(ui);
      window.location.replace("#movieContainer");
    });
  }

  function createMovieCard(movie) {
    var rating = Math.floor(Math.random() * 100) / 10;
    var ui = `<div class="col-lg-3 col-md-4 col-sm-6 my-2">
                <div class="card">
                    <img class="img-fluid" src="${movie.image()}" alt="poster" />
                    <div class="overlay hidden-xs hidden-sm">
                        <div class="text-white text-center">
                            <i class="fa fa-star fa-3x amber-text text-accent-3"></i>
                            <h4>${rating} / 10</h4>
                            <h4 class="text-capitalize">${movie.type}</h4>
                            <button class="btn btn-outline-success" id="details" value="${
                              movie.imdbID
                            }" > View Details </button>
                        </div>
                    </div>
                </div>
                <div class="p-2 text-center">
                    <h5 class="text-grey darken-4 fw-700">${movie.title}</h5>
                    <span class="text-grey darken-4 fw-500">${movie.year}</span>
                </div>
            </div>`;
    return ui;
  }

  // fetch complete movie info using imdb id
  $("#movieList").on("click", "#details", function(e) {
    e.preventDefault();
    var id = $(this).val();
    $.ajax({
      type: "GET",
      url: "https://www.omdbapi.com/",
      data: { i: id, plot: "full", apikey: "5732ac07" },
      dataType: "json",
      success: function(data, xhr) {
        console.log(xhr.status);
        $("#movieDetails").empty();
        var movieInfo = movieDetails(data);
        $("#movieDetails").append(movieInfo);
        $("#movieModal").modal("show");
      },
      error: function(error) {
        console.log(error);
      }
    });
  });

  function movieDetails(data) {
    var r = "";
    data.Ratings.forEach(function(ele) {
      r += '<div class="col">' + ele.Source + "<br/>" + ele.Value + "</div>";
    });
    var ui = `
    <div class="modal-header">
      <h5 class="modal-title" id="exampleModalLabel">${data.Title}</h5>
      <button type="button" class="close" data-dismiss="modal" aria-label="Close" >
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
      <div class="row">
        <div class="col-md-7">
          <h6 class="fw-500">Plot</h6>
          <p class="text-justify"> ${data.Plot} </p>
          <h6> <span class="fw-500">Actors: </span> <em>${data.Actors}</em></h6>
          <h6> <span class="fw-500">Director: </span> <em>${data.Director}</em></h6>
          <h6> <span class="fw-500">Writer: </span> <em>${data.Writer}</em></h6>
          <h6> <span class="fw-500">Released: </span> <em>${data.Released}</em></h6>
          <h6> <span class="fw-500">Runtime: </span> <em>${data.Runtime}</em></h6>
          <h6> <span class="fw-500">Rated: </span> <em>${data.Rated}</em></h6>
          <h6> <span class="fw-500">Genre: </span> <em>${data.Genre}</em></h6>
          <h6> <span class="fw-500">Language: </span> <em>${data.Language}</em></h6>
          <h6> <span class="fw-500">Awards: </span> <em>${data.Awards}</em></h6>
          <div class="row"> ${r} </div>
        </div>
        <div class="col-md-5">
          <img class="w-100" src="${data.Poster}" alt="Movie Poster" />
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-danger" data-dismiss="modal"> Close </button>
    </div>`;
    return ui;
  }
});
