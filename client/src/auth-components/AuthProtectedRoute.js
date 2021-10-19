import { Redirect, Route } from "react-router";
import { AuthContext } from "./AuthContextProvider";

function AuthProtectedRoute(props) {
  return (
    <Route
      key={props.key}
      path={props.path}
      render={() => (
        <AuthContext.Consumer>
          {(value) =>
            value.isUserLogged ? (
              props.children
            ) : (
              <Redirect to={props.failureRedirectPath} />
            )
          }
        </AuthContext.Consumer>
      )}
    />
  );
}

export default AuthProtectedRoute;
