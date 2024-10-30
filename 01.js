const apiUrl = 'https://dummyjson.com/products?sortBy=title&order=asc'
let itemsInCart = {}; // 購物車中的商品（全域變數）
function fetchApi(apiUrl) {
    return fetch(apiUrl)
        .then(res => res.json())
        .then(data => {
            return data;
        });
}
// 主要運行函式
document.addEventListener('DOMContentLoaded', function () {
    fetchApi(apiUrl)
        .then(data => {
            createProducsList(data);
            showCart();
        });
})

// 把 api 資料放進產品列表 DOM
function createProducsList(data) {
    console.log(data);

    let productListElement = document.querySelector('.product-list')
    data.products.forEach(product => {
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

        // 綁定 addToCart 函式
        addToCartButton.addEventListener('click', function () {
            addToCart(product);
        })

        productListElement.appendChild(productItem)
        productItem.appendChild(productImage)
        productItem.appendChild(productName)
        productItem.appendChild(productPrice);
        productItem.appendChild(addToCartButton)
    })
};

// 顯示購物車彈窗頁面
function showCart() {
    const darkBackground = document.getElementById('dark-background');
    const cartIcon = document.getElementById('cart-icon');
    const cartLightBox = document.getElementById('cart-light-box');
    const backToBuyButton = document.getElementById('back-to-buy');
    darkBackground.addEventListener('click', function () {
        cartLightBox.classList.toggle('hidden')
    });
    cartIcon.addEventListener('click', function () {
        cartLightBox.classList.toggle('hidden')
    })
    backToBuyButton.addEventListener('click', function () {
        cartLightBox.classList.toggle('hidden')
    })
}

// 將商品資料存入全域變數
function addToCart(product) {
    if (!itemsInCart[product.id]) {
        itemsInCart[product.id] = {
            id: product.id,
            title: product.title,
            price: product.price,
            quantity: 1,
            imageSrc: product.images[0]
        };
        // 第一次加入商品時更新DOM
        updateCartDOM(itemsInCart);

    } else {
        itemsInCart[product.id].quantity++;
        updateCartDOM(itemsInCart,);
    }

}

// 據購物車內容，更新 DOM
function updateCartDOM(itemsInCart) {
    const cartEmptyMessage = document.querySelector('.cart-empty-message')

    if (cartEmptyMessage) {
        cartEmptyMessage.remove();
    }

    const cartContainer = document.querySelector('.cart-container');
    const backToBuyButton = document.getElementById('back-to-buy');

    let cartList = document.querySelector('.cart-list');
    if (!cartList) {
        // 如果購物車列表還沒生成，創建購物車列表
        cartList = document.createElement('ul');
        cartList.classList.add('cart-list');
        cartContainer.insertBefore(cartList, backToBuyButton);
    }

    // 歷遍 購物車資料
    Object.keys(itemsInCart).forEach(productId => {


        // 創建購物車項目
        const cartItem = document.createElement('li');
        cartItem.classList.add('cart-item');

        const cartItemTitle = document.createElement('div');
        cartItemTitle.classList.add('cart-item-title')
        cartItemTitle.innerText = itemsInCart[productId].title;
        const cartItemPrice = document.createElement('div');
        cartItemPrice.classList.add('cart-item-price')
        cartItemPrice.innerText = itemsInCart[productId].price;
        const cartItemQuantity = document.createElement('div');
        cartItemQuantity.classList.add('cart-item-quantity');
        cartItemQuantity.innerText = itemsInCart[productId].quantity;
        const cartItemImages = document.createElement('img')
        cartItemImages.src = itemsInCart[productId].imageSrc;



        cartItem.appendChild(cartItemImages);
        cartItem.appendChild(cartItemTitle);
        cartItem.appendChild(cartItemPrice);
        cartItem.appendChild(cartItemQuantity);
        cartList.appendChild(cartItem);

        console.log('購物車中的商品資料：', itemsInCart);
    })

}