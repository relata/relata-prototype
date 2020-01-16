import React, { Component } from "react";

import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";

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
        .filter(type => type !== "*")
        .sort();
    } else {
      relationTypes = [];
    }
    const dropdownItems = relationTypes.map((type, index) => {
      const color = relataConfig.types[type].color;
      const style = { borderLeft: `0.25rem solid ${color}` };
      return (
        <Dropdown.Item
          key={index}
          style={style}
          onClick={() => this.handleClick(type)}
        >
          {type}
        </Dropdown.Item>
      );
    });

    return (
      <Card className="mt-3">
        <Card.Body>
          <div className="mb-2">
            Select a relation type:
            <DropdownButton
              className="ml-1"
              variant="outline-primary"
              title={buttonTitle}
              style={{ display: "inline-block" }}
            >
              {dropdownItems}
            </DropdownButton>
          </div>
          <Form.Group controlId="annotation-textarea">
            <Form.Label>Enter an annotation (optional):</Form.Label>
            <Form.Control
              as="textarea"
              rows="2"
              style={{ minHeight: "2.4rem" }}
              maxLength={500}
              onChange={event =>
                setStagedAnnotation(
                  event.target.value.replace(/\s+/g, " ").trim()
                )
              }
            />
          </Form.Group>
        </Card.Body>
      </Card>
    );
  }
}

export default SelectRelationType;
