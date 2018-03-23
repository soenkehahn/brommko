// @flow

import React, { Component } from "react";

export class Render extends Component<{}> {
  svgWidth: number;
  svgHeight: number;

  constructor() {
    super();
    this.svgWidth = 800;
    this.svgHeight = 500;
  }

  transformX(x: number): number {
    return this.svgWidth / 2 + x;
  }

  transformY(y: number): number {
    return this.svgHeight / 2 + y;
  }

  render() {
    const size = 40;
    return (
      <svg width={this.svgWidth} height={this.svgHeight}>
        <rect
          x={this.transformX(0)}
          y={this.transformY(0)}
          width={size}
          height={size}
          fill="green"
        />
      </svg>
    );
  }
}
