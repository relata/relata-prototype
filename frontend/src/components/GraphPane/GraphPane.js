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
      .renderDot(currentWork.digraph);

    // Add click handlers to all nodes except for current work
    d3.selectAll(".relation-node").on("click", node => {
      selectWork(node.key);
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