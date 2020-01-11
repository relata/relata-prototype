import React, { Component } from "react";

import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

import GraphPane from "./GraphPane";
import Navigation from "./Navigation";
import RelationsPane from "./RelationsPane";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import client from "../feathers";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentWork: { relationsFrom: [] },
      client: client
    };
  }

  componentDidMount() {
    // Select a work to initialize app
    this.selectWork(1);
  }

  // Fetch a new work graph from the Feathers backend
  selectWork = workId => {
    const { client } = this.state;
    const graphsService = client.service("graphs");

    graphsService.get(workId).then(graph => {
      this.setState({
        currentWork: graph
      });
    });
  };

  render() {
    const { currentWork } = this.state;
    return (
      <div className="App">
        <Navigation />
        <Container fluid="true" className="mt-3">
          <Row>
            <Col sm={12} md={4} className="mb-3">
              <RelationsPane
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
