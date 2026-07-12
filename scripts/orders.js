import { getProduct, loadProductsFetch, products } from "../data/products.js";
import { orders, getOrder, cancelOrderItem } from "../data/orders.js";
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';
import { formatCurrency } from "./utils/money.js";
import { addToCart, cart, calculateCartQuantity } from "../data/cart.js";

async function loadPage() {
  await loadProductsFetch();

  let ordersHTML = '';

  orders.forEach((order) => {
    if (!order.products || order.products.length === 0) {
      return;
    }

    const orderTimeString = dayjs(order.orderTime).format('MMMM D');

    ordersHTML += `
      <div class="order-container">
        
        <div class="order-header">
          <div class="order-header-left-section">
            <div class="order-date">
              <div class="order-header-label">Order Placed:</div>
              <div>${orderTimeString}</div>
            </div>
            <div class="order-total">
              <div class="order-header-label">Total:</div>
              <div>$${formatCurrency(order.totalCostCents)}</div>
            </div>
          </div>

          <div class="order-header-right-section">
            <div class="order-header-label">Order ID:</div>
            <div>${order.id}</div>
          </div>
        </div>

        <div class="order-details-grid">
          ${productsListHTML(order)}
        </div>
      </div>
    `;
  });

  function productsListHTML(order) {
    let productsListHTML = '';

    if (!order.products) {
      return productsListHTML; 
    }

    /*
    order.products.forEach((productDetails) => {
      const product = getProduct(productDetails.productId);
      const isCancelled = productDetails.isCancelled;

      productsListHTML += `
        <div class="product-image-container">
          <img src="${product.image}">
        </div>

        <div class="product-details">
          <div class="product-name">
            ${product.name}
          </div>
          <div class="product-delivery-date">
            ${isCancelled
              ? '<span class="cancelled-label">Cancelled</span>'
              : `Arriving on: ${dayjs(productDetails.estimatedDeliveryTime).format('MMMM D')}`
            }
          </div>
          <div class="product-quantity">
            Quantity: ${productDetails.quantity}
          </div>
          ${isCancelled ? '' : `
            <button class="buy-again-button button-primary js-bye-again" 
              data-product-id="${product.id}">
              <img class="buy-again-icon" src="images/icons/buy-again.png">
              <span class="buy-again-message">Buy it again</span>
            </button>
          `}  
        </div>

        <div class="product-actions">
          ${isCancelled ? '' : `
            <a href="tracking.html?orderId=${order.id}&productId=${product.id}">
              <button class="track-package-button button-secondary">
                Track package
              </button>
            </a>
            <button class="cancel-item-button button-secondary js-cancel-item"
              data-order-id="${order.id}" 
              data-product-id="${product.id}">
              Cancel item
            </button>
          `}          
        </div>
      `;
    });

    return productsListHTML;
    */

    order.products.forEach((productDetails) => {
      const product = getProduct(productDetails.productId);

      productsListHTML += `
        <div class="product-image-container">
          <img src="${product.image}">
        </div>

        <div class="product-details">
          <div class="product-name">
            ${product.name}
          </div>
          <div class="product-delivery-date">
            Arriving on: ${dayjs(productDetails.estimatedDeliveryTime).format('MMMM D')}
          </div>
          <div class="product-quantity">
            Quantity: ${productDetails.quantity}
          </div>
          <button class="buy-again-button button-primary js-bye-again" 
            data-product-id="${product.id}">
            <img class="buy-again-icon" src="images/icons/buy-again.png">
            <span class="buy-again-message">Buy it again</span>
          </button>
        </div>

        <div class="product-actions">
          <a href="tracking.html?orderId=${order.id}&productId=${product.id}">
            <button class="track-package-button button-secondary">
              Track package
            </button>
          </a>
          <button class="cancel-item-button button-secondary js-cancel-item"
            data-order-id="${order.id}" data-product-id="${product.id}">
            Cancel item
          </button>
        </div>
      `;
    });

    return productsListHTML;
  }
  

  document.querySelector('.js-orders-grid').innerHTML = ordersHTML;
  document.querySelector('.js-cart-quantity').innerHTML = calculateCartQuantity();

  document.querySelectorAll('.js-bye-again').forEach((button) => {
    button.addEventListener('click', () => {
      addToCart(button.dataset.productId);

      document.querySelector('.js-cart-quantity').innerHTML = calculateCartQuantity();
      
      button.innerHTML = 'Added';

      setTimeout(() => {
        button.innerHTML = `
          <img class="buy-again-icon" src="images/icons/buy-again.png">
          <span class="buy-again-message">Buy it again</span>
        `;
      }, 1000);
    });
  });

  document.querySelectorAll('.js-cancel-item').forEach((button) => {
    button.addEventListener('click', () => {
      if (confirm('Cancel this item? It will be added back to your cart.')) {
        const {orderId, productId} = button.dataset;

        const order = getOrder(orderId);
        let cancelledItem;
        order.products.forEach((productDetails) => {
          if (productDetails.productId === productId) {
            cancelledItem = productDetails;
          }
        });
        const quantity = cancelledItem.quantity;

        cancelOrderItem(orderId, productId);
        addToCart(productId, quantity);

        loadPage();
      }
    });
  });

  // let cartQuantity = 0;
  //   cart.forEach((cartItem) => {
  //     cartQuantity += cartItem.quantity;
  //   });
  // document.querySelector('.js-cart-quantity').innerHTML = cartQuantity;
  // document.querySelector('.js-cart-quantity').innerHTML = calculateCartQuantity();
}

loadPage();