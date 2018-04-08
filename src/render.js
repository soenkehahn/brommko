// @flow

import React, { Component, type Element } from "react";
import { Scene, type Position } from "./scene";

export class Render extends Component<{ scene: Scene }> {
  svgWidth: number = 800;
  svgHeight: number = 500;
  size: number = 40;

  transformX(x: number): number {
    return this.svgWidth / 2 + x;
  }

  transformY(y: number): number {
    return this.svgHeight / 2 + y;
  }

  renderRect(position: Position, color: string, key: string): Element<*> {
    return (
      <rect
        x={this.transformX(position.x * this.size)}
        y={this.transformY(-position.y * this.size)}
        width={this.size}
        height={this.size}
        fill={color}
        key={key}
      />
    );
  }

  render() {
    return (
      <svg width={this.svgWidth} height={this.svgHeight}>
        {this.props.scene.walls.map((wall, i) =>
          this.renderRect(wall, "grey", i.toString())
        )}
        {this.renderRect(this.props.scene.goal, "green", "goal")}
        {this.renderRect(this.props.scene.player, "blue", "player")}
      </svg>
    );
  }
}
