
export function getOrderById( order_id ) {
  return fetch('http://localhost:3000/orderItem/'+order_id, {
    method: 'get',
  }).then(res => res.json())
}
export function getOrderByName( order_name ) {
  return fetch('http://localhost:3000/orderItem/name/'+order_name, {
    method: 'get',
  }).then(res => res.json())
}
export function getRecentOrders() {
  return fetch('http://localhost:3000/orders', {
    method: 'get',
  }).then(res => res.json())
}
