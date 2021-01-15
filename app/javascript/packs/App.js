import React from "react";
import "../stylesheets/application.css";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="flex flex-col h-screen justify-between overflow-y-scroll">
      <NavBar />
      <main className="w-full max-w-screen-xl mx-auto flex-grow">
        <h1 className="text-3xl p-4">Hello world react</h1>
      </main>
      <Footer />
    </div>
  );
}

export default App;
