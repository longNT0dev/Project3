import React, { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Button, Form, Modal } from "react-bootstrap";
import { FaFacebookF, FaGoogle, FaSignInAlt } from "react-icons/fa";
import styles from "./Login.module.scss";
import {
  db,
  collection,
  setDoc,
  doc,
  getDocs,
  getDoc,
  RecaptchaVerifier,
  auth,
  signInWithPhoneNumber,
} from "../../services/firebase.service.js";
import AuthContext from "../../contexts/AuthContext.js";

// Handle message error validation
const validationSchema = yup.object().shape({
  phoneNumber: yup
    .string()
    .required("Số điện thoại không được để trống")
    .matches(
      /(0[3|5|7|8|9])+([0-9]{8})\b/g,
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
  const [otp, setOTP] = useState("");
  const { setUser } = useContext(AuthContext);

  const requestOTP = (data) => {
    window.recaptchaVerifier = new RecaptchaVerifier(
      "recaptcha-container",
      {
        size: "invisible",
        callback: (response) => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
        },
      },
      auth
    );

    let appVerifier = window.recaptchaVerifier;
    let formatPhoneNumber = data.phoneNumber.replace("0", "+84");
    signInWithPhoneNumber(auth, formatPhoneNumber, appVerifier)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;
        setStep(1);
      })
      .catch((err) => {
        window.recaptchaVerifier.clear();
      });
  };

  const verifyOTP = (otp) => {
    setOTP(otp);
    if (otp.length === 6) {
      window.confirmationResult
        .confirm(otp)
        .then((result) => {
          // Check to add new user to db
          getDocs(collection(db, "users")).then((docs) => {
            let isExist = false;
            for (let e of docs.docs) {
              if (e.id === result.user.uid) {
                isExist = true;
                break;
              }
            }
            if (!isExist) {
              setDoc(doc(db, "users", result.user.uid), {
                role: "hirer",
                balance: 0,
                avatar: "",
                phoneNumber: result.user.phoneNumber,
                name: result.user.phoneNumber,
              });
            }
          });

          return result;
        })
        .then((userCredentials) => {
          // User signed in successfully.
          getDoc(doc(db, "users", userCredentials.user.uid)).then((result) => {
            localStorage.user = JSON.stringify(
              Object.assign(result.data(), { uid: userCredentials.user.uid })
            );
            setUser(JSON.parse(localStorage.user));
          });
          setShow(0);
        })
        .catch((error) => {
          // User couldn't sign in (bad verification code?)
          // ...
        });
    }
  };

  return (
    <>
      <Modal show={true} onHide={() => setShow(0)} className={styles.modal}>
        <Modal.Header closeButton>
          <Modal.Title>Đăng nhập</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit(requestOTP)}>
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
                      className={`${styles.signIn} container mb-3 }`}
                      type="submit"
                    >
                      <FaSignInAlt className="me-1 mb-1" />
                      Đăng nhập
                    </Button>
                    <div id="recaptcha-container"></div>
                  </Form.Group>
                ),
                1: (
                  <Form.Group>
                    <Form.Control
                      type="text"
                      onChange={(e) => verifyOTP(e.target.value)}
                      value={otp}
                      placeholder="Nhập mã OTP"
                    />
                  </Form.Group>
                ),
              }[step]
            }

            {/* <hr />
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
            </Form.Group> */}
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default Login;
