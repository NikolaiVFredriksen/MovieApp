import { Client, Databases, ID, Query } from "appwrite";

const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;

const client = new Client()
  .setEndpoint("https://fra.cloud.appwrite.io/v1")
  .setProject(PROJECT_ID);

const database = new Databases(client);

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
