# OscarsCompanion 🎬

A companion app for tracking the 2026 Oscar nominations. Browse all nominated films, mark what you've seen, build a watchlist, and track your progress across every category.

**[Live Demo](https://movie-app-git-oscars-companion-zillacoops-projects.vercel.app/)**

---

## Features

- **All 15 categories** — Browse every 2026 Oscar nomination with poster, rating, and year
- **Mark as seen** — Track which films you've watched, synced across categories
- **Watchlist** — Save films you want to see
- **Progress tracking** — Sidebar with per-category progress bars
- **Filter view** — Switch between All, Seen, and Watchlist
- **Google Auth** — Sign in to sync your progress across devices via Appwrite
- **Category anchors** — Click a category in the sidebar to jump directly to it

---

## Tech Stack

- **React** — Frontend framework
- **Vite** — Build tool
- **Tailwind CSS** — Styling
- **TMDB API** — Movie data and posters
- **Appwrite** — Authentication (Google OAuth) and database (seen/watchlist sync)
- **Vercel** — Deployment

---

## Getting Started

### Prerequisites

- Node.js
- A [TMDB API key](https://www.themoviedb.org/settings/api)
- An [Appwrite](https://appwrite.io) project with Google OAuth enabled

### Installation

```bash
git clone https://github.com/NikolaiVFredriksen/MovieApp
cd MovieApp
npm install
```

### Environment Variables

Create a `.env` file in the root:

```
VITE_TMDB_API_KEY=your_tmdb_api_key
VITE_APPWRITE_PROJECT_ID=your_project_id
VITE_APPWRITE_DATABASE_ID=your_database_id
VITE_APPWRITE_COLLECTION_ID=your_collection_id
VITE_APPWRITE_SEEN_COLLECTION_ID=your_seen_collection_id
VITE_APPWRITE_WATCHLIST_COLLECTION_ID=your_watchlist_collection_id
VITE_REDIRECT_URL=http://localhost:5173
```

### Run Locally

```bash
npm run dev
```

> Note: Google OAuth only works in Chrome on localhost due to Safari cookie restrictions. All browsers work on the deployed URL.

---

## Project Structure

```
src/
├── components/
│   ├── Nominations.jsx   # Main nominations feed with filtering
│   ├── Sidebar.jsx       # Progress bars and category anchors
│   ├── MovieCard.jsx     # Reusable movie card component
│   └── Search.jsx        # Search input
├── data/
│   └── nominations.json  # 2026 Oscar nominations with TMDB IDs
├── appwrite.js           # Appwrite client and database functions
└── App.jsx               # Root component and state management
```

---

## Screenshots

> Coming soon

---

## Author

Nikolai Villanueva Fredriksen  
[GitHub](https://github.com/NikolaiVFredriksen)
