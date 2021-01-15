import React from "react";
import "../stylesheets/application.css";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import Store from "./components/Store";

function App() {
  return (
    <div className="flex flex-col h-screen justify-between overflow-y-scroll">
      <NavBar />
      <main className="w-full max-w-screen-xl mx-auto flex-grow">
        <Store /> {/* MODIFIQUE ESTA LINHA */}
      </main>
      <Footer />
    </div>
  );
}

export default App;
