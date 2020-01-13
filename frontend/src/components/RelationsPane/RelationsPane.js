import React, { Component } from "react";

import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";

import AddRelationModal from "./AddRelationModal/AddRelationModal";
import CurrentWorkCard from "./CurrentWorkCard";

const RelationCard = props => {
  const { relation, selectWork } = props;

  var annotation;
  if (relation.annotation) {
    var annotationAuthor = relation.annotationAuthor ? (
      <b className="relation-lead">{relation.annotationAuthor}</b>
    ) : (
      ""
    );
    annotation = (
      <Card.Footer>
        <Card.Text>
          {annotationAuthor} {relation.annotation}
        </Card.Text>
      </Card.Footer>
    );
  } else {
    annotation = <></>;
  }

  return (
    <div>
      <Card
        className="relation-card mt-3"
        onClick={() => selectWork(relation.workTo.id)}
        style={{ borderLeftColor: relation.color }}
      >
        <Card.Body>
          <Card.Text>
            <b className="relation-lead" style={{ color: relation.color }}>
              {relation.type}
            </b>{" "}
            {relation.workTo.bibliography}
          </Card.Text>
        </Card.Body>
        {annotation}
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
    const { currentWork, selectWork } = this.props;
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
            show={addRelationModalIsOpen}
            currentWork={currentWork}
            toggleAddRelationModal={this.toggleAddRelationModal}
          />
        </div>
        {RelationCards}
      </div>
    );
  }
}

export default RelationsPane;
