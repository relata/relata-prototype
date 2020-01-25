import React, { Component } from "react";

import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";

class SelectRelationType extends Component {
  constructor(props) {
    super(props);

    this.state = {
      buttonTitle: "Relation Type"
    };
  }

  handleClick = type => {
    const { setStagedRelationType } = this.props;
    this.setState({ buttonTitle: type });
    setStagedRelationType(type);
  };

  render() {
    const { relataConfig, setStagedAnnotation } = this.props;
    const { buttonTitle } = this.state;

    // Insert relation types as items in dropdown
    let relationTypes;
    if (relataConfig.types) {
      relationTypes = Object.keys(relataConfig.types)
        .filter(relationType => relationType !== "*")
        .sort();
    } else {
      relationTypes = [];
    }
    const dropdownItems = relationTypes.map((relationType, index) => {
      const color = relataConfig.types[relationType].color;
      const style = { borderLeft: `0.25rem solid ${color}` };
      return (
        <Dropdown.Item
          key={index}
          style={style}
          onClick={() => this.handleClick(relationType)}
        >
          {relationType}
        </Dropdown.Item>
      );
    });

    return (
      <Card className="mt-3">
        <Card.Body>
          <Row>
            <Col sm={3}>
              <Form.Label htmlFor="relation-type-dropdown">
                Relation Type
              </Form.Label>
              <DropdownButton
                id="relation-type-dropdown"
                variant="outline-primary"
                title={buttonTitle}
              >
                {dropdownItems}
              </DropdownButton>
            </Col>
            <Col sm={9}>
              <Form.Group controlId="annotation-textarea">
                <Form.Label>
                  Annotation <i>(optional)</i>
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows="1"
                  style={{ minHeight: "2.4rem" }}
                  maxLength={500}
                  onChange={event =>
                    setStagedAnnotation(
                      event.target.value.replace(/\s+/g, " ").trim()
                    )
                  }
                />
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    );
  }
}

export default SelectRelationType;
