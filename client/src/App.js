import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { getFilterIds } from "./services/TaskService";
import LoginPage from "./pages/LoginPage";
import TaskManager from "./pages/TaskManager";
import AuthContextProvider from "./auth-components/AuthContextProvider";
import AuthProtectedRoute from "./auth-components/AuthProtectedRoute";

function App() {
  return (
    <AuthContextProvider>
      <Switch>
        <Redirect exact from='/' to='/all' />

        {getFilterIds().map((filterId) => (
          <AuthProtectedRoute
            key={"route-" + filterId}
            path={"/" + filterId}
            failureRedirectPath='/login'>
            <TaskManager activeFilter={filterId} />
          </AuthProtectedRoute>
        ))}

        <Route key='route-login' path='/login' component={LoginPage} />
      </Switch>
    </AuthContextProvider>
  );
}

export default App;
