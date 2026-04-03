import { Client, Databases, ID, Query, Account } from "appwrite";

const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;

const client = new Client()
  .setEndpoint("https://fra.cloud.appwrite.io/v1")
  .setProject(PROJECT_ID);

const database = new Databases(client);
export const account = new Account(client);

// Google login
export const loginWithGoogle = () => {
  const redirectUrl = import.meta.env
    .VITE_REDIRECT_URL; /* || "localhost:5173"; */
  account.createOAuth2Session("google", redirectUrl, redirectUrl, []);
};

// Logout
export const logout = async () => {
  await account.deleteSession("current");
};

// Hent innlogget bruker
export const getCurrentUser = async () => {
  try {
    const user = await account.get();
    console.log("account.get():", user);
    return user;
  } catch (error) {
    console.log("account.get() error:", error);
    return null;
  }
};

export const updateSearchCount = async (searchTerm, movie) => {
  try {
    // Validate inputs
    if (!searchTerm || !movie) {
      console.warn("Invalid searchTerm or movie data");
      return;
    }

    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.equal("searchTerm", searchTerm),
    ]);

    if (result.documents.length > 0) {
      // Update existing record
      const doc = result.documents[0];
      await database.updateDocument(DATABASE_ID, COLLECTION_ID, doc.$id, {
        count: doc.count + 1,
      });
    } else {
      // Create new record for first-time search
      const posterUrl = movie.poster_path
        ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
        : null;

      await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
        searchTerm,
        count: 1,
        movie_id: movie.id || null,
        poster_url: posterUrl,
      });
    }
  } catch (error) {
    console.error("Error updating search count:", error);
    throw error; // Re-throw so the calling function can handle it
  }
};

export const getTrendingMovies = async () => {
  try {
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.limit(5),
      Query.orderDesc("count"),
    ]);

    return result.documents;
  } catch (error) {
    console.error("Error fetching trending movies:", error);
  }
};

const SEEN_COLLECTION_ID = import.meta.env.VITE_APPWRITE_SEEN_COLLECTION_ID;
const WATCHLIST_COLLECTION_ID = import.meta.env
  .VITE_APPWRITE_WATCHLIST_COLLECTION_ID;

// SEEN
export const getSeen = async (userId) => {
  try {
    const result = await database.listDocuments(
      DATABASE_ID,
      SEEN_COLLECTION_ID,
      [Query.equal("user_id", userId)],
    );
    return result.documents.map((doc) => doc.tmdb_id);
  } catch (error) {
    console.error("Error fetching seen:", error);
    return [];
  }
};

export const addSeen = async (userId, tmdbId) => {
  try {
    await database.createDocument(
      DATABASE_ID,
      SEEN_COLLECTION_ID,
      ID.unique(),
      {
        user_id: userId,
        tmdb_id: String(tmdbId),
      },
    );
  } catch (error) {
    console.error("Error adding seen:", error);
  }
};

export const removeSeen = async (userId, tmdbId) => {
  try {
    const result = await database.listDocuments(
      DATABASE_ID,
      SEEN_COLLECTION_ID,
      [Query.equal("user_id", userId), Query.equal("tmdb_id", String(tmdbId))],
    );
    if (result.documents.length > 0) {
      await database.deleteDocument(
        DATABASE_ID,
        SEEN_COLLECTION_ID,
        result.documents[0].$id,
      );
    }
  } catch (error) {
    console.error("Error removing seen:", error);
  }
};

// WATCHLIST
export const getWatchlist = async (userId) => {
  try {
    const result = await database.listDocuments(
      DATABASE_ID,
      WATCHLIST_COLLECTION_ID,
      [Query.equal("user_id", userId)],
    );
    return result.documents.map((doc) => doc.tmdb_id);
  } catch (error) {
    console.error("Error fetching watchlist:", error);
    return [];
  }
};

export const addWatchlist = async (userId, tmdbId) => {
  try {
    await database.createDocument(
      DATABASE_ID,
      WATCHLIST_COLLECTION_ID,
      ID.unique(),
      {
        user_id: userId,
        tmdb_id: String(tmdbId),
      },
    );
  } catch (error) {
    console.error("Error adding watchlist:", error);
  }
};

export const removeWatchlist = async (userId, tmdbId) => {
  try {
    const result = await database.listDocuments(
      DATABASE_ID,
      WATCHLIST_COLLECTION_ID,
      [Query.equal("user_id", userId), Query.equal("tmdb_id", String(tmdbId))],
    );
    if (result.documents.length > 0) {
      await database.deleteDocument(
        DATABASE_ID,
        WATCHLIST_COLLECTION_ID,
        result.documents[0].$id,
      );
    }
  } catch (error) {
    console.error("Error removing watchlist:", error);
  }
};
