
export function getOrderById( order_id ) {
  return fetch('http://localhost:3000/orderItem/'+order_id, {
    method: 'get',
  }).then(res => res.json())
}
