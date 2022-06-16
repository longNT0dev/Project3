import React, { useContext } from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import AuthContext from "../../contexts/AuthContext.js";
import { Button, Form } from "react-bootstrap";
import { updateProfile } from "../../services/firebase.service";
import { MdVerified } from "react-icons/md";
import { GoUnverified } from "react-icons/go";

// Handle message error validation
const validationSchema = yup.object().shape({
  name: yup.string().default(""),
});

function AccountManager() {
  // react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(validationSchema) });

  const { user } = useContext(AuthContext);

  const handleUpdateAccount = (data) => {
    if (user) {
      updateProfile(user, {
        displayName: data.name,
      })
        .then(() => {
          window.location.reload();
        })
        .catch((error) => {
          // An error occurred
          // ...
        });
    }
  };

  return (
    <div className="container border">
      <h3 className="text-start mt-3">Thông tin tài khoản</h3>
      <hr />
      <div className="row">
        <div className="col-4">
          <Form
            className="d-flex flex-column align-items-center text-start ms-3"
            onSubmit={handleSubmit(handleUpdateAccount)}
          >
            <Form.Group className="mb-3 container">
              <Form.Label className="me-2">Mã tài khoản</Form.Label>{" "}
              {user && user.isVerify ? (
                <MdVerified
                  style={{color: 'green'}}
                  type="button"
                  data-toggle="tooltip"
                  title="Tài khoản của bạn đã được xác thực"
                />
              ) : (
                <GoUnverified
                  style={{color: 'red'}}
                  type="button"
                  data-toggle="tooltip"
                  title="Tài khoản của bạn chưa được xác thực"
                />
              )}
              <Form.Control value={user && user.uid} disabled />
            </Form.Group>
            <Form.Group className="mb-3 container">
              <Form.Label>Số điện thoại</Form.Label>
              <Form.Control value={user && user.phoneNumber} disabled />
            </Form.Group>
            <Form.Group className="mb-3 container">
              <Form.Label>Tên</Form.Label>
              <Form.Control
                type="text"
                defaultValue={user && user.displayName}
                {...register("name", { required: true })}
              />
              <span style={{ color: "red" }}>{errors.name?.message}</span>
            </Form.Group>

            <Form.Group className="mb-3 container">
              <Button className="btn btn-primary container" type="submit">
                Cập nhật thông tin
              </Button>
            </Form.Group>
          </Form>
        </div>
        <div className="col-4">
          <div
            className="border text-start ps-3 mt-3"
            style={{ height: "40px", lineHeight: "40px" }}
          >
            Số dư: <b style={{ color: "#0d6efd", fontSize: "17px" }}>0đ</b>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AccountManager;
