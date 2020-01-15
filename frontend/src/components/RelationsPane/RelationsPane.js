import React, { Component } from "react";

import Button from "react-bootstrap/Button";

import AddRelationModal from "./AddRelationModal/AddRelationModal";
import CurrentWorkCard from "./CurrentWorkCard";
import RelationCard from "./RelationCard";

class RelationsPane extends Component {
  constructor(props) {
    super(props);

    this.state = {
      addRelationModalIsOpen: false
    };
  }

  toggleAddRelationModal = () => {
    this.setState({
      addRelationModalIsOpen: !this.state.addRelationModalIsOpen
    });
  };

  render() {
    const { currentWork, relataConfig, selectWork } = this.props;
    const { addRelationModalIsOpen } = this.state;

    const RelationCards = currentWork.relationsFrom.map((relation, index) => {
      return (
        <RelationCard key={index} relation={relation} selectWork={selectWork} />
      );
    });

    return (
      <div>
        <CurrentWorkCard currentWork={currentWork} />
        <div className="mt-3 text-right">
          <Button variant="success" onClick={this.toggleAddRelationModal}>
            Add Relation
          </Button>
          <AddRelationModal
            currentWork={currentWork}
            show={addRelationModalIsOpen}
            relataConfig={relataConfig}
            toggleAddRelationModal={this.toggleAddRelationModal}
          />
        </div>
        {RelationCards}
      </div>
    );
  }
}

export default RelationsPane;
