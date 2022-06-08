import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Button, Form, Modal } from "react-bootstrap";
import { FaFacebookF, FaGoogle, FaSignInAlt } from "react-icons/fa";
import styles from "./Login.module.scss";
import { auth } from "../../services/firebase.service.js";
import firebase from "firebase/app";


// Handle message error validation
const validationSchema = yup.object().shape({
  phoneNumber: yup
    .string()
    .required("Số điện thoại không được để trống")
    .matches(
      /(84|0[3|5|7|8|9])+([0-9]{8})\b/g,
      "Số điện thoại không đúng định dạng"
    ),
});

function Login({ setShow }) {
  // react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(validationSchema) });

  // step login
  // 0 enter phone phoneNumber
  // 1 enter OTP
  const [step, setStep] = useState(0);

  const setUpRecaptcha = () => {
    window.recaptchaVerifier = new firebase.auth().RecaptchaVerifier(
      "recaptcha-container",
      {
        size: "invisible",
        callback: (response) => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
          // auth.signInWithPhoneNumber(response)
          console.log(response);
        },
      }
    );
  };

  const onSubmit = (data) => {
    setUpRecaptcha();
  };

  return (
    <>
      <Modal show={true} onHide={() => setShow(0)} className={styles.modal}>
        <Modal.Header closeButton>
          <Modal.Title>Đăng nhập</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit(onSubmit)}>
            {
              {
                0: (
                  <Form.Group className="mb-3">
                    <Form.Control
                      type="tel"
                      {...register("phoneNumber", { required: true })}
                      placeholder="Nhập số điện thoại"
                    />
                    <span style={{ color: "red" }}>
                      {errors.phoneNumber?.message}
                    </span>
                    <br />
                    <Button
                      className={styles.signIn + " container"}
                      type="submit"
                    >
                      <FaSignInAlt className="me-1 mb-1" />
                      Đăng nhập
                    </Button>
                    <div id="recaptcha-container"></div>
                  </Form.Group>
                ),
                1: <Form.Group></Form.Group>,
              }[step]
            }

            <hr />
            <Form.Group className="d-grid gap-2">
              <Button
                className={`${styles.fSignIn} d-flex align-items-center justify-content-center`}
              >
                <FaFacebookF />
                Đăng nhập bằng facebook
              </Button>
              <Button
                className={`${styles.gSignIn} d-flex align-items-center justify-content-center`}
              >
                <FaGoogle className="me-1 ms-1" />
                Đăng nhập bằng google
              </Button>
            </Form.Group>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default Login;
