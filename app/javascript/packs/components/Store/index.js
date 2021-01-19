import React, { useState, useEffect } from "react";
import "../../../stylesheets/application.css";
import Card from "./Card";

function Store(props) {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetch("/products.json")
      .then((response) => response.json())
      .then((result) => {
        setBooks(result);
      });
  }, []);

  const { setTotal } = props;
  return (
    <section className="flex flex-col sm:flex-row sm:flex-wrap">
      {books.map((book) => (
        <Card book={book} key={book.id} setTotal={setTotal} />
      ))}
    </section>
  );
}

export default Store;
