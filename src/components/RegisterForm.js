import React, { useState, useRef } from "react";
import { Button, Row, Col, Form, InputGroup } from "react-bootstrap";
import Link from "next/link";
import { useRouter } from "next/router";
import styles from "@/styles/form.module.css";
import LoadingSpinner from "./LoadingSpinner";
import { signIn } from "next-auth/react";
import { toast } from "react-toastify";

const RegisterForm = (props) => {
  const [validated, setValidated] = useState(false);
  const [isInvalidEmail, setIsInvalidEmail] = useState(null);
  const [isInvalidPassword, setIsInvalidPassword] = useState(null);
  const [isInvalidCnfPassword, setIsInvalidCnfPassword] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const passwordRef = useRef();
  const cnfPasswordRef = useRef();
  const emailRef = useRef();
  const router = useRouter();
  const handleSignUp = async (email, password, cnfPassword) => {
    let url = `${process.env.NEXT_PUBLIC_BASENAME}api/signup`;
    try {
      setIsLoading(true);
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
          cnfPassword: cnfPassword,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        console.log(data);
        toast.success("Sign up successful!");
        router.push("/login");
      } else {
        let errorMessage = "Invalid Credentials!";
        if (data && data.error) {
          errorMessage = data.error;
        }
        throw new Error(errorMessage);
      }
    } catch (error) {
      toast.error(error.message);
      router.push("/signup");
    } finally {
      setIsLoading(false);
    }
  };
  const handleSubmitRegister = async (event) => {
    event.preventDefault();
    setError(null);
    const enteredPassword = passwordRef.current.value;
    const enteredEmail = emailRef.current.value;
    const enteredCnfPass = cnfPasswordRef.current.value;
    if (enteredEmail.length === 0 || !enteredEmail.includes("@")) {
      setIsInvalidEmail(true);
      return;
    } else setIsInvalidEmail(false);

    if (enteredPassword.length < 6) {
      setIsInvalidPassword(true);
      return;
    } else setIsInvalidPassword(false);

    if (enteredPassword !== enteredCnfPass) {
      setIsInvalidCnfPassword(true);
    } else setIsInvalidCnfPassword(false);

    handleSignUp(enteredEmail, enteredPassword, enteredCnfPass);
  };
  let content = null;
  if (isLoading) {
    content = <LoadingSpinner />;
  } else if (props.postUrl === "SignUp") {
    content = (
      <Form
        noValidate
        validated={validated}
        onSubmit={handleSubmitRegister}
        className={styles.formWrap}
      >
        <h3 style={{ textAlign: "center" }}>{props.title}</h3>
        <Row className="mb-3">
          <Form.Group as={Col} md="12" controlId="validationCustomEmail">
            <Form.Label>Email</Form.Label>
            <InputGroup hasValidation>
              <Form.Control
                type="email"
                placeholder="Enter email"
                aria-describedby="inputGroupPrepend"
                ref={emailRef}
                isInvalid={isInvalidEmail}
                required
              />
              <Form.Control.Feedback type="invalid">
                Please enter a valid email address
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>

          <Form.Group
            as={Col}
            md="12"
            controlId="validationCustomPassword"
            className="my-2"
          >
            <Form.Label>Password</Form.Label>
            <InputGroup hasValidation>
              <Form.Control
                type="password"
                placeholder="Enter password"
                aria-describedby="inputGroupPrepend"
                ref={passwordRef}
                isInvalid={isInvalidPassword}
                required
                autoComplete="on"
              />
              <Form.Control.Feedback type="invalid">
                Please should be of at least 6 characters
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>
          <Form.Group
            as={Col}
            md="12"
            controlId="validationCustomCnfPassword"
            className="my-2"
          >
            <Form.Label>Confirm Password</Form.Label>
            <InputGroup hasValidation>
              <Form.Control
                type="password"
                placeholder="Confirm password"
                aria-describedby="inputGroupPrepend"
                ref={cnfPasswordRef}
                isInvalid={isInvalidCnfPassword}
                required
                autoComplete="on"
              />
              <Form.Control.Feedback type="invalid">
                Passwords do not match
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>
          {error && <small style={{ color: "red" }}>{error}</small>}
        </Row>
        <div className="d-grid">
          <Button type="submit">Submit</Button>
        </div>
        <p className="text-end my-2">
          {props.question}
          <Link href={props.linked} style={{ textDecoration: "none" }}>
            {props.oppo}
          </Link>
        </p>
      </Form>
    );
  }
  return content;
};
export default RegisterForm;
