// @flow

import { Pregenerated } from "./pregenerated";
import { Route, Switch } from "react-router-dom";
import { mkGenerate } from "./generate";
import React, { Component, type Element } from "react";

const GenerateFromUrl: ({
  match: {
    params: {
      pathLength: ?string,
      directionChanges: ?string,
      switches: ?string,
      directors: ?string
    }
  }
}) => Element<*> = ({ match }) => {
  function parse(def: number, input: ?string): number {
    if (input !== null && input !== undefined) {
      const result = parseInt(input);
      if (isNaN(result)) {
        return def;
      } else {
        return result;
      }
    } else {
      return def;
    }
  }

  const Generate = mkGenerate({
    pathLength: parse(2, match.params.pathLength),
    directionChanges: parse(0, match.params.directionChanges),
    switches: parse(0, match.params.switches),
    directors: parse(0, match.params.directors)
  });

  return <Generate />;
};

export class App extends Component<{}> {
  render() {
    return (
      <div>
        <Switch>
          <Route exact path="/" component={Pregenerated} />
          <Route
            path="/:pathLength/:directionChanges?/:switches?/:directors?"
            component={GenerateFromUrl}
          />
        </Switch>
      </div>
    );
  }
}
