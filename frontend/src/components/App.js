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

import jwt from "jsonwebtoken";

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
      const selector = this.props.match.params.selector;
      if (selector !== null && selector !== this.state.currentWork.id) {
        this.selectWork(selector, false);
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
      .get(selector.toString().replace("/", ","))
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
      });
  };

  componentDidMount() {
    // Get config, set relataConfig
    this.getRelataConfig(() => {
      let { selector } = this.props.match.params;
      if (selector === undefined) {
        // Get candidate landing works from config (or default to ID = 1)
        let candidates = this.state.relataConfig.landingWorks || ["1"];
        // Pick selector at random among candidates
        selector = candidates[Math.floor(Math.random() * candidates.length)];
      }
      // Select a work and get Relata config to populate initial state
      this.setInitialState(selector);
    });

    // Login, set currentUser
    this.login();
  }

  // Log in via OAuth
  login = async () => {
    console.log("Logging in or re-authenticating…");
    // Attempt to re-authenticate
    const accessToken = await client.authentication.getAccessToken();
    if (accessToken) {
      const exp = jwt.decode(accessToken).exp;
      if (Date.now() < exp * 1000) {
        client
          .authenticate({
            strategy: "jwt",
            accessToken: accessToken
          })
          .then(({ user }) => {
            console.log("Authenticated");
            this.setState({ currentUser: user });
          })
          .catch(error => {
            console.log("Failed to authenticate:", error);
          });
      } else {
        console.log("Expired authentication token");
        client.authentication.removeAccessToken();
      }
    } else {
      console.log("No authentication token found");
    }
  };

  // Log out from OAuth session
  logout = async () => {
    console.log("Logging out…");
    await client.logout();
    this.setState({ currentUser: null });
    console.log("Logged out!");
  };

  // Fetch Relata configuration object from configuration JSON file
  getRelataConfig = callback => {
    client
      .service("config")
      .find()
      .then(relataConfig => {
        this.setState({ relataConfig: relataConfig }, callback);
      });
  };

  // Fetch a work graph from the Feathers backend and refresh the frontend (if
  // called without arguments, will simply refresh the frontend for currentWork
  selectWork = (selector = this.state.currentWork.id, changeHistory = true) => {
    if (selector == null) {
      return;
    }
    client
      .service("graphs")
      .get(selector.toString().replace("/", ","))
      .then(graph => {
        if (graph === null && selector === this.state.currentWork.id) {
          this.setState({ currentWorkNotFound: true });
        } else {
          this.setState({
            currentWork: graph,
            currentWorkNotFound: false
          }, () => {
            let newSelector;
            if (graph.doi) {
              newSelector = "doi:" + graph.doi;
            } else {
              newSelector = graph.id;
            }
            this.props.match.params.selector = newSelector;
            if (changeHistory) {
              this.props.history.push("/work/" + newSelector + "/");
            }
          });
        }
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
        <Container fluid className="mt-3">
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
