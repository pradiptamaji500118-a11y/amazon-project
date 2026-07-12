import { getProduct } from "./products.js";
export const orders = JSON.parse(localStorage.getItem('orders')) || [];

export function addOrder(order) {
  orders.unshift(order);
  saveToStorage();
}

function saveToStorage() {
  localStorage.setItem('orders', JSON.stringify(orders));
}

export function getOrder(orderId) {
  let matchingOrder;

  orders.forEach((order) => {
    if (order.id === orderId) {
      matchingOrder = order;
    }
  });

  return matchingOrder;
}

export function cancelOrderItem(orderId, productId) {
  const order = getOrder(orderId);

  if (!order) {
    return;
  }

  let cancelledItem;
  let cancelledIndex = -1;

  order.products.forEach((productDetails, index) => {
    if (productDetails.productId === productId) {
      cancelledItem = productDetails;
      cancelledIndex = index;
    }
  });

  const product = getProduct(productId);

  const itemPriceCents = product.priceCents * cancelledItem.quantity;
  const itemPriceWithTaxCents = itemPriceCents * 1.1;

  order.totalCostCents -= itemPriceWithTaxCents;
  if (order.totalCostCents < 0) {
    order.totalCostCents = 0;
  }

  order.products.splice(cancelledIndex, 1);

  if (order.products.length === 0) {
    const orderIndex = orders.findIndex((o) => o.id === orderId);
    if (orderIndex !== -1) {
      orders.splice(orderIndex, 1);
    }
  }

  saveToStorage();
}