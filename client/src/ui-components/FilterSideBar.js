import React from "react";
import { ListGroup } from "react-bootstrap";

import "../css/custom.css";
import "bootstrap/dist/css/bootstrap.min.css";

function FilterSideBar(props) {
  return (
    <ListGroup className='list-group-flush'>
      {props.filterIds.map((filterId) => (
        <ListGroup.Item
          key={"filter-" + filterId}
          active={filterId === props.activeFilter}
          className='list-group-item-action filter-label'
          onClick={() => props.onFilterChange(filterId)}>
          {props.getFilterLabel(filterId)}
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
}

export default FilterSideBar;
