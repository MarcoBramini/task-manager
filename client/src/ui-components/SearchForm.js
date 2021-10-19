import React from "react";
import { useState } from "react";
import { Form } from "react-bootstrap";

import "../css/custom.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-datepicker/dist/react-datepicker.css";

function SearchForm(props) {
  const [value, setValue] = useState("");

  const onValueChange = (event) => {
    const newVal = event.target.value;

    // We don't want a description made by only spaces
    if (newVal.trim() === "") {
      setValue("");
      props.setSearchValue("");
      return;
    }

    props.setSearchValue(newVal);
    setValue(newVal);
  };

  const onSubmit = (event) => {
    event.preventDefault();
    props.onSearchSubmit();
  };

  return (
    <>
      <Form className='mb-2 mx-3' onSubmit={onSubmit}>
        <Form.Group className='mb-0' controlId='search'>
          <Form.Control
            className='fw-300'
            type='search'
            placeholder='Search'
            aria-label='Type something to search between your tasks!'
            value={value}
            onChange={onValueChange}
          />
        </Form.Group>
      </Form>
    </>
  );
}

export default SearchForm;
