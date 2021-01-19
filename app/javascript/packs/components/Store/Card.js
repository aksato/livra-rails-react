import React from "react";
import "../../../stylesheets/application.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingBasket } from "@fortawesome/free-solid-svg-icons";
import noImage from "../../../images/no_image.svg";
import { Link } from "react-router-dom";

const Card = (props) => {
  const { book, setTotal } = props;
  const formattedPrice = parseFloat(book.price).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  function postLineItem(id) {
    const csrf = document
      .querySelector("meta[name='csrf-token']")
      .getAttribute("content");
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": csrf,
      },
      body: JSON.stringify({ product_id: id }),
    };
    fetch("/line_items.json", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        setTotal(data.cart_total);
      });
  }

  return (
    <div className="w-full sm:self-stretch sm:w-1/2 lg:w-1/3 xl:w-1/4 flex flex-col items-center py-8 px-4">
      <Link to={`/books/${book.id}`}>
        <img
          src={
            book.has_photo
              ? require("../../../images/" + book.photo_path.slice(6))
              : noImage
          }
          alt={book.title}
          className="h-64"
        />
      </Link>
      <Link
        to={`/books/${book.id}`}
        className="text-base text-center py-4 sm:flex-grow hover:text-gray-500 hover:bg-transparent"
      >
        {book.title}
      </Link>
      <p className="text-xl">R${formattedPrice}</p>
      <button
        onClick={() => postLineItem(book.id)}
        className="w-full btn cursor-pointer"
      >
        <FontAwesomeIcon icon={faShoppingBasket} className="text-2xl pr-3" />
        <span className="text-sm">Comprar</span>
      </button>
    </div>
  );
};

export default Card;
