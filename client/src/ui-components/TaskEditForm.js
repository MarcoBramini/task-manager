import React from "react";
import { useState } from "react";
import { Form, Button, Col, Row, Modal } from "react-bootstrap";
import DatePicker from "react-datepicker";
import dayjs from "dayjs";
import Task, { TaskState } from "../services/models/Task";

import "../css/custom.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-datepicker/dist/react-datepicker.css";

function TaskEditForm(props) {
  const [description, setDescription] = useState(
    props.taskToEdit?.description || ""
  );
  const [deadline, setDeadline] = useState(
    props.taskToEdit?.deadline?.valueOf()
  );
  const [isImportant, setIsImportant] = useState(
    props.taskToEdit?.isImportant || true
  );
  const [isPrivate, setIsPrivate] = useState(
    props.taskToEdit?.isPrivate || false
  );

  const onDescriptionChange = (event) => {
    const newVal = event.target.value;

    // We don't want a description made by only spaces
    if (newVal.trim() === "") {
      setDescription(() => "");
      return;
    }

    setDescription(() => newVal);
  };

  const onIsPrivateChange = (event) => setIsPrivate(() => event.target.checked);

  const onIsImportantChange = (event) =>
    setIsImportant(() => event.target.checked);

  const onDeadlineChange = (newDate) => setDeadline(() => newDate);

  const handleSubmit = (event) => {
    event.preventDefault();

    props.onSubmit(
      new Task(
        props.taskToEdit?.id,
        description.trim(),
        deadline ? dayjs(deadline) : null,
        isImportant,
        isPrivate,
        TaskState.CHANGED,
        props.taskToEdit?.isCompleted || false,
        props.taskToEdit?.userId
      )
    );
  };

  return (
    <>
      <Modal.Header>
        <Modal.Title className='fw-300'>
          {props.taskToEdit?.id ? "Edit Task" : "Add Task"}
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body className='fw-200'>
          <Form.Group as={Row} controlId='task-email'>
            <Form.Label column sm={3}>
              Description
            </Form.Label>
            <Col>
              <Form.Control
                className='fw-300'
                type='text'
                value={description}
                onChange={onDescriptionChange}
                required
                autoComplete='off'
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} controlId='task-deadline'>
            <Form.Label column sm={3}>
              Deadline
            </Form.Label>
            <Col className='align-items-center taskedit-date-picker'>
              <DatePicker
                className='form-control fw-300'
                selected={deadline}
                onChange={onDeadlineChange}
                showTimeSelect
                isClearable
                dateFormat='dd/MM/yyyy, hh:mm a'
                placeholderText='No deadline set'
                minDate={new Date()}
              />
            </Col>
          </Form.Group>

          <Row className='justify-content-center'>
            <Form.Group className='mr-5' controlId='task-important'>
              <Form.Check
                type='checkbox'
                label='Important'
                checked={isImportant}
                onChange={onIsImportantChange}
              />
            </Form.Group>

            <Form.Group controlId='task-private'>
              <Form.Check
                type='checkbox'
                label='Private'
                checked={isPrivate}
                onChange={onIsPrivateChange}
              />
            </Form.Group>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button className='fw-300' variant='primary' type='submit'>
            Submit
          </Button>
          <Button
            variant='secondary'
            onClick={props.onCancel}
            className='fw-300 ml-4'>
            Cancel
          </Button>
        </Modal.Footer>
      </Form>
    </>
  );
}

export default TaskEditForm;
