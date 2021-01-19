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
const CartIcon = ({ total }) => (
  <Link className="group md:order-last flex" to="/cart">
    <FontAwesomeIcon
      icon={faShoppingCart}
      className="text-white text-xl group-hover:text-gray-300 hover:bg-transparent"
    />
    <span
      className={`rounded-full -ml-1 -mt-2 self-start flex items-center justify-center bg-red-500 group-hover:bg-red-700 text-white group-hover:text-gray-300 w-${
        total < 10 ? 4 : 5
      } h-4`}
    >
      <p>{total}</p>
    </span>
  </Link>
);

function NavBar(props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { total } = props;

  return (
    <header className="w-full bg-green-500 text-white">
      <div className="max-w-screen-xl mx-auto p-4 flex items-center justify-between flex-wrap">
        <MenuButton
          onClick={() => {
            setMenuOpen(!menuOpen);
          }}
        />
        <Logo />
        <CartIcon total={total} />
        <Menu open={menuOpen} />
      </div>
    </header>
  );
}

export default NavBar;
