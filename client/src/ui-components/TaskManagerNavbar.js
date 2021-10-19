import React, { useState } from "react";
import { Container, Navbar } from "react-bootstrap";

import Logo from "./Logo";
import { userIcon } from "./Icons";
import SearchForm from "./SearchForm";

import "../css/custom.css";
import "bootstrap/dist/css/bootstrap.min.css";

function TaskManagerNavbar(props) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleClickOutside = (e) => {
    if (isExpanded) setIsExpanded(false);
  };

  const handleSearchSubmit = () => {
    if (isExpanded) setIsExpanded(false);
  };

  return (
    <>
      {
        // This container maps the space not occupied by the navbar in the display.
        // It's used to close the navbar when the user clicks outside of the navbar area.
        isExpanded ? (
          <div
            className='navbar-outside-space'
            onClick={handleClickOutside}></div>
        ) : null
      }

      <Navbar
        className='px-0 pb-0'
        collapseOnSelect
        onToggle={setIsExpanded}
        expanded={isExpanded}
        expand='sm'
        variant='dark'
        bg='success'
        fixed='top'>
        <Navbar.Toggle
          className='ml-3 mb-2'
          aria-controls='navbar-collapse'
          data-toggle='collapse'
          data-target='#navbar-collapse'
          aria-expanded='false'
          aria-label='Toggle navbar'
        />

        <Navbar.Brand className='ml-3 mb-2 logo'>
          <Logo white />
        </Navbar.Brand>

        <Navbar.Collapse
          className=' order-sm-0 order-1 bg-sm-light pl-0 navbar-collapse-background justify-content-end'
          id='navbar-collapse'>
          <Container className='d-sm-none d-block col-12 pt-3 pb-2 container-fluid'>
            {props.filterSideBar}
          </Container>

          <SearchForm
            setSearchValue={props.setSearchValue}
            onSearchSubmit={handleSearchSubmit}
          />
        </Navbar.Collapse>

        <div className='navbar-nav ml-md-auto order-sm-1 order-0 mr-3 mb-2'>
          <div
            className='nav-item nav-link'
            onClick={props.toggleUserPanelModal}>
            {userIcon}
          </div>
        </div>
      </Navbar>
    </>
  );
}

export default TaskManagerNavbar;
