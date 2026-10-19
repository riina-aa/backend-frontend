import "../scass/main.scss";

document.addEventListener("DOMContentLoaded", () => {
    init();
})

function init() {

    fetchMenu();

    const form = document.querySelector(".order-form");
    form.addEventListener("submit", addOrder)

};

async function addOrder(e) {

    e.preventDefault();

    let customerName = document.querySelector("#name").value;
    let customerEmail = document.querySelector("#email").value;
    let customerPhone = document.querySelector("#phone").value;
    let productType = document.querySelector("#products").value;
    let productServings = document.querySelector("#servings").value;
    let productMessage = document.querySelector("#message").value;
    let productDelivery = document.querySelector("#delivery").value;
    let productComment = document.querySelector("#comment").value;
    const messageContainer = document.querySelector("#error-container");

    if (
        !customerName ||
        !customerEmail ||
        !customerPhone ||
        !productType ||
        !productServings ||
        !productDelivery) {

        messageContainer.textContent = `Du måste fylla i alla obligatoriska fält.`
        return;
    }

    let order = {
        customer: {
            name: customerName,
            email: customerEmail,
            phone: customerPhone
        },

        product: {
            productType: productType,
            servings: productServings,
            message: productMessage
        },

        deliveryDate: productDelivery,

        comment: productComment
    }

    try {
        const resp = await fetch("http://localhost:3000/greenhouse/orders", {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(order)
        });

        if (resp.ok) {
            const data = await resp.json();

            messageContainer.textContent = "Tack för din beställning! Vi har tagit emot din förfrågan och återkommer till dig så snart som möjligt.";
            
            const form = document.querySelector(".order-form");

            form.reset();
        }

    } catch (error) {
        console.log(error)
    }

}

async function fetchMenu() {

    let result = await fetch("http://localhost:3000/greenhouse/products", {
        method: "GET"
    });

    let data = await result.json();

    const visibleProducts = data.filter(product => product.available === true);

    renderMenu(visibleProducts);

};

function renderMenu(products) {

    const selectedList = document.querySelector(".menu");

    if (!selectedList) return;

    selectedList.innerHTML = ""; //Tömmer listan innan ny rendering

    selectedList.innerHTML = `
        <h2>Vår meny</h2>
    `

    const groupedProducts = products.reduce((groups, product) => {

        const category = product.category;

        if (!groups[category]) {
            groups[category] = [];
        }

        groups[category].push(product);

        return groups;
    }, {});

    Object.entries(groupedProducts).forEach(([category, products]) => {

        const categorySection = document.createElement("section");
        categorySection.classList.add("menu-category");

        const categoryNames = {
            brunch: "Brunch & Lunch",
            bakery: "Bakelser & Tårtor",
            sourdough: "Surdegsbröd",
            hotDrinks: "Varma drycker",
            coldDrinks: "Kalla drycker",
            cocktails: "Drinkar & Cocktails"
        };

        categorySection.innerHTML = `
            <h2>${categoryNames[category] || category}</h2>
            <div class="category-products"></div>
        `;

        const productContainer = categorySection.querySelector(".category-products");

        products.forEach((product) => {
            productContainer.innerHTML += `
                <article class="menu-product">
                    <h3>${product.productName} | ${product.price} kr</h3>
                    <p>${product.description}</p>
                    <p class="allergies">Allergier: ${product.allergies}</p>
                    
                </article>
            `;
        });

        selectedList.appendChild(categorySection);
    });
}