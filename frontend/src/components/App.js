import React, { Component } from "react";
import { withRouter } from "react-router-dom";

import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

import GraphPane from "./GraphPane/GraphPane";
import Navigation from "./Navigation/Navigation";
import RelationsPane from "./RelationsPane/RelationsPane";
import ErrorPane from "./ErrorPane/ErrorPane";

import "react-bootstrap-typeahead/css/Typeahead.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "academicons/css/academicons.min.css";
import "./App.scss";

import { client } from "../feathers";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentWork: { id: null, relationsFrom: [], relationsTo: [] },
      currentWorkNotFound: false,
      currentUser: null,
      relataConfig: {},
      stagedAnnotation: null,
      stagedRelation: {
        id: null,
        type: null,
        workFrom: null,
        workTo: null
      },
      showEditRelationModal: false
    };

    this.props.history.listen((location, action) => {
      if (this.props.match.params.selector !== this.state.currentWork.id) {
        this.selectWork(this.props.match.params.selector, false);
      }
    });
  }

  // Fetch initial work, Relata config, and auth information. It's important
  // to maintain this sequence; otherwise, the multiple initial API calls
  // cause cryptic GraphViz errors for some reason. This seems to be the
  // best workaround
  setInitialState = selector => {
    client
      .service("graphs")
      .get(selector)
      .then(graph => {
        if (graph == null) {
          this.setState({ currentWorkNotFound: true });
        } else {
          this.setState({
            currentWork: graph,
            currentWorkNotFound: false,
            stagedRelation: {
              id: null,
              type: null,
              workFrom: null,
              workTo: null,
              annotation: null
            },
            showEditRelationModal: false
          });
        }

        // Get config, set relataConfig
        this.getRelataConfig();

        // Login, set currentUser
        this.login();
      });
  };

  componentDidMount() {
    let { selector } = this.props.match.params;
    if (selector === undefined) {
      // Fetch initial work ID, which is an ordinary React environment variable
      selector = 1;
      if (process.env.REACT_APP_RELATA_INITIAL_WORK_ID) {
        // Pick ID at random from comma-separated candidates
        let candidates = process.env.REACT_APP_RELATA_INITIAL_WORK_ID.split(",");
        selector = candidates[Math.floor(Math.random() * candidates.length)];
      }
    }
    // Select a work and get Relata config to populate initial state
    this.setInitialState(selector);
  }

  // Log in via OAuth
  login = (refresh = false) => {
    console.log("Logging in or re-authenticating…");
    // Attempt to re-authenticate
    client
      .reAuthenticate(refresh)
      .then(({ user }) => {
        console.log("Authenticated");
        this.setState({ currentUser: user });
      })
      .catch(error => {
        console.log("Failed to authenticate:", error);
      });
  };

  // Log out from OAuth session
  logout = async () => {
    console.log("Logging out…");
    await client.logout();
    this.setState({ currentUser: null });
    console.log("Logged out!");
  };

  // Fetch Relata configuration object from configuration JSON file
  getRelataConfig = () => {
    client
      .service("config")
      .find()
      .then(relataConfig => {
        this.setState({ relataConfig: relataConfig });
      });
  };

  // Fetch a work graph from the Feathers backend and refresh the frontend (if
  // called without arguments, will simply refresh the frontend for currentWork
  selectWork = (workId = this.state.currentWork.id, changeHistory = true) => {
    client
      .service("graphs")
      .get(workId)
      .then(graph => {
        this.setState({
          currentWork: graph
        }, () => {
          const newSelector = workId.toString();
          this.props.match.params.selector = newSelector;
          if (changeHistory) {
            this.props.history.push("/" + newSelector);
          }
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
      return "#808080";
    }
  };

  // Modify stagedAnnotation
  setStagedAnnotation = annotation => {
    this.setState({ stagedAnnotation: annotation });
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
        stagedAnnotation: null,
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
      currentWorkNotFound,
      relataConfig,
      showEditRelationModal,
      stagedAnnotation,
      stagedRelation
    } = this.state;
    return (
      <div className="App">
        <Navigation
          currentUser={currentUser}
          getRelationColor={this.getRelationColor}
          login={this.login}
          logout={this.logout}
          relataConfig={relataConfig}
          selectWork={this.selectWork}
          setStagedAnnotation={this.setStagedAnnotation}
          setStagedRelation={this.setStagedRelation}
          showEditRelationModal={showEditRelationModal}
          stagedAnnotation={stagedAnnotation}
          stagedRelation={stagedRelation}
          toggleEditRelationModal={this.toggleEditRelationModal}
        />
        {/* eslint-disable-next-line */}
        <a id="content" style={{ position: "absolute", top: 0 }}></a>
        <Container fluid="true" className="mt-3">
          <Row>
            <Col sm={12} md={4} className="mb-3">
              {currentWorkNotFound ? (
                <ErrorPane code={404} />
              ) : (
                <RelationsPane
                  currentUser={currentUser}
                  currentWork={currentWork}
                  relataConfig={relataConfig}
                  selectWork={this.selectWork}
                  setStagedAnnotation={this.setStagedAnnotation}
                  setStagedRelation={this.setStagedRelation}
                  showEditRelationModal={showEditRelationModal}
                  stagedAnnotation={stagedAnnotation}
                  stagedRelation={stagedRelation}
                  toggleEditRelationModal={this.toggleEditRelationModal}
                />
              )}
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

export default withRouter(App);
