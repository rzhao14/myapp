
export function getOrderById( order_id ) {
  return fetch('http://localhost:3000/orderItem/'+order_id, {
    method: 'get',
  }).then(res => res.json())
}
export function getOrderTotal() {
  return fetch('http://localhost:3000/ordersTotal', {
    method: 'get',
  }).then(res => res.json())
}
export function getOrderItemByName( order_name ) {
  return fetch('http://localhost:3000/orderItem/name/'+order_name, {
    method: 'get',
  }).then(res => res.json())
}
export function getOrderByName( order_name ) {
  return fetch('http://localhost:3000/orders/name/'+order_name, {
    method: 'get',
  }).then(res => res.json())
}
export function getRecentOrders() {
  return fetch('http://localhost:3000/orders', {
    method: 'get',
  }).then(res => res.json())
}
export function generateOrderWithNameAndModels(queryJsonString) {
  return fetch('http://localhost:3000/orders', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(queryJsonString),
  }).then(res => res.json())
}

export function updateData(data) {
  return fetch('http://localhost:3000/orderItem/update', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data),
  }).then(res => res.json())
}
