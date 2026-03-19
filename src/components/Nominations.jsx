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
      <div className="category-filters">
        {nominations.map((cat) => (
          <button
            key={cat.category}
            onClick={() => setSelectedCategory(cat.category)}
            className={selectedCategory === cat.category ? "active" : ""}
          >
            {cat.category}
          </button>
        ))}
      </div>

      <h2>{selectedCategory}</h2>
      <ul className="nominees-list">
        {currentCategory?.nominees.map((nominee, index) => {
          const movie = movieData[nominee.tmdb_id];
          return (
            <li key={index} className={nominee.won ? "winner" : ""}>
              {movie?.poster_path && (
                <img
                  src={`https://image.tmdb.org/t/p/w200/${movie.poster_path}`}
                  alt={nominee.title}
                />
              )}
              <div>
                <h3>{nominee.title}</h3>
                {nominee.person && <p>{nominee.person}</p>}
                {nominee.won && <span className="winner-badge">🏆 Winner</span>}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default Nominations;
