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

  renderDiamond(position: Position, color: string, key: string): Element<*> {
    const x = this.transformX(position.x * this.size);
    const y = this.transformY(-position.y * this.size);
    const size = this.size;
    return (
      <polygon
        points={`0,-${size / 2} ${size / 2},0 0,${size / 2} -${size / 2},0`}
        transform={`translate(${x + size / 2} ${y + size / 2})`}
        fill={color}
        key={key}
      />
    );
  }

  render() {
    return (
      <div>
        <svg width={this.svgWidth} height={this.svgHeight}>
          <g>
            {this.props.scene.walls.map((wall, i) =>
              this.renderRect(wall, "grey", i.toString())
            )}
          </g>
          <g>
            {this.props.scene.switches.map((s, i) => {
              console.log("rendering switch", s);
              const color = s.pushed ? "lightblue" : "red";
              console.log(color);
              return this.renderRect(s.position, color, i.toString());
            })}
          </g>
          {this.renderRect(this.props.scene.goal, "green", "goal")}
          {this.renderDiamond(this.props.scene.player, "blue", "player")}
        </svg>
        {this.props.scene.success ? "Success!!!" : null}
      </div>
    );
  }
}
