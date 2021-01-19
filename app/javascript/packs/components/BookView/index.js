import React, { useState, useEffect } from "react";
import "../../../stylesheets/application.css";
import { withRouter } from "react-router-dom";
import noImage from "../../../images/no_image.svg";

function BookView(props) {
  const [details, setDetails] = useState({});

  useEffect(() => {
    const { bookId } = props.match.params;
    fetch(`/products/${bookId}.json`)
      .then((response) => response.json())
      .then((result) => {
        setDetails(result);
      });
  }, []);

  return (
    <section className="flex flex-col sm:flex-row p-4">
      <img
        src={
          details.has_photo
            ? require("../../../images/" + details.photo_path.slice(6))
            : noImage
        }
        alt={details.title}
        className="w-9/12 mx-auto sm:h-64 sm:w-auto sm:flex-shrink-0"
      />
      <div className="flex flex-col p-4">
        <h3 className="text-2xl">{details.title}</h3>
        <h3 className="text-lg pt-4">Preço: R${details.price}</h3>
        <p className="pt-4">Descrição: {details.description} </p>
      </div>
    </section>
  );
}

export default withRouter(BookView);
