const searchForm = document.querySelector(".nav-search");
const searchInput = document.querySelector("#search-input");
const categorySelect = document.querySelector("#category");
const productCards = [...document.querySelectorAll(".product-card")];
const resultsMessage = document.querySelector("#results-message");
const emptyState = document.querySelector("#empty-state");
const detailsDialog = document.querySelector("#details-dialog");
const dialogTitle = document.querySelector("#dialog-title");
const dialogContent = document.querySelector("#dialog-content");
const contactEmail = document.querySelector("#contact-email");
const contactAlternateEmail = document.querySelector("#contact-alternate-email");
const contactPhone = document.querySelector("#contact-phone");

const productDetails = {
    bedsheet: "Browse the bedsheet collection from Golden Handloom.",
    "blanket-set": "Browse coordinated blanket sets from Golden Handloom.",
    "sofa-set": "Browse sofa sets from Golden Handloom.",
    blanket: "Browse the blanket collection from Golden Handloom."
};

function filterProducts() {
    const query = searchInput.value.trim().toLocaleLowerCase();
    const selectedCategory = categorySelect.value;
    let visibleCount = 0;

    productCards.forEach((card) => {
        const categoryMatches = selectedCategory === "all" || card.dataset.category === selectedCategory;
        const queryMatches = !query || `${card.dataset.name} ${card.dataset.category}`.includes(query);
        const isVisible = categoryMatches && queryMatches;

        card.hidden = !isVisible;
        visibleCount += Number(isVisible);
    });

    resultsMessage.textContent = `Showing ${visibleCount} ${visibleCount === 1 ? "category" : "categories"}`;
    emptyState.hidden = visibleCount > 0;
}

function openDialog(title, content, email = "", phone = "", alternateEmail = "") {
    dialogTitle.textContent = title;
    dialogContent.textContent = content;
    contactEmail.hidden = !email;
    contactEmail.href = email ? `mailto:${email}` : "";
    contactEmail.textContent = email;
    contactAlternateEmail.hidden = !alternateEmail;
    contactAlternateEmail.href = alternateEmail ? `mailto:${alternateEmail}` : "";
    contactAlternateEmail.textContent = alternateEmail;
    contactPhone.hidden = !phone;
    contactPhone.href = phone ? `tel:${phone}` : "";
    contactPhone.textContent = phone;
    detailsDialog.showModal();
}

searchInput.addEventListener("input", filterProducts);
categorySelect.addEventListener("change", filterProducts);
searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    filterProducts();
    document.querySelector("#products").scrollIntoView({ behavior: "smooth" });
});

productCards.forEach((card) => {
    card.addEventListener("click", () => {
        const category = card.dataset.category;
        if (category === "blanket-set" || category === "bedsheet" || category === "sofa-set" || category === "blanket") {
            return;
        }
        openDialog(card.querySelector(".card-caption > span").textContent, productDetails[category]);
    });
});

document.querySelectorAll("[data-info]").forEach((link) => {
    link.addEventListener("click", (event) => {
        event.preventDefault();
        const pages = {
            privacy: {
                title: "Privacy Policy",
                content: "This page has no forms, accounts, or checkout. Product search and category filtering happen in your browser."
            },
            terms: {
                title: "Terms of Service",
                content: "This page is a product-category showcase. Product availability, pricing, and purchase terms are not provided here. For enquiries, contact us:"
            },
            contact: {
                title: "Contact Golden Handloom",
                content: "Email us with your questions or enquiries:"
            }
        };
        const page = pages[link.dataset.info];
        const isContactPage = link.dataset.info === "contact";
        const isTermsPage = link.dataset.info === "terms";
        openDialog(
            page.title,
            page.content,
            isContactPage || isTermsPage ? "goldenntextile@gmail.com" : "",
            isTermsPage ? "7300829242" : "",
            isContactPage ? "abdulqayyum730082@gmail.com" : ""
        );
    });
});

document.querySelector(".dialog-close").addEventListener("click", () => detailsDialog.close());
detailsDialog.addEventListener("click", (event) => {
    if (event.target === detailsDialog) {
        detailsDialog.close();
    }
});
document.querySelector("#current-year").textContent = new Date().getFullYear();