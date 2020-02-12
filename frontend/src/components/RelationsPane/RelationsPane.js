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

  render() {
    const {
      currentUser,
      currentWork,
      relataConfig,
      selectWork,
      setStagedAnnotation,
      setStagedRelation,
      stagedAnnotation,
      stagedRelation,
      showEditRelationModal,
      toggleEditRelationModal
    } = this.props;

    console.log(currentWork);
    const RelationCards = currentWork.relationsTo.map((relation, index) => {
      return (
        <RelationCard
          key={relation.id}
          currentUser={currentUser}
          currentWork={currentWork}
          relation={relation}
          selectWork={selectWork}
          setStagedAnnotation={setStagedAnnotation}
          setStagedRelation={setStagedRelation}
          showEditRelationModal={showEditRelationModal}
          stagedAnnotation={stagedAnnotation}
          stagedRelation={stagedRelation}
          toggleEditRelationModal={toggleEditRelationModal}
        />
      );
    });

    const addRelationButton = currentUser ? (
      <Button variant="primary" onClick={this.toggleAddRelationModal}>
        Add Relation
      </Button>
    ) : null;

    return (
      <div>
        <CurrentWorkCard currentWork={currentWork} />
        <div className="mt-3 text-right">
          {addRelationButton}
          <EditRelationModal
            currentUser={currentUser}
            currentWork={currentWork}
            relataConfig={relataConfig}
            selectWork={selectWork}
            setStagedAnnotation={setStagedAnnotation}
            setStagedRelation={setStagedRelation}
            showEditRelationModal={showEditRelationModal}
            stagedAnnotation={stagedAnnotation}
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
