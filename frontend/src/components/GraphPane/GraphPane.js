import React, { Component } from "react";

import * as d3 from "d3";
import "d3-graphviz";

class GraphPane extends Component {
  drawGraph = () => {
    const { currentWork, selectWork } = this.props;

    // Draw graph
    const graphTransition = d3
      .transition()
      .duration(360)
      .ease(d3.easeQuad);
    d3.select("#graph")
      .graphviz({ zoom: false })
      .transition(graphTransition)
      .renderDot(currentWork.digraph)
      .on("end", () => {
        d3.selectAll(".relation-node")
          .attr("tabindex", "0")
          .on("click", node => {
            selectWork(node.key);
          })
          .on("keypress", node => {
            if (d3.event.keyCode === 13) {
              selectWork(node.key);
            }
          });
      });
  };

  componentDidUpdate() {
    this.drawGraph();
  }

  render() {
    return <div id="graph"></div>;
  }
}

export default GraphPane;
