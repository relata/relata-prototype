import React, { Component } from "react";

import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

import GraphPane from "./GraphPane/GraphPane";
import Navigation from "./Navigation/Navigation";
import RelationsPane from "./RelationsPane/RelationsPane";

import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-typeahead/css/Typeahead.css";
import "./App.css";

import client from "../feathers";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentWork: { relationsFrom: [] },
      relataConfig: {}
    };
  }

  componentDidMount() {
    // Select a work and get Relata config to populate initial state
    this.setInitialState();
  }

  getRelataConfig = () => {
    client
      .service("config")
      .find()
      .then(relataConfig => {
        this.setState({ relataConfig: relataConfig });
      });
  };

  // Fetch initial work and Relata config. It's important to use this instead
  // of selectWork for the initial load; otherwise, the multiple initial API
  // calls cause cryptic GraphViz errors for some reason. This seems to be the
  // best workaround
  setInitialState = () => {
    const initialWorkId = 1;
    client
      .service("graphs")
      .get(initialWorkId)
      .then(graph => {
        this.setState({
          currentWork: graph
        });
        this.getRelataConfig();
      });
  };

  // Fetch a new work graph from the Feathers backend
  selectWork = workId => {
    client
      .service("graphs")
      .get(workId)
      .then(graph => {
        this.setState({
          currentWork: graph
        });
      });
  };

  // Look up the configured color for a given relation type
  getRelationColor = relationType => {
    const { relataConfig } = this.state;
    try {
      const typeConfig =
        relataConfig.types[relationType] || relataConfig.types["*"];
      return typeConfig.color;
    } catch (error) {
      // Return default color if there was an error looking up the color, e.g.,
      // if relataConfig is not yet loaded from the backend
      return "#666666";
    }
  };

  render() {
    const { currentWork, relataConfig } = this.state;
    return (
      <div className="App">
        <Navigation
          getRelationColor={this.getRelationColor}
          selectWork={this.selectWork}
        />
        {/* eslint-disable-next-line */}
        <a id="content" style={{ position: "absolute", top: 0 }}></a>
        <Container fluid="true" className="mt-3">
          <Row>
            <Col sm={12} md={4} className="mb-3">
              <RelationsPane
                relataConfig={relataConfig}
                currentWork={currentWork}
                selectWork={this.selectWork}
              />
            </Col>
            <Col sm={12} md={8}>
              <GraphPane
                currentWork={currentWork}
                selectWork={this.selectWork}
              />
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default App;
