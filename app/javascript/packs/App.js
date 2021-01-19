import React, { useEffect, useState } from "react";
import "../stylesheets/application.css";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import Store from "./components/Store";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import BookView from "./components/BookView";
import Cart from "./components/Cart";

const GenericPage = (props) => (
  <h1 className="text-center p-4 text-lg">{props.title}</h1>
);
const Blog = () => <GenericPage title="Blog Page" />;
const Perguntas = () => <GenericPage title="Perguntas Page" />;
const Noticias = () => <GenericPage title="Noticias Page" />;
const Contato = () => <GenericPage title="Contato Page" />;

function App() {
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetch("/carts/current.json")
      .then((response) => response.json())
      .then((result) => {
        setTotal(result.cart_total);
      });
  }, []);

  return (
    <Router>
      <div className="flex flex-col h-screen justify-between overflow-y-scroll">
        <NavBar total={total} />
        <main className="w-full max-w-screen-xl mx-auto flex-grow">
          <Switch>
            <Route
              path="/"
              exact
              render={(props) => <Store {...props} setTotal={setTotal} />}
            />
            <Route path="/blog" component={Blog} />
            <Route path="/perguntas" component={Perguntas} />
            <Route path="/noticias" component={Noticias} />
            <Route path="/contato" component={Contato} />
            <Route path="/books/:bookId" component={BookView} />
            <Route path="/cart" component={Cart} />
          </Switch>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
