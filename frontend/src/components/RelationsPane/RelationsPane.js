import React, { Component } from "react";

import Button from "react-bootstrap/Button";

import AddRelationModal from "./AddRelationModal/AddRelationModal";
import CurrentWorkCard from "./CurrentWorkCard";
import RelationCard from "./RelationCard";

class RelationsPane extends Component {
  constructor(props) {
    super(props);

    this.state = {
      addRelationModalIsOpen: false,
      stagedWorkFrom: null,
      stagedWorkTo: null
    };
  }

  toggleAddRelationModal = () => {
    const { currentWork } = this.props;
    const { addRelationModalIsOpen } = this.state;
    if (!addRelationModalIsOpen) {
      this.setStagedWork("workTo", currentWork);
    }
    this.setState({
      addRelationModalIsOpen: !addRelationModalIsOpen
    });
  };

  setStagedWork = (workType, work) => {
    if (workType === "workFrom") {
      this.setState({ stagedWorkFrom: work });
    } else {
      this.setState({ stagedWorkTo: work });
    }
  };

  swapStagedWorks = () => {
    const { stagedWorkFrom, stagedWorkTo } = this.state;
    this.setState({
      stagedWorkFrom: stagedWorkTo,
      stagedWorkTo: stagedWorkFrom
    });
  };

  render() {
    const { currentWork, relataConfig, selectWork } = this.props;
    const { addRelationModalIsOpen, stagedWorkFrom, stagedWorkTo } = this.state;

    const RelationCards = currentWork.relationsFrom.map((relation, index) => {
      return (
        <RelationCard
          key={relation.id}
          relation={relation}
          selectWork={selectWork}
        />
      );
    });

    return (
      <div>
        <CurrentWorkCard currentWork={currentWork} />
        <div className="mt-3 text-right">
          <Button variant="primary" onClick={this.toggleAddRelationModal}>
            Add Relation
          </Button>
          <AddRelationModal
            currentWork={currentWork}
            show={addRelationModalIsOpen}
            relataConfig={relataConfig}
            selectWork={selectWork}
            setStagedWork={this.setStagedWork}
            stagedWorkFrom={stagedWorkFrom}
            stagedWorkTo={stagedWorkTo}
            swapStagedWorks={this.swapStagedWorks}
            toggleAddRelationModal={this.toggleAddRelationModal}
          />
        </div>
        {RelationCards}
      </div>
    );
  }
}

export default RelationsPane;
