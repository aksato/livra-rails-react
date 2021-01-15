import React from "react";
import "../../../stylesheets/application.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

const MenuButton = (props) => {
  const { onClick } = props;
  return (
    <button className="md:hidden" onClick={onClick}>
      <FontAwesomeIcon
        icon={faBars}
        className="text-white text-xl hover:text-gray-300"
      />
    </button>
  );
};

export default MenuButton;
