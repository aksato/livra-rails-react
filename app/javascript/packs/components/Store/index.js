import React, { useState, useEffect } from "react";
import "../../../stylesheets/application.css";
import Card from "./Card";

function Store() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetch("/products.json")
      .then((response) => response.json())
      .then((result) => {
        setBooks(result);
      });
  }, []);

  return (
    <section className="flex flex-col sm:flex-row sm:flex-wrap">
      {books.map((book) => (
        <Card book={book} key={book.id} />
      ))}
    </section>
  );
}

export default Store;
