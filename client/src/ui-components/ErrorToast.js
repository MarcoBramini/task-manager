import { Toast } from "react-bootstrap";
import { iconError } from "../ui-components/Icons";

function ErrorToast(props) {
  return (
    <Toast
      className='error-toast'
      onClose={props.onClose}
      show={props.show}
      delay={props.delay}
      autohide={props.autohide}>
      <Toast.Header className='error-toast-header'>
        {iconError}
        <strong className='ml-2 mr-auto'>{props.errorTitle}</strong>
      </Toast.Header>
      <Toast.Body>{props.errorMessage}</Toast.Body>
    </Toast>
  );
}

export default ErrorToast;
