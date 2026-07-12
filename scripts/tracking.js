import { getOrder } from "../data/orders.js";
import { getProduct, loadProductsFetch } from "../data/products.js";
import { address, loadFromStorage, updateAddress, getShortAddress } from "../data/address.js";
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';
import { cart, calculateCartQuantity } from "../data/cart.js";

async function loadPage() {
  await loadProductsFetch();

  document.querySelector('.js-deliver-to').innerHTML = getShortAddress();
  document.querySelector('.js-cart-quantity').innerHTML = calculateCartQuantity();

  const url = new URL(window.location.href);
  const orderId = url.searchParams.get('orderId');
  const productId = url.searchParams.get('productId');

  const order = getOrder(orderId)
  const product = getProduct(productId);

  let productDetails;
  order.products.forEach((details) => {
    if (details.productId === product.id) {
      productDetails = details;
    }
  });


  const today = dayjs();
  const orderTime = dayjs(order.orderTime);
  const deliveryTime = dayjs(productDetails.estimatedDeliveryTime);
  const percentProgress = ((today - orderTime) / (deliveryTime - orderTime)) * 100;

  const deliveredMessage = today < deliveryTime ? 'Arriving on' : 'Delivered on';

  const trackingHTML = `
    <a class="back-to-orders-link link-primary" href="orders.html">
      View all orders
    </a>
    
    <div class="delivery-date">
      ${deliveredMessage} ${
        dayjs(productDetails.estimatedDeliveryTime).format('dddd, MMMM D')
      }
    </div>

    <div class="product-info">
      ${product.name}
    </div>

    <div class="product-info">
      Quantity: ${productDetails.quantity}
    </div>

    <img class="product-image" src="${product.image}"></img>

    <div class="progress-labels-container">
      <div class="progress-label ${
        percentProgress < 50 ? 'current-status' : ''
      }">
        Preparing
      </div>
      <div class="progress-label ${
        (percentProgress >= 50 && percentProgress < 100) ? 'current-status' : ''
      }">
        Shipped
      </div>
      <div class="progress-label ${
        percentProgress >= 100 ? "current-status" : ''
      }">
        Delivered
      </div>
    </div>

    <div class="progress-bar-container">
      <div class="progress-bar" style="width: ${percentProgress}%;"></div>
    </div>

    
    <div class="delivery-address-container js-delivery-address-container">
      <div class="delivery-address-title">Delivery Address</div>

      <div class="delivery-address-display">
        <div>${address.name}</div>
        <div>${address.line1}</div>
        ${address.line2 ? `<div>${address.line2}</div>` : ''}
        <div>${address.city}, ${address.state} ${address.zip}</div>
        <div>${address.country}</div>
      </div>

      <button class="edit-address-button link-primary js-edit-address">
        Change delivery address
      </button>

      <div class="delivery-address-edit">
        <label class="address-field">
          Full Name
          <input class="address-input js-address-name" value="${address.name}">
        </label>
        <label class="address-field">
          Address Line 1
          <input class="address-input js-address-line1" value="${address.line1}">
        </label>
        <label class="address-field">
          Address Line 2 (optional)
          <input class="address-input js-address-line2" value="${address.line2}">
        </label>
        <label class="address-field">
          City
          <input class="address-input js-address-city" value="${address.city}">
        </label>
        <label class="address-field">
          State
          <input class="address-input js-address-state" value="${address.state}">
        </label>
        <label class="address-field">
          ZIP Code
          <input class="address-input js-address-zip" value="${address.zip}">
        </label>
        <label class="address-field">
          Country
          <input class="address-input js-address-country" value="${address.country}">
        </label>

        <div class="address-edit-buttons">
          <button class="button-primary save-address-btn js-save-address">Save address</button>
          <button class="button-secondary cancel-address-btn js-cancel-address">Cancel</button>
        </div>
      </div>
    </div>
  `;

  document.querySelector('.js-order-tracking').innerHTML = trackingHTML;

  const addressContainer = document.querySelector('.js-delivery-address-container');

  document.querySelector('.js-edit-address').addEventListener('click', () => {
    addressContainer.classList.add('is-editing-address');
  });

  document.querySelector('.js-cancel-address').addEventListener('click', () => {
    addressContainer.classList.remove('is-editing-address');
  });

  document.querySelector('.js-save-address').addEventListener('click', () => {
    const name = document.querySelector('.js-address-name').value.trim();
    const line1 = document.querySelector('.js-address-line1').value.trim();
    const line2 = document.querySelector('.js-address-line2').value.trim();
    const city = document.querySelector('.js-address-city').value.trim();
    const state = document.querySelector('.js-address-state').value.trim();
    const zip = document.querySelector('.js-address-zip').value.trim();
    const country = document.querySelector('.js-address-country').value.trim();

    if (!name || !line1 || !city || !state || !zip || !country) {
      alert('Please fill in all required address fields.');
      return;
    }

    updateAddress({ name, line1, line2, city, state, zip, country });

    loadPage();
  });
} 
        
loadPage();
document.querySelector('.js-cart-quantity').innerHTML = calculateCartQuantity();