import React from "react";
import "../../../stylesheets/application.css";

const menuItems = ["Blog", "Perguntas", "Notícias", "Contato"];

const Menu = (props) => {
  const { open } = props;
  return (
    <nav className="w-full md:w-auto md:block">
      <ul>
        {menuItems.map((item, id) => (
          <li
            key={id}
            className={"pt-4 md:inline md:px-4 " + (!open && "hidden")}
          >
            {item}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Menu;
