import {cart, addToCart, calculateCartQuantity} from '../data/cart.js';
import {products, loadProducts} from '../data/products.js';
import { formatCurrency } from './utils/money.js';
import { getShortAddress } from '../data/address.js';

loadProducts(renderProductsGrid);

function renderProductsGrid() {
  // let productsHTML = '';

  // products.forEach((product) => {
    const url = new URL(window.location.href);
    const search = url.searchParams.get('search');

    let filteredProducts = products;

    if (search) {
      filteredProducts = products.filter((product) => {
        let matchingKeyword = false;

        product.keywords.forEach((keyword) => {
          if (keyword.toLowerCase().includes(search.toLowerCase())) {
            matchingKeyword = true;
          }
        });

        return matchingKeyword ||
          product.name.toLowerCase().includes(search.toLowerCase());
      });
    }

    let productsHTML = '';

    filteredProducts.forEach((product) => {
      productsHTML += `<div class="product-container">
            <div class="product-image-container">
              <img class="product-image"
                src="${product.image}">
            </div>

            <div class="product-name limit-text-to-2-lines">
              ${product.name}
            </div>

            <div class="product-rating-container">
              <img class="product-rating-stars"
                src="${product.getStarsUrl()}">
              <div class="product-rating-count link-primary">
                ${product.rating.count}
              </div>
            </div>

            <div class="product-price">
              ${product.getPrice()}
            </div>

            <div class="product-quantity-container">
              <select class="js-quantity-selector-${product.id}">
                <option selected value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="9">9</option>
                <option value="10">10</option>
              </select>
            </div>

            ${product.extraInfoHTML()}

            <div class="product-spacer"></div>

            <div class="added-to-cart js-added-to-cart-${product.id}">
              <img src="images/icons/checkmark.png">
              Added
            </div>

            <button class="add-to-cart-button button-primary js-add-to-cart-button"
            data-product-id="${product.id}">
              Add to Cart
            </button>
          </div>`;
    });
  

  document.querySelector('.js-products-grid').innerHTML = productsHTML;

  const deliverToElement = document.querySelector('.js-deliver-to');
  if (deliverToElement) {
    deliverToElement.innerHTML = getShortAddress();
  }

  const addedMessageTimeouts = {};

  function updateCartQuanitity() {
    // let cartQuantity = 0;

    //   cart.forEach((cartItem) => {
    //     cartQuantity += cartItem.quantity;
    //   });
    const cartQuantity = calculateCartQuantity();
  
    document.querySelector('.js-cart-quantity').innerHTML = cartQuantity;
  }

  updateCartQuanitity();

  document.querySelectorAll('.js-add-to-cart-button').forEach((button, index) => {
    button.addEventListener('click', () => { 

      const productId = button.dataset.productId;
      const quantitySelector = document.querySelector(`.js-quantity-selector-${productId}`);
      const quantity = Number(quantitySelector.value);

      addToCart(productId, quantity);

      updateCartQuanitity();

      const addedMessage = document.querySelector(
          `.js-added-to-cart-${productId}`
      );

      addedMessage.classList.add('added-to-cart-visible');

      const previousTimeoutId = addedMessageTimeouts[productId];
      if (previousTimeoutId) {
        clearTimeout(previousTimeoutId);
      }

      const timeoutId = setTimeout(() => {
        addedMessage.classList.remove('added-to-cart-visible');
      }, 2000);

      addedMessageTimeouts[productId] = timeoutId;
      
    });
  });

  /*
  document.querySelector('.js-search-button').addEventListener('click', () => {
    const search = document.querySelector('.js-search-bar').value;
    window.location.href = `amazon.html?search=${search}`;
  });

  document.querySelector('.js-search-bar').addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      const searchTerm = document.querySelector('.js-search-bar').value;
      window.location.href = `amazon.html?search=${searchTerm}`;
    }
  });
  */

  setupSearchBar(search);
}

function setupSearchBar(activeSearch) {
  const searchBar = document.querySelector('.js-search-bar');
  const searchButton = document.querySelector('.js-search-button');
  const searchIcon = document.querySelector('.js-search-icon');

  // const oldSearchButton = document.querySelector('.js-search-button');
  // const searchButton = oldSearchButton.cloneNode(true);
  // oldSearchButton.replaceWith(searchButton);

  if (activeSearch) {
    searchBar.value = activeSearch;
    searchIcon.src = 'images/icons/close.png';
    searchButton.classList.add('js-clear-search-button');
  } else {
    searchIcon.src = 'images/icons/search-icon.png';
    searchBar.classList.remove('js-clear-search-button');
  }

  searchButton.addEventListener('click', () => {
    if (searchButton.classList.contains('js-clear-search-button')) {
      window.location.href = 'amazon.html';
    } else {
      const searchTerm = searchBar.value;
      window.location.href = `amazon.html?search=${searchTerm}`;
    }
  });

  searchBar.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      const searchTerm = searchBar.value;
      window.location.href = `amazon.html?search=${searchTerm}`;
    }
  });
}