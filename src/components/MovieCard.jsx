import React from "react";

const MovieCard = ({
  movie: { title, vote_average, poster_path, release_date, original_language },
}) => {
  // Safe handling of vote_average
  const rating = vote_average ? vote_average.toFixed(1) : "0.0";

  return (
    <div className="movie-card">
      <img
        src={
          nominee.person_id && personData[nominee.person_id]?.profile_path
            ? `https://image.tmdb.org/t/p/w500/${personData[nominee.person_id].profile_path}`
            : movie?.poster_path
              ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
              : `/no-movie.png`
        }
        alt={nominee.person || nominee.title}
      />

      <div className="mt-4">
        <h3>{title || "Unknown Title"}</h3>

        <div className="content">
          <div className="rating">
            <img src="/star.svg" alt="rating" />
            <p>{rating}</p>
          </div>

          <span>•</span>
          <span className="lang">{original_language || "N/A"}</span>
          <span>•</span>
          <span className="year">
            {release_date ? release_date.split("-")[0] : "N/A"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
