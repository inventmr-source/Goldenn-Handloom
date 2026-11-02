const mainPhoto = document.querySelector("#main-photo");
const thumbnails = [...document.querySelectorAll(".thumbnail")];
const reviewForm = document.querySelector("#review-form");
const reviewList = document.querySelector("#review-list");
const reviewCount = document.querySelector("#review-count");
const noReviews = document.querySelector("#no-reviews");
const ratingSummary = document.querySelector("#rating-summary");
const formNotice = document.querySelector("#form-notice");
const storageKey = "golden-handloom-bedsheet-reviews";

thumbnails.forEach((thumbnail) => {
    thumbnail.addEventListener("click", () => {
        mainPhoto.src = thumbnail.dataset.src;
        mainPhoto.alt = thumbnail.dataset.alt;
        thumbnails.forEach((item) => {
            const isSelected = item === thumbnail;
            item.classList.toggle("is-selected", isSelected);
            item.setAttribute("aria-pressed", String(isSelected));
        });
    });
});

function renderReviews(reviews) {
    reviewList.replaceChildren();

    reviews.forEach((review) => {
        const card = document.createElement("article");
        card.className = "review-card";

        const name = document.createElement("h3");
        name.textContent = review.name;

        const stars = document.createElement("span");
        stars.className = "review-stars";
        stars.setAttribute("aria-label", `${review.rating} out of 5 stars`);
        stars.textContent = `${"★".repeat(review.rating)}${"☆".repeat(5 - review.rating)}`;

        const text = document.createElement("p");
        text.textContent = review.text;

        card.append(name, stars, text);
        reviewList.append(card);
    });

    const count = reviews.length;
    reviewCount.textContent = `${count} ${count === 1 ? "review" : "reviews"}`;
    noReviews.hidden = count > 0;
    ratingSummary.textContent = count
        ? `${(reviews.reduce((sum, review) => sum + review.rating, 0) / count).toFixed(1)} (${reviewCount.textContent})`
        : "No reviews yet";
}

function loadReviews() {
    try {
        const storedReviews = localStorage.getItem(storageKey);
        if (!storedReviews) {
            return [];
        }

        const reviews = JSON.parse(storedReviews);
        if (!Array.isArray(reviews)) {
            throw new Error("Stored reviews are not a list.");
        }

        return reviews.filter((review) =>
            typeof review.name === "string" &&
            typeof review.text === "string" &&
            Number.isInteger(review.rating) &&
            review.rating >= 1 &&
            review.rating <= 5
        );
    } catch (error) {
        formNotice.textContent = "Saved reviews could not be loaded from this browser.";
        return [];
    }
}

let reviews = loadReviews();
renderReviews(reviews);

reviewForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(reviewForm);
    const review = {
        name: formData.get("name").trim(),
        rating: Number(formData.get("rating")),
        text: formData.get("review").trim()
    };

    if (!review.name || !review.text || review.rating < 1 || review.rating > 5) {
        formNotice.textContent = "Enter your name, select a rating, and write a review.";
        return;
    }

    const updatedReviews = [...reviews, review];
    try {
        localStorage.setItem(storageKey, JSON.stringify(updatedReviews));
        reviews = updatedReviews;
        renderReviews(reviews);
        reviewForm.reset();
        formNotice.textContent = "Your review was added on this browser.";
    } catch (error) {
        formNotice.textContent = "Your review could not be saved in this browser. Check storage settings and try again.";
    }
});

document.querySelector("#current-year").textContent = new Date().getFullYear();
