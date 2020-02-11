import React, { Component } from "react";

import LinkifyBibliography from "../../RelationsPane/LinkifyBibliography";

import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Nav from "react-bootstrap/Nav";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Row from "react-bootstrap/Row";
import Tab from "react-bootstrap/Tab";
import Tooltip from "react-bootstrap/Tooltip";

import AddDOIPane from "./AddDOIPane";
import AddSearchPane from "./AddSearchPane";

class StageWork extends Component {
  constructor(props) {
    super(props);

    this.state = {
      targetWork: null
    };
  }

  setTargetWork = work => {
    this.setState({ targetWork: work });
  };

  stageWork = () => {
    const { setStagedRelation, stagedRelation, stagedWorkType } = this.props;
    const { targetWork } = this.state;

    setStagedRelation({ ...stagedRelation, [stagedWorkType]: targetWork });
  };

  // Unstage the currently staged work of workType and populate it into
  // targetWork
  unstageWork = () => {
    const { setStagedRelation, stagedRelation, stagedWorkType } = this.props;
    this.setTargetWork(stagedRelation[stagedWorkType]);
    setStagedRelation({ ...stagedRelation, [stagedWorkType]: null });
  };

  render() {
    const { stagedRelation, stagedWorkType } = this.props;
    const { targetWork } = this.state;

    const stagedWork = stagedRelation[stagedWorkType];

    // Produce appropriate heading for workFrom (subject) or workTo (object)
    const heading =
      stagedWorkType === "workFrom" ? "Subject Work" : "Object Work";

    const stageWorkCard = stagedWork ? (
      <OverlayTrigger
        key={stagedWorkType}
        overlay={<Tooltip>Click to edit selected work</Tooltip>}
      >
        <Card
          className="mt-3 select-work-card-staged"
          onClick={this.unstageWork}
          onKeyPress={event => {
            if (event.key === "Enter") {
              this.unstageWork();
            }
          }}
          tabIndex={0}
        >
          <Card.Header>{heading}</Card.Header>
          <Card.Body>
            <Card.Text>
              <LinkifyBibliography>
                {stagedWork.bibliography}
              </LinkifyBibliography>
            </Card.Text>
          </Card.Body>
        </Card>
      </OverlayTrigger>
    ) : (
      <Card className="mt-3">
        <Card.Header>{heading}</Card.Header>
        <Card.Body>
          <Tab.Container variant="success" defaultActiveKey="add-doi-pane">
            <Row>
              <Col sm={3}>
                <Nav variant="pills" className="flex-column">
                  <Nav.Item>
                    <Nav.Link eventKey="add-doi-pane">DOI</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="add-search-pane">
                      Metadata Search
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
              </Col>
              <Col sm={9}>
                <Tab.Content>
                  <Tab.Pane eventKey="add-doi-pane">
                    <AddDOIPane
                      setTargetWork={this.setTargetWork}
                      targetWork={targetWork}
                    />
                  </Tab.Pane>
                  <Tab.Pane eventKey="add-search-pane">
                    <AddSearchPane
                      setTargetWork={this.setTargetWork}
                      targetWork={targetWork}
                    />
                  </Tab.Pane>
                </Tab.Content>
              </Col>
            </Row>
          </Tab.Container>
        </Card.Body>
        <Card.Footer>
          <Button
            variant="primary"
            className="float-right"
            onClick={this.stageWork}
          >
            Select Work
          </Button>
        </Card.Footer>
      </Card>
    );

    return stageWorkCard;
  }
}

export default StageWork;
