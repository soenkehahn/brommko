// @flow

import { Pregenerated } from "./pregenerated";
import { Route, Switch } from "react-router-dom";
import { mkGenerate } from "./generate";
import React, { Component, type ComponentType } from "react";

export class App extends Component<{}> {
  render() {
    return (
      <div>
        <Switch>
          <Route exact path="/" component={Pregenerated} />
          <Route
            path="/:pathLength/:directionChanges?/:switches?/:directors?"
            component={GenerateFromParams}
          />
        </Switch>
      </div>
    );
  }
}

type GenerateParams = {
  pathLength: ?string,
  directionChanges: ?string,
  switches: ?string,
  directors: ?string
};

class GenerateFromParams extends Component<
  { match: { params: GenerateParams } },
  { inner: null | ComponentType<*> }
> {
  constructor(props: { match: { params: GenerateParams } }): void {
    super(props);
    this.state = { inner: null };
    (async () => {
      const inner = await this.mkInner(props.match.params);
      this.setState({ inner });
    })();
  }

  async mkInner(params: GenerateParams): Promise<ComponentType<*>> {
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

    return await mkGenerate({
      pathLength: parse(2, params.pathLength),
      directionChanges: parse(0, params.directionChanges),
      switches: parse(0, params.switches),
      directors: parse(0, params.directors)
    });
  }

  render() {
    const Generate = this.state.inner;
    if (Generate !== null) {
      return <Generate />;
    } else {
      return <div />;
    }
  }
}
