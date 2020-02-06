import React, { Component } from "react";

import Button from "react-bootstrap/Button";

import EditRelationModal from "../EditRelationModal/EditRelationModal";
import CurrentWorkCard from "./CurrentWorkCard";
import RelationCard from "./RelationCard";

class RelationsPane extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  // Shortcut method to toggleEditRelationModal with appropriate presets for
  // adding a relation to the currentWork
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
            selectWork={selectWork}
            setStagedRelation={setStagedRelation}
            showEditRelationModal={showEditRelationModal}
            stagedRelation={stagedRelation}
            toggleEditRelationModal={toggleEditRelationModal}
          />
        </div>
        {RelationCards}
      </div>
    );
  }
}

export default RelationsPane;
