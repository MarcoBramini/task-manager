import { Container } from "react-bootstrap";
import { todoManagerLogo } from "../ui-components/Icons";

import "../css/custom.css";
import "bootstrap/dist/css/bootstrap.min.css";

function Logo(props) {
  const getLogoIcon = () => {
    if (props.large) {
      return todoManagerLogo(140, 140);
    }
    if (props.medium) {
      return todoManagerLogo(80, 80);
    }
    return todoManagerLogo(16, 16);
  };

  const getColor = () => (!props.white ? "text-success" : "");

  if (props.large) {
    return (
      <Container className={"text-center logo-text-large " + getColor()}>
        <Container className='mb-2'>{getLogoIcon()}</Container>
        To Do Manager
      </Container>
    );
  } else if (props.medium) {
    return (
      <Container className={"text-center logo-text-medium " + getColor()}>
        <Container className='mb-2'>{getLogoIcon()}</Container>
        To Do Manager
      </Container>
    );
  } else {
    return (
      <Container className={"text-center " + getColor()}>
        {getLogoIcon()}
        <span className='ml-1'>ToDo Manager</span>
      </Container>
    );
  }
}

export default Logo;
