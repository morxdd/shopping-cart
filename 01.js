const apiUrl = 'https://dummyjson.com/products?sortBy=title&order=asc'
function fetchApi(apiUrl) {
    return fetch(apiUrl)
        .then(res => res.json())
        .then(data => {
            console.log(data);
            return data;
        });
}

document.addEventListener('DOMContentLoaded', function () {
    fetchApi(apiUrl)
    .then(data => {
        createProducsList(data);
    });
})

// 把 api 資料改進DOM的函式
// 用 for 建立列表
function createProducsList(data) {
    console.log(data);

    let productListElement = document.querySelector('.product-list')
    data.products.forEach(product => {
        console.log(product.id);
        console.log(product.title);
        console.log(product.category);
        let productItem = document.createElement('div');
        productItem.classList.add('product-item')

        let productImage = document.createElement('img')
        productImage.src = product.images[0]
        productImage.alt = product.id

        let productName = document.createElement("div");
        productName.classList.add('product-name')
        productName.innerText = product.title;

        let productPrice = document.createElement('div');
        productPrice.classList.add('product-price');
        productPrice.innerText = `$${product.price}` 

        let addToCartButton = document.createElement('button');
        addToCartButton.classList.add('add-to-cart');
        addToCartButton.innerText = 'Add To Cart';

        productListElement.appendChild(productItem)
        productItem.appendChild(productImage)
        productItem.appendChild(productName)
        productItem.appendChild(productPrice);
        productItem.appendChild(addToCartButton)
    })
}
