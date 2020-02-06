import React, { Component } from "react";

import Button from "react-bootstrap/Button";

import AddRelationModal from "./AddRelationModal/AddRelationModal";
import EditRelationModal from "../EditRelationModal/EditRelationModal";
import CurrentWorkCard from "./CurrentWorkCard";
import RelationCard from "./RelationCard";

class RelationsPane extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  toggleAddRelationModal = () => {
    const {
      currentWork,
      showEditRelationModal,
      setStagedRelation,
      stagedRelation,
      toggleEditRelationModal
    } = this.props;
    if (!showEditRelationModal) {
      setStagedRelation({ ...stagedRelation, workTo: currentWork });
      toggleEditRelationModal();
    }
    // const { addRelationModalIsOpen } = this.state;
    // if (!addRelationModalIsOpen) {
    //   this.setStagedWork("workTo", currentWork);
    // }
    // this.setState({
    //   addRelationModalIsOpen: !addRelationModalIsOpen
    // });
  };

  setStagedWork = (workType, work) => {
    if (workType === "workFrom") {
      this.setState({ stagedWorkFrom: work });
    } else {
      this.setState({ stagedWorkTo: work });
    }
  };

  render() {
    const {
      currentWork,
      relataConfig,
      selectWork,
      setStagedRelation,
      stagedRelation,
      showEditRelationModal,
      toggleEditRelationModal
    } = this.props;

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
          <EditRelationModal
            currentWork={currentWork}
            relataConfig={relataConfig}
            setStagedRelation={setStagedRelation}
            showEditRelationModal={showEditRelationModal}
            stagedRelation={stagedRelation}
            toggleEditRelationModal={toggleEditRelationModal}
          />
          {/* <AddRelationModal
            currentWork={currentWork}
            show={addRelationModalIsOpen}
            relataConfig={relataConfig}
            selectWork={selectWork}
            setStagedWork={this.setStagedWork}
            stagedWorkFrom={stagedWorkFrom}
            stagedWorkTo={stagedWorkTo}
            swapStagedWorks={this.swapStagedWorks}
            toggleAddRelationModal={this.toggleAddRelationModal}
          /> */}
        </div>
        {RelationCards}
      </div>
    );
  }
}

export default RelationsPane;
