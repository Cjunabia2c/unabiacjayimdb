const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const trendingGrid = document.getElementById("trendingGrid");
const emptyMessage = document.querySelector(".empty-message");

const watchlistItems = document.getElementById("watchlistItems");
const watchlistCount = document.getElementById("watchlistCount");
const toast = document.getElementById("toast");

const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");

const savedMovies = new Map();
let toastTimer;

// Show notification
function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 2200);
}

// SEARCH MOVIES
function searchMovies() {
    const query = searchInput.value.trim().toLowerCase();
    const cards = document.querySelectorAll(".movie-card");
    let visibleCount = 0;

    cards.forEach(card => {
        const title = card.dataset.title.toLowerCase();
        const matches = title.includes(query);

        card.style.display = matches ? "" : "none";

        if (matches) visibleCount++;
    });

    // Hide section headings with no matching movies
    document.querySelectorAll(".section").forEach(section => {
        const grid = section.querySelector(".movie-grid");

        if (!grid) return;

        const hasVisibleMovie = [
            ...grid.querySelectorAll(".movie-card")
        ].some(card => card.style.display !== "none");

        section.classList.toggle(
            "search-hidden",
            query !== "" && !hasVisibleMovie
        );
    });

    emptyMessage.hidden = !(query !== "" && visibleCount === 0);

    if (query && visibleCount === 0) {
        showToast("No matching movies found.");
    }
}

searchBtn.addEventListener("click", searchMovies);

searchInput.addEventListener("input", searchMovies);

searchInput.addEventListener("keydown", event => {
    if (event.key === "Enter") searchMovies();
});

// ADD TO WATCHLIST
document.querySelectorAll(".movie-card").forEach(card => {
    const button = card.querySelector(".watch-btn");

    button.addEventListener("click", () => {
        const title = card.dataset.title;

        if (savedMovies.has(title)) {
            showToast("This movie is already in your watchlist.");
            return;
        }

        savedMovies.set(title, {
            title: title,
            image: card.querySelector("img").src,
            rating: card.querySelector(".rating span").textContent,
            meta: card.querySelector(".meta").textContent
        });

        renderWatchlist();
        showToast(title + " added to your watchlist!");

        document.getElementById("watchlist").scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    });
});

// DISPLAY WATCHLIST
function renderWatchlist() {
    watchlistItems.innerHTML = "";

    watchlistCount.textContent =
        ${savedMovies.size} ${savedMovies.size === 1 ? "movie" : "movies"} saved;

    if (savedMovies.size === 0) {
        watchlistItems.innerHTML =
            '<p class="empty-watchlist">Your watchlist is empty. Add movies above!</p>';
        return;
    }

    savedMovies.forEach(movie => {
        const item = document.createElement("div");
        item.className = "saved-movie";

        const poster = document.createElement("img");
        poster.src = movie.image;
        poster.alt = movie.title + " poster";

        const details = document.createElement("div");

        const title = document.createElement("h3");
        title.textContent = movie.title;

        const description = document.createElement("p");
        description.textContent = ${movie.meta} · ★ ${movie.rating};

        const removeButton = document.createElement("button");
        removeButton.className = "remove-btn";
        removeButton.textContent = "Remove";
        removeButton.setAttribute(
            "aria-label",
            "Remove " + movie.title + " from watchlist"
        );

        removeButton.addEventListener("click", () => {
            savedMovies.delete(movie.title);
            renderWatchlist();
            showToast(movie.title + " removed.");
        });

        details.append(title, description);
        item.append(poster, details, removeButton);
        watchlistItems.appendChild(item);
    });
}

// MOBILE NAVIGATION
menuBtn.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");

    menuBtn.setAttribute("aria-expanded", String(isOpen));
});

navLinks.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
        navLinks.classList.remove("open");
        menuBtn.setAttribute("aria-expanded", "false");
    });
});

// INITIAL STATE
renderWatchlist();