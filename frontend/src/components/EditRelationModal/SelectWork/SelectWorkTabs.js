import React from "react";

import Col from "react-bootstrap/Col";
import Nav from "react-bootstrap/Nav";
import Row from "react-bootstrap/Row";
import Tab from "react-bootstrap/Tab";

import AddDOIPane from "./AddDOIPane";
import AddSearchPane from "./AddSearchPane";

const SelectWorkTabs = props => {
  const { setTargetWork, targetWork } = props;

  return (
    <Tab.Container variant="success" defaultActiveKey="add-doi-pane">
      <Row>
        <Col sm={3}>
          <Nav variant="pills" className="flex-column">
            <Nav.Item>
              <Nav.Link eventKey="add-doi-pane">DOI</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="add-search-pane">Metadata Search</Nav.Link>
            </Nav.Item>
          </Nav>
        </Col>
        <Col sm={9}>
          <Tab.Content>
            <Tab.Pane eventKey="add-doi-pane">
              <AddDOIPane
                setTargetWork={setTargetWork}
                targetWork={targetWork}
              />
            </Tab.Pane>
            <Tab.Pane eventKey="add-search-pane">
              <AddSearchPane
                setTargetWork={setTargetWork}
                targetWork={targetWork}
              />
            </Tab.Pane>
          </Tab.Content>
        </Col>
      </Row>
    </Tab.Container>
  );
};

export default SelectWorkTabs;
