import React, { useState, useEffect } from "react";
import "../../../stylesheets/application.css";
import noImage from "../../../images/no_image.svg";

function Cart() {
  const [cart, setCart] = useState({});

  useEffect(() => {
    fetch("/carts/current.json")
      .then((response) => response.json())
      .then((result) => {
        setCart(result);
      });
  }, []);

  function formatPrice(price) {
    return parseFloat(price).toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  const line_items = (cart && cart.line_items) || [];

  return (
    <section>
      <table className="table-fixed w-full m-4">
        <thead>
          <tr className="bg-gray-500 text-white text-base">
            <th className="py-2 w-1/2 ">Produto</th>
            <th className="py-2 w-2/12 text-left">Preço</th>
            <th className="py-2 w-2/12 text-left">Quantidade</th>
            <th className="py-2 w-2/12 text-left">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {line_items.map((item) => (
            <tr key={item.id}>
              <td className="py-4 flex items-center text-sm">
                <img
                  src={
                    item.product_has_photo
                      ? require("../../../images/" +
                          item.product_photo_path.slice(6))
                      : noImage
                  }
                  alt={item.product_title}
                  className="h-12"
                />
                <span className="pl-4">{item.product_title}</span>
              </td>
              <td className="py-4 text-sm">
                {formatPrice(item.product_price)}
              </td>
              <td className="py-4 text-sm">{item.quantity}</td>
              <td className="py-4 text-sm">
                {formatPrice(item.product_price * item.quantity)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="w-full flex justify-end">
        <div className="w-full md:max-w-md">
          <h2 className="text-3xl pb-2 mt-8">Total no carrinho</h2>
          <p className="text-sm py-4">
            <span className="font-bold mr-4 ">Total</span>
            {formatPrice(
              line_items.reduce(
                (a, b) => a + b["product_price"] * b["quantity"],
                0
              )
            )}
          </p>
        </div>
      </div>
    </section>
  );
}

export default Cart;
