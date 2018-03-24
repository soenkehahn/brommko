// @flow

import React, { Component, type Element } from "react";
import { Scene, type Position } from "./scene";

export class Render extends Component<{ scene: Scene }> {
  svgWidth: number;
  svgHeight: number;
  size: number;

  constructor() {
    super();
    this.svgWidth = 800;
    this.svgHeight = 500;
    this.size = 40;
  }

  transformX(x: number): number {
    return this.svgWidth / 2 + x;
  }

  transformY(y: number): number {
    return this.svgHeight / 2 + y;
  }

  renderRect(position: Position, color: string): Element<*> {
    return (
      <rect
        x={this.transformX(position.x * this.size)}
        y={this.transformY(-position.y * this.size)}
        width={this.size}
        height={this.size}
        fill={color}
      />
    );
  }

  render() {
    return (
      <svg width={this.svgWidth} height={this.svgHeight}>
        {this.renderRect(this.props.scene.player, "green")}
        {Array.from(this.props.scene.walls).map(wall =>
          this.renderRect(wall, "grey")
        )}
      </svg>
    );
  }
}
