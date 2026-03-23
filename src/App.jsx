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
          <img src="./hero.png" alt="Hero Banner" />

          <h1>
            Your Companion for the{" "}
            <span className="text-gradient">2026 Oscars</span>
          </h1>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "1rem",
            }}
          >
            {user ? (
              <button
                onClick={async () => {
                  await logout();
                  setUser(null);
                }}
                style={{
                  background: "white",
                  color: "black",
                  padding: "10px 20px",
                  borderRadius: "8px",
                }}
              >
                Log out ({user.name})
              </button>
            ) : (
              <button
                onClick={loginWithGoogle}
                style={{
                  background: "white",
                  color: "black",
                  padding: "10px 20px",
                  borderRadius: "8px",
                  position: "relative",
                  zIndex: 20,
                  cursor: "pointer",
                }}
              >
                Sign in with Google
              </button>
            )}
          </div>
        </header>
        <section className="trending">
          <h2>
            You've watched <span className="text-gradient">7/10</span> Best
            Picture nominations!
          </h2>
        </section>

        <section className="all-movies">
          <Nominations />
        </section>
      </div>
    </main>
  );
};

export default App;
