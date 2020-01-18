import React, { Component } from "react";

import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";

import SelectWorkTabs from "./SelectWorkTabs";

class SelectWork extends Component {
  constructor(props) {
    super(props);

    this.state = {
      targetWork: null
    };
  }

  setTargetWork = work => {
    this.setState({ targetWork: work });
  };

  handleSelectWork = event => {
    const { stagedWorkType, setStagedWork } = this.props;
    const { targetWork } = this.state;

    setStagedWork(stagedWorkType, targetWork);
  };

  render() {
    const { stagedWork, stagedWorkType, setStagedWork } = this.props;
    const { targetWork } = this.state;

    const heading = stagedWorkType === "workFrom" ? "Work 1" : "Work 2";
    let selectWorkCard;

    if (stagedWork) {
      selectWorkCard = (
        <Card
          className="mt-3 select-work-card-staged"
          onClick={() => {
            setStagedWork(stagedWorkType, null);
          }}
          onKeyPress={event => {
            if (event.key === "Enter") {
              setStagedWork(stagedWorkType, null);
            }
          }}
          tabIndex={0}
        >
          <Card.Header>
            {heading} <i>(click to edit)</i>
          </Card.Header>
          <Card.Body>
            <Card.Text>{stagedWork.bibliography}</Card.Text>
          </Card.Body>
        </Card>
      );
    } else {
      selectWorkCard = (
        <Card className="mt-3">
          <Card.Header>{heading}</Card.Header>
          <Card.Body>
            <SelectWorkTabs
              setTargetWork={this.setTargetWork}
              targetWork={targetWork}
            />
          </Card.Body>
          <Card.Footer>
            <Button
              variant="primary"
              className="float-right"
              onClick={this.handleSelectWork}
            >
              Select Work
            </Button>
          </Card.Footer>
        </Card>
      );
    }

    return selectWorkCard;
  }
}

export default SelectWork;
