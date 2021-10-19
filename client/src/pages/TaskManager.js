import React, { useEffect, useState, useRef } from "react";
import { useHistory } from "react-router-dom";
import { Container, Row, Button, Modal, Spinner } from "react-bootstrap";

import TaskManagerNavbar from "../ui-components/TaskManagerNavbar";
import FilterSideBar from "../ui-components/FilterSideBar";
import TaskEditForm from "../ui-components/TaskEditForm";
import TaskList from "../ui-components/TaskList";
import ErrorToast from "../ui-components/ErrorToast";
import { userIcon } from "../ui-components/Icons";

import {
  getFilterIds,
  getFilterLabel,
  addLocalTask,
  getLocalTask,
  searchLocalTasks,
  completeLocalTask,
  updateLocalTask,
  deleteLocalTask,
} from "../services/TaskService";
import {
  createTask,
  getFilteredTasks,
  updateTask,
  deleteTask,
  completeTask,
} from "../services/TaskManagerAPIClient";

import { AuthContext } from "../auth-components/AuthContextProvider";

import "../css/custom.css";
import "bootstrap/dist/css/bootstrap.min.css";

const serverErrorTitle = "Server error occurred";
const loadTaskErrorMessage =
  "Task list could not be loaded. Retrying in 5 seconds...";
const addTaskErrorMessage = "Task could not be created. Try again later...";
const updateTaskErrorMessage = "Task could not be updated. Try again later...";
const completeTaskErrorMessage =
  "Task could not be completed. Try again later...";
const deleteTaskErrorMessage = "Task could not be deleted. Try again later...";

function TaskManager(props) {
  const history = useHistory();

  const activeFilter = props.activeFilter;

  const [tasks, setTasks] = useState([]);
  const [isTaskListDirty, setIsTaskListDirty] = useState(true);
  const [isTaskListLoading, setIsTaskListLoading] = useState(true);

  const [serverErrorMessage, setServerErrorMessage] = useState(null);

  // This stops rendering this component when it gets unmounted.
  // This happens primarly on navigation.
  let isComponentMounted = useRef(false);

  let isTaskListUpdating = useRef(false);

  // Start updating the task list periodically
  useEffect(() => {
    if (isTaskListUpdating.current) return;

    isTaskListUpdating.current = true;
    setInterval(() => {
      if (!isComponentMounted.current) return;
      setIsTaskListDirty(true);
    }, 3000);
  }, []);

  // Loads the updated task list when the local state gets dirty
  useEffect(() => {
    isComponentMounted.current = true;

    const loadTasks = () => {
      getFilteredTasks(activeFilter)
        .then((tasks) => {
          if (!isComponentMounted.current) return;
          setTasks(() => tasks);
          setIsTaskListLoading(false);
          setIsTaskListDirty(false);
        })
        .catch((e) => {
          if (!isComponentMounted.current) return;
          setServerErrorMessage(loadTaskErrorMessage);
          // Retry to load tasks
          setTimeout(loadTasks, 5500);
        });
    };

    loadTasks();
    return () => (isComponentMounted.current = false);
  }, [activeFilter, isTaskListDirty]);

  // TaskEditForm states
  const [showTaskEditForm, setShowTaskEditForm] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);

  const onFilterChange = (filterId) => {
    history.push("/" + filterId);
  };

  let onTaskDelete = (taskId) => {
    // Delete tasks from local state
    setTasks((oldTasks) => deleteLocalTask(oldTasks, taskId));

    // Request task deletion on server
    deleteTask(taskId)
      .catch(() => setServerErrorMessage(deleteTaskErrorMessage))
      .finally(() => setIsTaskListDirty(true));
  };

  let onTaskEdit = (taskId) => {
    setTaskToEdit(getLocalTask(tasks, taskId));
    setShowTaskEditForm((showTaskEditForm) => !showTaskEditForm);
  };

  let onTaskComplete = (taskId, isCompleted) => {
    // Set task as (in)completed in local state
    setTasks((oldTasks) => completeLocalTask(oldTasks, taskId, isCompleted));

    // Request task completion on server
    completeTask(taskId, isCompleted)
      .catch(() => setServerErrorMessage(completeTaskErrorMessage))
      .finally(() => setIsTaskListDirty(true));
  };

  const onTaskEditFormSubmit = (addedOrEditedTask) => {
    if (!addedOrEditedTask.id) {
      // Add new task to local state
      setTasks((oldTasks) => addLocalTask(oldTasks, addedOrEditedTask));
      // Request task creation to server
      createTask(addedOrEditedTask)
        .catch(() => setServerErrorMessage(addTaskErrorMessage))
        .finally(() => setIsTaskListDirty(true));
    } else {
      // Update task in local state
      setTasks((oldTasks) => updateLocalTask(oldTasks, addedOrEditedTask));
      // Request task update to server
      updateTask(addedOrEditedTask)
        .catch(() => setServerErrorMessage(updateTaskErrorMessage))
        .finally(() => setIsTaskListDirty(true));
    }
    // Hide edit form
    setShowTaskEditForm((showTaskEditForm) => !showTaskEditForm);
    setTaskToEdit(() => null);
  };

  const onTaskEditFormCancel = () => {
    setShowTaskEditForm((showTaskEditForm) => !showTaskEditForm);
    setTaskToEdit(() => null);
  };

  // SearchForm states
  const [searchValue, setSearchValue] = useState("");

  /* User Panel states */
  const [showUserPanelModal, setShowUserPanelModal] = useState(false);

  const handleUserPanelModalClose = () => setShowUserPanelModal(false);

  const toggleUserPanelModal = () => setShowUserPanelModal((oldVal) => !oldVal);

  const filterSideBar = (
    <FilterSideBar
      filterIds={getFilterIds()}
      getFilterLabel={getFilterLabel}
      activeFilter={activeFilter}
      onFilterChange={onFilterChange}
    />
  );

  return (
    <>
      <TaskManagerNavbar
        filterSideBar={filterSideBar}
        setSearchValue={setSearchValue}
        toggleUserPanelModal={toggleUserPanelModal}
      />
      <Container className='mw-100 container-fluid'>
        <Row className='vheight-100'>
          <Container className='d-sm-block d-none col-4 bg-light below-nav'>
            {filterSideBar}
          </Container>
          <Container className={"col-sm-8 col-12 below-nav"}>
            {isTaskListLoading ? (
              <Container className='task-list-loading-spinner'>
                <Spinner animation='border' variant='success'></Spinner>
              </Container>
            ) : (
              <>
                <TaskList
                  className='task-list'
                  activeFilterLabel={getFilterLabel(activeFilter)}
                  tasks={searchLocalTasks(tasks, searchValue)}
                  onTaskComplete={onTaskComplete}
                  onTaskDelete={onTaskDelete}
                  onTaskEdit={onTaskEdit}
                />
                <Button
                  className='btn btn-lg btn-success fixed-right-bottom fw-300'
                  onClick={() => setShowTaskEditForm((showForm) => !showForm)}>
                  &#43;
                </Button>
              </>
            )}
          </Container>
        </Row>

        <AuthContext.Consumer>
          {(value) => {
            return (
              <Modal
                show={showUserPanelModal}
                onHide={handleUserPanelModalClose}>
                <Modal.Header>
                  <Modal.Title className='fw-300'>
                    {userIcon} {"Hi, " + value.currentUser.name}
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body className='fw-200'>
                  <b>{"Email: "}</b>
                  {value.currentUser.email}
                </Modal.Body>
                <Modal.Footer>
                  <Button
                    variant='success'
                    className='fw-300'
                    onClick={() => value.logout()}>
                    Logout
                  </Button>
                </Modal.Footer>
              </Modal>
            );
          }}
        </AuthContext.Consumer>

        <ErrorToast
          errorMessage={serverErrorMessage}
          errorTitle={serverErrorTitle}
          autohide
          show={serverErrorMessage !== null}
          delay='5000'
          onClose={() => setServerErrorMessage(null)}></ErrorToast>

        <Modal show={showTaskEditForm} onHide={onTaskEditFormCancel}>
          <TaskEditForm
            taskToEdit={taskToEdit}
            onSubmit={onTaskEditFormSubmit}
            onCancel={onTaskEditFormCancel}></TaskEditForm>
        </Modal>
      </Container>
    </>
  );
}

export default TaskManager;
