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

        console.log("Statuskod:", resp.status);
        console.log("Lyckades anropet?", resp.ok);

        if (resp.ok) {
            const data = await resp.json();

            messageContainer.innerHTML = `
            <p>${data.message}</p>
            `
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

    renderMenu(data);
    
}; 

function renderMenu(products) {

    const selectedList = document.querySelector(".menu");

    if (!selectedList) return;

    selectedList.innerHTML = ""; //Tömmer listan innan ny rendering


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

        categorySection.innerHTML = `
            <h2>${category}</h2>
            <div class="category-products"></div>
        `;

        const productContainer = categorySection.querySelector(".category-products");

        products.forEach((product) => {
            productContainer.innerHTML += `
                <article class="menu-product">
                    <img src="" alt="">
                    <h3>${product.productName}</h3>
                    <p>${product.description}</p>
                    <p class="price">${product.price} kr</p>
                </article>
            `;
        });

        selectedList.appendChild(categorySection);
    });
}