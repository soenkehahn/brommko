// @flow

import { App } from "./app";
import { Pregenerated } from "./pregenerated";
import { Router } from "react-router-dom";
import { type SceneProperties } from "../fitness";
import { createMemoryHistory } from "history";
import { mount } from "enzyme";
import React from "react";

describe("App", () => {
  let history;
  let app;
  beforeEach(() => {
    history = createMemoryHistory();
    app = mount(
      <Router history={history}>
        <App />
      </Router>
    );
  });

  it("renders the pregenerated levels by default", () => {
    expect(app.find(Pregenerated)).toExist();
  });

  describe("when given scene properties in the path", () => {
    it("renders level generation", () => {
      history.push("/3");
      app.update();
      expect(app.find("Generate")).toExist();
    });

    it("passes the target properties into Generate", () => {
      history.push("/3/1/2/1");
      app.update();
      const expected: SceneProperties = {
        pathLength: 3,
        directionChanges: 1,
        switches: 2,
        directors: 1
      };
      expect(app.find("Generate").instance().sceneProperties).toEqual(expected);
    });

    it("passes the default target properties into Generate when not all are given", () => {
      history.push("/3");
      app.update();
      const expected: SceneProperties = {
        pathLength: 3,
        directionChanges: 0,
        switches: 0,
        directors: 0
      };
      expect(app.find("Generate").instance().sceneProperties).toEqual(expected);
    });
  });

  it("handles invalid paths gracefully", () => {
    history.push("/3/foo");
    app.update();
    const expected: SceneProperties = {
      pathLength: 3,
      directionChanges: 0,
      switches: 0,
      directors: 0
    };
    expect(app.find("Generate").instance().sceneProperties).toEqual(expected);
  });
});
