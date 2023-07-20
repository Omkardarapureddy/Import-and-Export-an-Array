const express = require("express");
const { open } = require("sqlite");
const app = express();
app.use(express.json());
const path = require("path");
const dbPath = path.join(__dirname, "moviesData.db");
const sqlite3 = require("sqlite3");
let db = null;
const dbAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running http://localhost:3000/");
    });
  } catch (e) {
    console.log("DB error:${e.message}");
    process.exit(1);
  }
};
dbAndServer();

app.get("/movies/", async (request, response) => {
  const getMovieTeam = `SELECT movie_name FROM movie;`;
  const movieArray = await db.all(getMovieTeam);
  const changeOBj = (movieList) => {
    return {
      movieName: movieList.movie_name,
    };
  };
  response.send(movieArray.map((movieName) => changeOBj(movieName)));
});

app.post("/movies/", async (request, response) => {
  const movieDetalis = request.body;
  const { directorId, movieName, leadActor } = movieDetalis;
  const getMovieTeam = `INSERT INTO movie (director_id, movie_name,lead_actor) VALUES (${directorId},"${movieName}","${leadActor}");`;
  const dbResponse = await db.run(getMovieTeam);
  response.send("Movie Successfully Added");
});

app.get("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const getMovieTeam = `SELECT * FROM movie WHERE movie_id=${movieId} `;
  const movieGet = await db.get(getMovieTeam);
  const m = (movieList) => {
    return {
      movieId: movieList.movie_id,
      directorId: movieList.director_id,
      movieName: movieList.movie_name,
      leadActor: movieList.lead_actor,
    };
  };
  console.log(movieId);
  response.send(m(movieGet));
});

app.put("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const movieDetalis = request.body;
  const { directorId, movieName, leadActor } = movieDetalis;
  const getMovieTeam = `UPDATE movie SET director_id=${directorId}, movie_name="${movieName}",lead_actor="${leadActor}" WHERE (movie_id=${movieId})`;
  await db.run(getMovieTeam);
  response.send("Movie Details Updated");
});

app.delete("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const getMovieTeam = `DELETE FROM movie WHERE movie_id=${movieId} `;
  await db.run(getMovieTeam);
  response.send("Movie Removed");
});

app.get("/directors/", async (request, response) => {
  const getDirTeam = `SELECT * FROM director;`;
  const movieArray = await db.all(getDirTeam);
  const changeOBj = (drList) => {
    return {
      directorId: drList.director_id,
      directorName: drList.director_name,
    };
  };
  response.send(movieArray.map((each) => changeOBj(each)));
});

app.get("/directors/:directorId/movies/", async (request, response) => {
  const { directorId } = request.params;
  const getMovieTeam = `SELECT movie_name FROM director INNER JOIN movie ON director.director_id=movie.director_id WHERE director.director_id=${directorId};`;
  const movieArray = await db.all(getMovieTeam);
  const changeOBj = (movieList) => {
    return {
      movieName: movieList.movie_name,
    };
  };
  response.send(movieArray.map((each) => changeOBj(each)));
});
module.exports = app;
