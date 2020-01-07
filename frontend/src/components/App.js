import React, { Component } from "react";

import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

import GraphPane from "./GraphPane";
import Navigation from "./Navigation";
import RelationsPane from "./RelationsPane";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

class App extends Component {
  state = {
    currentWorkBibliography: null,
    currentWorkCitation: null,
    digraph: null,
    relations: []
  };

  componentDidMount() {
    this.selectWork(1);
  }

  selectWork = workId => {
    fetch("/graphs/" + workId)
      .then(response => response.json())
      .then(data => {
        this.setState({
          currentWorkBibliography: data.bibliography,
          currentWorkCitation: data.citation,
          digraph: data.digraph,
          relations: data.relationsFrom
        });
      });
  };

  render() {
    return (
      <div className="App">
        <Navigation />
        <Container fluid="true" className="mt-3">
          <Row>
            <Col sm={12} md={4} className="mb-3">
              <RelationsPane
                currentWorkBibliography={this.state.currentWorkBibliography}
                currentWorkCitation={this.state.currentWorkCitation}
                relations={this.state.relations}
                selectWork={this.selectWork}
              />
            </Col>
            <Col sm={12} md={8}>
              <GraphPane
                digraph={this.state.digraph}
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
