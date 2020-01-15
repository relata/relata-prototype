import React, { Component } from "react";

import Card from "react-bootstrap/Card";
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
    const { relataConfig } = this.props;
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
          Select a relation type:
          <DropdownButton
            variant="outline-primary"
            title={buttonTitle}
            style={{ display: "inline-block", marginLeft: "0.25rem" }}
          >
            {dropdownItems}
          </DropdownButton>
        </Card.Body>
      </Card>
    );
  }
}

export default SelectRelationType;
