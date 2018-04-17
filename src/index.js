// @flow

import { App } from "./components/app";
import { HashRouter } from "react-router-dom";
import React from "react";
import ReactDOM from "react-dom";

function mount(Komponent) {
  const domElement = document.getElementById("root");
  if (!domElement) {
    throw new Error("please load a html page with an elemend with id 'root'");
  }
  ReactDOM.render(
    <HashRouter>
      <Komponent />
    </HashRouter>,
    domElement
  );
}

if (!module.parent) {
  mount(App);
}
