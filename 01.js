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
    const addedMessage = document.createElement('div');
    addedMessage.classList.add('added-message');
    addedMessage.innerText = "已加入購物車！";
    const bodyElement = document.getElementsByTagName('body')[0];
    bodyElement.appendChild(addedMessage);
    setTimeout(() => {
        addedMessage.style.opacity = '0'; // 設置 opacity 為 0 來實現淡出效果
    }, 500);
    setTimeout(() => {
        addedMessage.remove();
    }, 1000);

    // bodyElement.appendChild(addedMessage);
    if (!itemsInCart[product.id]) {
        itemsInCart[product.id] = {
            id: product.id,
            title: product.title,
            price: product.price,
            quantity: 1,
            imageSrc: product.images[0],
            itemTotalPrice: product.price,

        };
    } else {
        itemsInCart[product.id].quantity++;
        itemsInCart[product.id].itemTotalPrice = itemsInCart[product.id].price * itemsInCart[product.id].quantity;
    }
    updateCartDOM(itemsInCart);
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
    // 取得所有商品的 ID 列表
    const productIds = Object.keys(itemsInCart);
    // 歷遍 購物車資料
    Object.keys(itemsInCart).forEach((productId, index) => {
        // 檢查是否有該商品的 li 元素
        let existingCartItem = document.getElementById(`cart-item-${productId}`);
        if (existingCartItem) {
            // 如果該商品已在清單中，更新數量
            const quantityDisplay = existingCartItem.querySelector('.quantity-display');
            quantityDisplay.innerText = itemsInCart[productId].quantity;

            // 更新總價顯示
            const totalPriceDisplay = existingCartItem.querySelector('.cart-item-total-price');
            totalPriceDisplay.innerText = `$${itemsInCart[productId].itemTotalPrice.toFixed(2)}`;


        } else {
            // 如果該商品還沒在清單中，創建購物車項目
            const cartItem = document.createElement('li');
            cartItem.classList.add('cart-item');
            cartItem.id = `cart-item-${productId}`

            const cartItemTitle = document.createElement('div');
            cartItemTitle.classList.add('cart-item-title')
            cartItemTitle.innerText = itemsInCart[productId].title;
            const cartItemPrice = document.createElement('div');
            cartItemPrice.classList.add('cart-item-price')
            cartItemPrice.innerText = `$${itemsInCart[productId].price}`;
            const cartItemTotalPrice = document.createElement('div');
            cartItemTotalPrice.classList.add('cart-item-total-price');
            cartItemTotalPrice.innerText = `$${itemsInCart[productId].itemTotalPrice.toFixed(2)}`;



            // 數量選擇器
            const cartItemQuantity = document.createElement('div');
            cartItemQuantity.classList.add('cart-item-quantity');

            const cartItemQuantityBox = document.createElement('div');
            cartItemQuantityBox.classList.add('cart-item-quantity-box');

            //創建減少數量按鈕
            const decreaseButton = document.createElement('button');
            decreaseButton.classList.add('quantity-button', 'decrease');
            decreaseButton.innerText = '-';
            decreaseButton.addEventListener('click', function () {
                adjustItemQuantity(productId, -1);
            });

            // 顯示當前數量
            const quantityDisplay = document.createElement('span');
            quantityDisplay.classList.add('quantity-display');
            quantityDisplay.innerText = itemsInCart[productId].quantity;

            // 創建增加數量按鈕
            const increaseButton = document.createElement('button');
            increaseButton.classList.add('quantity-button', 'increase');
            increaseButton.innerText = '+';
            increaseButton.addEventListener('click', function () {
                adjustItemQuantity(productId, 1);
            });

            // 組合選擇器到 cartItemQuantityBox
            cartItemQuantityBox.appendChild(decreaseButton);
            cartItemQuantityBox.appendChild(quantityDisplay);
            cartItemQuantityBox.appendChild(increaseButton);


            cartItemQuantity.innerText = itemsInCart[productId].quantity;
            const cartItemImages = document.createElement('img')
            cartItemImages.src = itemsInCart[productId].imageSrc;

            // 創建 li 中的文字容器
            const cartItemTextBox = document.createElement('div');
            cartItemTextBox.classList.add('cart-item-text-box');
            // 創建 價錢與移除按鈕的容器
            const cartItemPriceAndRemoveBox = document.createElement('div');
            cartItemPriceAndRemoveBox.classList.add('cart-item-price-and-remove-box');

            // 創建 li 中的移除按鈕
            const cartItemRemoveButton = document.createElement('button');
            cartItemRemoveButton.id = 'cart-item-remove-button'
            cartItemRemoveButton.innerText = '移除'
            cartItemRemoveButton.addEventListener('click', function () {
                removeFromCart(productId);
            })

            cartItem.appendChild(cartItemImages);
            cartItem.appendChild(cartItemTextBox);
            cartItemTextBox.appendChild(cartItemTitle);
            cartItemTextBox.appendChild(cartItemQuantityBox);
            cartItemTextBox.appendChild(cartItemPriceAndRemoveBox);
            cartItemPriceAndRemoveBox.appendChild(cartItemTotalPrice);
            cartItemPriceAndRemoveBox.appendChild(cartItemRemoveButton);

            cartList.appendChild(cartItem);
        }
        console.log('購物車中的商品資料：', itemsInCart);
    })
}
// 移除購物車中的商品
function removeFromCart(productId) {
    console.log(productId);
    console.log(itemsInCart);
    if (itemsInCart[productId]) {
        delete itemsInCart[productId];
    }

    // 移除對應的 DOM 元素
    const cartItemElement = document.getElementById(`cart-item-${productId}`);
    if (cartItemElement) {
        cartItemElement.remove();  // 移除該商品的 li 元素
    }
    console.log('商品已移除，目前的購物車內容：', itemsInCart);

    // 如果購物車變空，顯示「購物袋是空的」的訊息
    if (Object.keys(itemsInCart).length === 0) {
        const cartContainer = document.querySelector('.cart-container');
        const cartEmptyMessage = document.createElement('div');
        cartEmptyMessage.classList.add('cart-empty-message');
        cartEmptyMessage.innerHTML = '<h1>購物袋是空的</h1>';
        cartContainer.prepend(cartEmptyMessage);
        const cartList = document.querySelector('.cart-list');
        cartList.remove();
    };
}
// 數量選擇器
function adjustItemQuantity(productId, change) {
    if (itemsInCart[productId]) {
        itemsInCart[productId].quantity += change;
        if (itemsInCart[productId].quantity < 1) {
            itemsInCart[productId].quantity = 1;
        }

        // 更新該商品的總價
        itemsInCart[productId].itemTotalPrice = itemsInCart[productId].price * itemsInCart[productId].quantity;

        updateCartDOM(itemsInCart);
        console.log(itemsInCart);
    }
}
