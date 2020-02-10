import React, { Component } from "react";

import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

import GraphPane from "./GraphPane/GraphPane";
import Navigation from "./Navigation/Navigation";
import RelationsPane from "./RelationsPane/RelationsPane";

import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-typeahead/css/Typeahead.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "academicons/css/academicons.min.css";
import "./App.css";

import { client } from "../feathers";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentWork: { relationsFrom: [] },
      currentUser: null,
      relataConfig: {},
      stagedRelation: {
        id: null,
        type: null,
        workFrom: null,
        workTo: null,
        annotation: null
      },
      showEditRelationModal: false
    };
  }

  // Fetch initial work, Relata config, and auth information. It's important
  // to maintain this sequence; otherwise, the multiple initial API calls
  // cause cryptic GraphViz errors for some reason. This seems to be the only
  // best workaround
  setInitialState = () => {
    const initialWorkId = 1;
    client
      .service("graphs")
      .get(initialWorkId)
      .then(graph => {
        this.setState({
          currentWork: graph,
          stagedRelation: {
            id: null,
            type: null,
            workFrom: null,
            workTo: null,
            annotation: null
          },
          showEditRelationModal: false
        });

        // Get config, set relataConfig
        this.getRelataConfig();

        // Login, set currentUser
        this.login();
      });
  };

  componentDidMount() {
    // Select a work and get Relata config to populate initial state
    this.setInitialState();
  }

  login = () => {
    // Attempt to re-authenticate
    client
      .reAuthenticate()
      .then(({ user }) => {
        console.log("Re-authenticated:", user);
        this.setState({ currentUser: user });
      })
      .catch(error => {
        console.log("Failed to re-authenticate:", error);
      });
  };

  logout = async () => {
    console.log("Logging out…");
    await client.logout();
    this.setState({ currentUser: null });
  };

  getRelataConfig = () => {
    client
      .service("config")
      .find()
      .then(relataConfig => {
        this.setState({ relataConfig: relataConfig });
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

  // Modify stagedRelation
  setStagedRelation = relation => {
    this.setState({ stagedRelation: relation });
  };

  // Open or close EditRelationModal
  toggleEditRelationModal = () => {
    const { showEditRelationModal } = this.state;
    if (showEditRelationModal) {
      this.setState({
        stagedRelation: {
          id: null,
          type: null,
          workFrom: null,
          workTo: null,
          annotation: null
        }
      });
    }
    this.setState({
      showEditRelationModal: !showEditRelationModal
    });
  };

  render() {
    const {
      currentUser,
      currentWork,
      relataConfig,
      showEditRelationModal,
      stagedRelation
    } = this.state;
    return (
      <div className="App">
        <Navigation
          currentUser={currentUser}
          getRelationColor={this.getRelationColor}
          logout={this.logout}
          relataConfig={relataConfig}
          selectWork={this.selectWork}
          setStagedRelation={this.setStagedRelation}
          showEditRelationModal={showEditRelationModal}
          stagedRelation={stagedRelation}
          toggleEditRelationModal={this.toggleEditRelationModal}
        />
        {/* eslint-disable-next-line */}
        <a id="content" style={{ position: "absolute", top: 0 }}></a>
        <Container fluid="true" className="mt-3">
          <Row>
            <Col sm={12} md={4} className="mb-3">
              <RelationsPane
                currentUser={currentUser}
                currentWork={currentWork}
                relataConfig={relataConfig}
                selectWork={this.selectWork}
                setStagedRelation={this.setStagedRelation}
                showEditRelationModal={showEditRelationModal}
                stagedRelation={stagedRelation}
                toggleEditRelationModal={this.toggleEditRelationModal}
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
