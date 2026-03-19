import { useState, useEffect } from "react";
import nominations from "../data/nominations.json";

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

const Nominations = () => {
  const [movieData, setMovieData] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("Best Picture");

  useEffect(() => {
    const fetchMovieData = async () => {
      const uniqueIds = [
        ...new Set(
          nominations.flatMap((cat) => cat.nominees.map((n) => n.tmdb_id)),
        ),
      ];
      const results = {};
      await Promise.all(
        uniqueIds.map(async (id) => {
          try {
            const res = await fetch(`${API_BASE_URL}/movie/${id}`, API_OPTIONS);
            const data = await res.json();
            results[id] = data;
          } catch (e) {
            console.error(`Failed to fetch movie ${id}`, e);
          }
        }),
      );
      setMovieData(results);
    };
    fetchMovieData();
  }, []);

  const currentCategory = nominations.find(
    (c) => c.category === selectedCategory,
  );

  return (
    <section className="nominations">
      {nominations.map((cat) => (
        <div key={cat.category}>
          <h2 className="mt-20 mb-2">{cat.category}</h2>
          <ul>
            {cat.nominees.map((nominee, index) => {
              const movie = movieData[nominee.tmdb_id];
              const rating = movie?.vote_average
                ? movie.vote_average.toFixed(1)
                : "N/A";

              return (
                <li key={index}>
                  <div className="movie-card">
                    <img
                      src={
                        movie?.poster_path
                          ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
                          : `/no-movie.png`
                      }
                      alt={nominee.title}
                    />
                    <div className="mt-4">
                      <h3>{nominee.title}</h3>
                      <div className="content">
                        <div className="rating">
                          <img src="/star.svg" alt="rating" />
                          <p>{rating}</p>
                        </div>
                        <span>•</span>
                        {nominee.person ? (
                          <span className="lang">{nominee.person}</span>
                        ) : (
                          <span className="lang">
                            {movie?.original_language?.toUpperCase() || "N/A"}
                          </span>
                        )}
                        <span>•</span>
                        <span className="year">
                          {movie?.release_date
                            ? movie.release_date.split("-")[0]
                            : "N/A"}
                        </span>
                        {nominee.won === true && (
                          <span className="winner-badge">🏆</span>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </section>
  );
};

export default Nominations;
