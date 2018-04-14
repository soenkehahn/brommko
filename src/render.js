// @flow

import React, { Component, type Element } from "react";
import { Scene, type Position } from "./scene";

export class Render extends Component<{ scene: Scene }> {
  svgWidth: number = 800;
  svgHeight: number = 500;
  size: number = 40;

  mkPositionTransform(position: Position): string {
    const x = this.svgWidth / 2 + position.x * this.size;
    const y = this.svgHeight / 2 + -position.y * this.size;
    return `translate(${x + this.size / 2} ${y + this.size / 2})`;
  }

  renderRect(position: Position, color: string, key: string): Element<*> {
    return (
      <rect
        x={-this.size / 2}
        y={-this.size / 2}
        width={this.size}
        height={this.size}
        fill={color}
        key={key}
        transform={this.mkPositionTransform(position)}
      />
    );
  }

  renderDiamond(position: Position, color: string, key: string): Element<*> {
    const size = this.size;
    return (
      <polygon
        points={`0,-${size / 2} ${size / 2},0 0,${size / 2} -${size / 2},0`}
        transform={this.mkPositionTransform(position)}
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
              const color = s.pushed ? "lightblue" : "red";
              return this.renderRect(s.position, color, i.toString());
            })}
          </g>
          {this.renderRect(this.props.scene.goal, "green", "goal")}
          {this.renderDiamond(this.props.scene.player, "blue", "player")}
          <g>
            {Array.from(this.props.scene.directors).map((d, i) =>
              d.render(this, i)
            )}
          </g>
        </svg>
        {this.props.scene.success ? "Success!!!" : null}
      </div>
    );
  }
}
