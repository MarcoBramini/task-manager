import { useContext, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";

import LoginForm from "../ui-components/LoginForm";
import Logo from "../ui-components/Logo";
import ErrorToast from "../ui-components/ErrorToast";

import { AuthContext } from "../auth-components/AuthContextProvider";

import "../css/custom.css";
import "bootstrap/dist/css/bootstrap.min.css";

function LoginPage() {
  const [loginErrorMessage, setLoginErrorMessage] = useState(null);

  const authContext = useContext(AuthContext);

  const onLogin = (credentials) => {
    authContext.login(credentials).catch((err) => {
      setLoginErrorMessage(err);
    });
  };

  return (
    <Container className='mw-100 container-fluid'>
      <Row className='vheight-100 align-items-sm-center align-content-center'>
        <Col className='login-page-container-separator d-sm-block d-none'>
          <Logo large />
        </Col>
        <Col className='login-page-container d-sm-none d-block mb-4'>
          <Logo medium />
        </Col>
        <Col className='login-page-container'>
          <LoginForm onLogin={onLogin} />
        </Col>
      </Row>

      <ErrorToast
        errorMessage={loginErrorMessage}
        errorTitle={"Login error"}
        autohide
        show={loginErrorMessage !== null}
        delay='5000'
        onClose={() => setLoginErrorMessage(null)}></ErrorToast>
    </Container>
  );
}

export default LoginPage;
