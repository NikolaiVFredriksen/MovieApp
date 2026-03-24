import React from "react";
import Search from "./components/Search";
import { useState, useEffect } from "react";
import Spinner from "./components/Spinner";
import MovieCard from "./components/MovieCard";
import { useDebounce } from "react-use";
import { updateSearchCount } from "./appwrite";
import { getTrendingMovies } from "./appwrite";
import { loginWithGoogle, logout, getCurrentUser } from "./appwrite";
import Nominations from "./components/Nominations";
import nominations from "./data/nominations.json";

const API_BASE_URL = "https://api.themoviedb.org/3";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [movieList, setMovieList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [user, setUser] = useState(null);
  const [seen, setSeen] = useState(() =>
    JSON.parse(localStorage.getItem("seen") || "[]"),
  );

  const toggleSeen = (key) => {
    const updated = seen.includes(key)
      ? seen.filter((k) => k !== key)
      : [...seen, key];
    setSeen(updated);
    localStorage.setItem("seen", JSON.stringify(updated));
  };

  useEffect(() => {
    const fetchUser = async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    };
    fetchUser();
  }, []);

  useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm]);

  const fetchMovies = async (query = "") => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const endpoint = query
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
      const response = await fetch(endpoint, API_OPTIONS);

      if (!response.ok) {
        throw new Error("Failed to fetch movies");
      }
      const data = await response.json();

      if (data.response === "False") {
        setErrorMessage(data.Error || "No movies found");
        setMovieList([]);
        return;
      }

      setMovieList(data.results || []);

      if (query && data.results && data.results.length > 0) {
        try {
          // Update search count in Appwrite with error handling
          await updateSearchCount(query, data.results[0]);
        } catch (appwriteError) {
          console.error("Error updating search count:", appwriteError);
          // Don't crash the app if Appwrite fails, just log the error
        }
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setErrorMessage("Failed to fetch movies. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const loadTrendingMovies = async () => {
    try {
      const movies = await getTrendingMovies();
      setTrendingMovies(movies);
    } catch (error) {
      console.error("Error fetching trending movies:", error);
    }
  };

  // useEffect to handle debounced search and initial load
  useEffect(() => {
    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  useEffect(() => {
    loadTrendingMovies();
  }, []);

  return (
    <main>
      <div className="pattern" />
      <div className="wrapper">
        <header>
          <nav
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "2rem",
            }}
          >
            <span
              style={{ color: "white", fontWeight: "bold", fontSize: "1.4rem" }}
            >
              🎬 Oscars Companion
            </span>
            {user ? (
              <div
                style={{ display: "flex", alignItems: "center", gap: "12px" }}
              >
                <span style={{ color: "white", fontSize: "0.9rem" }}>
                  {user.name}
                </span>
                <button
                  onClick={async () => {
                    await logout();
                    setUser(null);
                  }}
                  style={{
                    background: "transparent",
                    color: "#9ca4ab",
                    padding: "6px 12px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    border: "1px solid #9ca4ab",
                    fontSize: "0.85rem",
                  }}
                >
                  Log out
                </button>
              </div>
            ) : (
              <button
                onClick={loginWithGoogle}
                style={{
                  background: "white",
                  color: "black",
                  padding: "8px 16px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "0.9rem",
                }}
              >
                <img
                  src="https://www.google.com/favicon.ico"
                  alt="Google"
                  style={{ width: "16px", height: "16px" }}
                />
                Sign in with Google
              </button>
            )}
          </nav>

          <img src="./hero.png" alt="Hero Banner" />
          <h1>
            Your Companion for the{" "}
            <span className="text-gradient">2026 Oscars</span>
          </h1>
        </header>
        <section className="trending">
          <h2>
            You've watched{" "}
            <span className="text-gradient">
              {nominations
                .find((c) => c.category === "Best Picture")
                ?.nominees.filter((n) =>
                  seen.some((k) => k.startsWith(`${n.tmdb_id}-`)),
                ).length || 0}
              /
              {nominations.find((c) => c.category === "Best Picture")?.nominees
                .length || 0}
            </span>{" "}
            Best Picture nominations!
          </h2>

          <section className="trending">
            <h3>
              You've watched{" "}
              <span className="text-gradient">
                {nominations
                  .find((c) => c.category === "Actor in a Leading Role")
                  ?.nominees.filter((n) =>
                    seen.some((k) => k.startsWith(`${n.tmdb_id}-`)),
                  ).length || 0}
                /
                {nominations.find(
                  (c) => c.category === "Actor in a Leading Role",
                )?.nominees.length || 0}
              </span>{" "}
              Actor in a Leading Role nominations!
            </h3>
          </section>

          <section className="trending">
            <h3>
              You've watched{" "}
              <span className="text-gradient">
                {nominations
                  .find((c) => c.category === "Actress in a Leading Role")
                  ?.nominees.filter((n) =>
                    seen.some((k) => k.startsWith(`${n.tmdb_id}-`)),
                  ).length || 0}
                /
                {nominations.find(
                  (c) => c.category === "Actress in a Leading Role",
                )?.nominees.length || 0}
              </span>{" "}
              Actress in a Leading Role nominations!
            </h3>
          </section>
        </section>

        <section className="all-movies">
          <Nominations seen={seen} toggleSeen={toggleSeen} />
        </section>
      </div>
    </main>
  );
};

export default App;
