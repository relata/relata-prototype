import React from "react";

import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import ListGroup from "react-bootstrap/ListGroup";
import Pagination from "react-bootstrap/Pagination";
import Row from "react-bootstrap/Row";

const PaginatedResults = props => {
  const {
    fetchResults,
    message,
    noResultsMessage,
    transformResult,
    results
  } = props;
  if (!results) {
    return noResultsMessage;
  }
  const { data, limit, skip, total } = results;

  // Handle missing data
  if (!data) {
    return null;
  } else if (data.length < 1) {
    return noResultsMessage;
  }

  // Determine whether this is the first or last page of results
  const isFirstPage = skip === 0;
  const isLastPage = skip + limit >= total;

  // Get skip index for previous, last, and next pages
  const prevPageIndex = skip - limit < 1 ? 0 : skip - limit;
  const lastPageIndex = total - limit;
  const nextPageIndex = skip + limit > total ? lastPageIndex : skip + limit;

  // Get item numbers for display
  const itemRangeStart = skip + 1;
  const itemRangeEnd = itemRangeStart + data.length - 1;

  // Map transform callback over results data, then wrap in ResultRows
  const resultRows = data.map(transformResult);

  return (
    <>
      <p>{message}</p>
      <Card className="mb-3">
        <ListGroup
          className="paginated-results-list"
          variant="flush"
          style={{ overflow: "scroll", maxHeight: "24rem" }}
        >
          {resultRows}
        </ListGroup>
      </Card>
      <Col>
        <Row className="justify-content-center">
          <Pagination>
            <Pagination.First
              disabled={isFirstPage}
              onClick={() => fetchResults(0)}
              style={isFirstPage ? { cursor: "not-allowed" } : null}
            />
            <Pagination.Prev
              disabled={isFirstPage}
              onClick={() => fetchResults(prevPageIndex)}
              style={isFirstPage ? { cursor: "not-allowed" } : null}
            />
            <div className="text-center pt-2 pb-2 pl-3 pr-3">
              Showing {itemRangeStart}-{itemRangeEnd} of {total}
            </div>
            <Pagination.Next
              disabled={isLastPage}
              onClick={() => fetchResults(nextPageIndex)}
              style={isLastPage ? { cursor: "not-allowed" } : null}
            />
            <Pagination.Last
              disabled={isLastPage}
              onClick={() => fetchResults(lastPageIndex)}
              style={isLastPage ? { cursor: "not-allowed" } : null}
            />
          </Pagination>
        </Row>
      </Col>
    </>
  );
};

export default PaginatedResults;
