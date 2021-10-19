import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router";
import { Spinner } from "react-bootstrap";
import {
  loginUser,
  getCurrentUser,
  logoutUser,
} from "../services/TaskManagerAPIClient";

import "../css/custom.css";
import "bootstrap/dist/css/bootstrap.min.css";

const AuthContext = React.createContext();

function AuthContextProvider(props) {
  const location = useLocation();
  const history = useHistory();

  const [authState, setAuthState] = useState({
    isUserLogged: false,
    currentUser: null,
    redirectPath: location.pathname !== "/login" ? location.pathname : "/",
    login: function (credentials) {
      return new Promise((resolve, reject) => {
        loginUser(credentials)
          .then((user) => {
            setAuthState((old) => {
              return { ...old, isUserLogged: true, currentUser: user };
            });
            history.push(authState.redirectPath);
            return resolve();
          })
          .catch((err) => {
            return reject(err.message);
          });
      });
    },
    logout: function () {
      return new Promise((resolve, reject) => {
        if (!this.isUserLogged) {
          return resolve();
        }
        logoutUser()
          .then(() => {
            setAuthState((old) => {
              return {
                ...old,
                isUserLogged: false,
                currentUser: null,
              };
            });
            history.push("/login");
            return resolve();
          })
          .catch((err) => {
            return reject(err.message);
          });
      });
    },
  });

  const [isAuthInitialized, setIsAuthInitialized] = useState(false);

  useEffect(() => {
    if (isAuthInitialized) return;

    const fetchCurrentUser = () => {
      getCurrentUser().then((currentUser) => {
        if (currentUser !== null) {
          let redirectPath = "";
          setAuthState((old) => {
            redirectPath = old.redirectPath;
            return {
              ...old,
              isUserLogged: true,
              currentUser: currentUser,
            };
          });
          history.push(redirectPath);
        }
        setIsAuthInitialized(true);
      });
    };

    fetchCurrentUser();
  }, [history, isAuthInitialized]);

  return (
    <AuthContext.Provider value={authState}>
      {!isAuthInitialized ? (
        <Spinner className='launch-page-spinner'></Spinner>
      ) : (
        props.children
      )}
    </AuthContext.Provider>
  );
}

export { AuthContextProvider as default, AuthContext };
