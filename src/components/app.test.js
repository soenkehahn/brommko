// @flow

import { App } from "./app";
import { Pregenerated } from "./pregenerated";
import { Router } from "react-router-dom";
import { type SceneProperties } from "../fitness";
import { createMemoryHistory } from "history";
import { mount } from "enzyme";
import { waitUntil } from "../testUtils";
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
    it("renders level generation", async () => {
      history.push("/3");
      await waitUntil(() => {
        app.update();
        expect(app.find("Generate")).toExist();
      });
    });

    it("passes the target properties into Generate", async () => {
      history.push("/3/1/2/1");
      const expected: SceneProperties = {
        pathLength: 3,
        directionChanges: 1,
        switches: 2,
        directors: 1
      };
      await waitUntil(() => {
        app.update();
        expect(app.find("Generate").instance().sceneProperties).toEqual(
          expected
        );
      });
    });

    it("passes the default target properties into Generate when not all are given", async () => {
      history.push("/3");
      const expected: SceneProperties = {
        pathLength: 3,
        directionChanges: 0,
        switches: 0,
        directors: 0
      };
      await waitUntil(() => {
        app.update();
        expect(app.find("Generate").instance().sceneProperties).toEqual(
          expected
        );
      });
    });
  });

  it("handles invalid paths gracefully", async () => {
    history.push("/3/foo");
    const expected: SceneProperties = {
      pathLength: 3,
      directionChanges: 0,
      switches: 0,
      directors: 0
    };
    await waitUntil(() => {
      app.update();
      expect(app.find("Generate").instance().sceneProperties).toEqual(expected);
    });
  });
});
