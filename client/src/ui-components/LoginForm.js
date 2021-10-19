import { Form, Button, Container } from "react-bootstrap";
import { useState } from "react";

function LoginForm(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onEmailChange = (event) => {
    const newVal = event.target.value;

    if (newVal.trim() === "") {
      setEmail("");
      return;
    }

    setEmail(newVal);
  };

  const onPasswordChange = (event) => {
    const newVal = event.target.value;
    setPassword(newVal);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const credentials = { email: email, password: password };

    if (email !== "" && password !== "") {
      props.onLogin(credentials);
    }
  };

  return (
    <Container className='mx-auto'>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId='email'>
          <Form.Label className='fw-200'>Email</Form.Label>
          <Form.Control
            className='fw-300'
            required
            type='email'
            placeholder='Enter your email'
            value={email}
            onChange={onEmailChange}
          />
        </Form.Group>
        <Form.Group controlId='password'>
          <Form.Label className='fw-200'>Password</Form.Label>
          <Form.Control
            className='fw-300'
            required
            type='password'
            placeholder='Enter your password'
            value={password}
            onChange={onPasswordChange}
          />
        </Form.Group>
        <Button type='submit' variant='outline-success'>
          Login
        </Button>
      </Form>
    </Container>
  );
}

export default LoginForm;
