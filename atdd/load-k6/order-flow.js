import { check } from 'k6';
import http from 'k6/http';

export default function () {
  const host = 'http://localhost:8000';

  let productItem = http.get(`${host}/api/v1/product/1`, {
    headers: {
      Accept: 'application/json',
    },
  });

  check(productItem, {
    'product list OK': (r) => r.status === 200,
  });

  var payload = JSON.stringify({
    cart: [
      {
        product_id: productItem.json().id, //JSON.parse(res.body).id,
        quantity: 2,
      },
    ],
    shipping_method: 'Kerry',
    shipping_address: '405/37 ถ.มหิดล',
    shipping_sub_district: 'ท่าศาลา',
    shipping_district: 'เมือง',
    shipping_province: 'เชียงใหม่',
    shipping_zip_code: '50000',
    recipient_name: 'ณัฐญา ชุติบุตร',
    recipient_phone_number: '0970809292',
  });

  var params = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  };

  let order = http.post(`${host}/api/v1/order`, payload, params);
  check(order, {
    'order OK': (res) => res.status === 200,
  });

  let confirmPayment = http.post(
    `${host}/api/v1/confirmPayment`,
    JSON.stringify({
      order_id: order.json().order_id,
      payment_type: 'credit',
      type: 'visa',
      card_number: '4719700591590995',
      cvv: '752',
      expired_month: 7,
      expired_year: 20,
      card_name: 'Karnwat Wongudom',
      total_price: 241.9,
    }),
    params
  );
  check(confirmPayment, {
    'confirm payment OK': (res) => res.status === 200,
  });
}

// k6 run -u 10 -d 30s order-flow.js
