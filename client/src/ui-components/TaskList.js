import React from "react";
import { Container, ListGroup, Form, Row, Col, Spinner } from "react-bootstrap";
import { iconPrivate, iconDelete, iconEdit } from "./Icons";
import { TaskState } from "../services/models/Task";

import "../css/custom.css";
import "bootstrap/dist/css/bootstrap.min.css";

function TaskList(props) {
  return (
    <Container className={props?.className}>
      <h1 className='fw-300'>{props.activeFilterLabel}</h1>
      {props.tasks.length === 0 ? (
        <Container className='task-list-empty fw-300'>
          There is nothing here! Good job!{" "}
        </Container>
      ) : (
        <ListGroup className='list-group-flush'>
          {props.tasks.map((t) => (
            <TaskListItem
              key={"task-" + t.id}
              task={t}
              onTaskComplete={props.onTaskComplete}
              onTaskDelete={props.onTaskDelete}
              onTaskEdit={props.onTaskEdit}
            />
          ))}
        </ListGroup>
      )}
    </Container>
  );
}

export default TaskList;

function TaskListItem(props) {
  const buildTaskStateComponent = () => {
    switch (props.task.state) {
      case TaskState.CHANGED:
        return (
          <Spinner size='sm' animation='border' variant='warning'></Spinner>
        );
      case TaskState.DELETED:
        return (
          <Spinner size='sm' animation='border' variant='danger'></Spinner>
        );
      case TaskState.OK:
      default:
        return null;
    }
  };

  return (
    <ListGroup.Item className='px-0 task-item'>
      <Row className='d-flex flex-nowrap w-100'>
        <Col xs='0' className='px-0 task-status'>
          {buildTaskStateComponent()}
        </Col>
        <Col xs='5'>
          <Form>
            <Form.Group className='mb-0' controlId={"check-t1" + props.task.id}>
              <Form.Check
                type='checkbox'
                checked={props.task.isCompleted}
                onChange={(event) => {
                  if (props.task.state === TaskState.OK)
                    props.onTaskComplete(props.task.id, event.target.checked);
                }}
                className={(!props.task.isImportant || "important") + " fw-300"}
                label={props.task.description}
              />
            </Form.Group>
          </Form>
        </Col>
        <Col xs='1'>{props.task.isPrivate ? iconPrivate : null}</Col>
        <Col xs='4'>
          <small className='task-date fw-300'>
            {props.task.deadline?.local().format("dddd, MMMM D, YYYY h:mm A")}
          </small>
        </Col>
        <Col
          xs='1'
          className='px-0'
          onClick={() => props.onTaskEdit(props.task.id)}>
          {iconEdit}
        </Col>
        <Col
          xs='1'
          className='px-0'
          onClick={() => props.onTaskDelete(props.task.id)}>
          {iconDelete}
        </Col>
      </Row>
    </ListGroup.Item>
  );
}
