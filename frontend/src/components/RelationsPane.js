import React, { Component } from "react";

import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";

import AddRelationModal from "./AddRelationModal/AddRelationModal";
import CurrentWorkCard from "./CurrentWorkCard";

const RelationCard = props => {
  const { relation, selectWork } = props;
  return (
    <div>
      <Card
        className="relation-card mt-3"
        onClick={() => selectWork(relation.workTo.id)}
        style={{ borderLeft: `5px solid ${relation.color}` }}
      >
        <Card.Body>
          <Card.Text>
            <b style={{ color: relation.color, marginRight: "0.25rem" }}>
              {relation.type}
            </b>{" "}
            {relation.workTo.bibliography}
          </Card.Text>
        </Card.Body>
      </Card>
    </div>
  );
};

class RelationsPane extends Component {
  state = {
    addRelationModalIsOpen: false
  };
  toggleAddRelationModal = () => {
    this.setState({
      addRelationModalIsOpen: !this.state.addRelationModalIsOpen
    });
  };

  render() {
    const {
      currentWorkBibliography,
      currentWorkCitation,
      relations,
      selectWork
    } = this.props;

    const RelationCards = relations.map((relation, index) => {
      return (
        <RelationCard key={index} relation={relation} selectWork={selectWork} />
      );
    });

    return (
      <div>
        <CurrentWorkCard currentWorkBibliography={currentWorkBibliography} />
        <div className="mt-3 text-right">
          <Button variant="success" onClick={this.toggleAddRelationModal}>
            Add Relation
          </Button>
          <AddRelationModal
            show={this.state.addRelationModalIsOpen}
            currentWorkCitation={currentWorkCitation}
            toggleAddRelationModal={this.toggleAddRelationModal}
          />
        </div>
        {RelationCards}
      </div>
    );
  }
}

export default RelationsPane;
