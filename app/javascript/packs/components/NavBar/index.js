import React, { useState } from "react";
import "../../../stylesheets/application.css";
import logo from "../../../images/logo.svg";
import Menu from "./Menu";
import MenuButton from "./MenuButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const Logo = () => (
  <Link to="/">
    <img src={logo} className="h-6" alt="A Livraria" />
  </Link>
);
const CartIcon = () => (
  <FontAwesomeIcon
    icon={faShoppingCart}
    className="text-white text-xl hover:text-gray-300 hover:bg-transparent md:order-last"
  />
);

function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="w-full bg-green-500 text-white">
      <div className="max-w-screen-xl mx-auto p-4 flex items-center justify-between flex-wrap">
        <MenuButton
          onClick={() => {
            setMenuOpen(!menuOpen);
          }}
        />
        <Logo />
        <CartIcon />
        <Menu open={menuOpen} />
      </div>
    </header>
  );
}

export default NavBar;
