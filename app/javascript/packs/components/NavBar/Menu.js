import React from "react";
import "../../../stylesheets/application.css";
import { Link } from "react-router-dom";

const menuItems = [
  { title: "Blog", link: "/blog" },
  { title: "Perguntas", link: "/perguntas" },
  { title: "Notícias", link: "/noticias" },
  { title: "Contato", link: "/contato" },
];

const Menu = (props) => {
  const { open } = props;
  return (
    <nav className="w-full md:w-auto md:block">
      <ul>
        {menuItems.map((item) => (
          <Link key={item.link} to={item.link}>
            <li
              className={
                "text-white hover:text-gray-300 pt-4 md:inline md:px-4 " +
                (!open && "hidden")
              }
            >
              {item.title}
            </li>
          </Link>
        ))}
      </ul>
    </nav>
  );
};

export default Menu;
