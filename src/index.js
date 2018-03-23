// @flow

import React from "react";
import ReactDOM from "react-dom";
import { Render } from "./Render";

const domElement = document.getElementById("root");
if (!domElement) {
  throw new Error("please load a html page with an elemend with id 'root'");
}
ReactDOM.render(<Render />, domElement);
