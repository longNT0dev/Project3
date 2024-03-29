import React, { useContext } from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import AuthContext from "../../contexts/AuthContext.js";
import { Button, Form } from "react-bootstrap";
import {
  db,
  doc,
  getDoc,
  updateDoc,
  uploadBytesResumable,
  getDownloadURL,
  ref,
  storage,
} from "../../services/firebase.service";
import { MdVerified } from "react-icons/md";
import { GoUnverified } from "react-icons/go";
import { useState } from "react";

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

  const { user, setUser } = useContext(AuthContext);
  const [avatar, setAvatar] = useState(null);

  const handleUpdateAccount = async (data) => {
    if (user) {
      if (avatar) {
        const uploadTask = await uploadBytesResumable(
          ref(storage, `${avatar.path}-${user.uid}`),
          avatar
        ).then((result) => {
          return getDownloadURL(result.ref);
        });
        await updateDoc(doc(db, "users", user.uid), {
          name: data.name,
          avatar: uploadTask,
        }).then((result) => {
          console.log(result);
        });
      } else {
        await updateDoc(doc(db, "users", user.uid), {
          name: data.name,
        });
      }

      // call to get new data
      getDoc(doc(db, "users", user.uid)).then((result) => {
        let userInfo = Object.assign(result.data(), {
          uid: user.uid,
        });
        localStorage.user = JSON.stringify(userInfo);
        setUser(userInfo);
        window.location.reload();
      });
    }
  };

  return (
    <>
      <div className="col-5">
        <Form
          className="d-flex flex-column align-items-start text-start ms-3"
          onSubmit={handleSubmit(handleUpdateAccount)}
        >
          <Form.Group className="mb-3" style={{ width: "80%" }}>
            <Form.Label className="me-2">Mã tài khoản</Form.Label>{" "}
            {user && (user.role === "owner" || user.role === "admin") ? (
              <MdVerified
                style={{ color: "green" }}
                type="button"
                data-toggle="tooltip"
                title="Tài khoản của bạn đã được xác thực"
              />
            ) : (
              <GoUnverified
                style={{ color: "red" }}
                type="button"
                data-toggle="tooltip"
                title="Tài khoản của bạn chưa được xác thực"
              />
            )}
            <Form.Control
              className="container-fluid"
              value={user && user.uid}
              disabled
            />
          </Form.Group>
          <Form.Group className="mb-3" style={{ width: "80%" }}>
            <Form.Label>Số điện thoại</Form.Label>
            <Form.Control value={user && user.phoneNumber} disabled />
          </Form.Group>
          <Form.Group className="mb-3" style={{ width: "80%" }}>
            <Form.Label>Tên</Form.Label>
            <Form.Control
              type="text"
              defaultValue={user && user.name}
              {...register("name", { required: true })}
            />
            <span style={{ color: "red" }}>{errors.name?.message}</span>
          </Form.Group>

          <Form.Group className="mb-3" style={{ width: "80%" }}>
            <Button className="btn btn-primary container" type="submit">
              Cập nhật thông tin
            </Button>
          </Form.Group>
        </Form>
      </div>
      <div className="col-7">
        <div
          className="border text-start ps-3 mt-3"
          style={{ height: "40px", lineHeight: "40px" }}
        >
          Số dư: <b style={{ color: "#0d6efd", fontSize: "17px" }}>0đ</b>
        </div>

        <div className="mt-5">
          <label
            htmlFor="avatar"
            style={{
              border: "1px solid black",
              display: "inline-block",
              width: "150px",
              height: "150px",
              cursor: "pointer",
              borderRadius: "50%",
              paddingTop: "36px",
              position: "relative",
            }}
          >
            <input
              id="avatar"
              style={{ display: "none" }}
              type="file"
              onChange={(e) => setAvatar(e.target.files[0])}
            />
            {avatar ? (
              <img
                src={URL.createObjectURL(avatar)}
                onLoad={() => URL.revokeObjectURL(avatar)}
                width="100%"
                height="100%"
                style={{
                  borderRadius: "50%",
                  position: "absolute",
                  left: "0",
                  top: "0",
                }}
              />
            ) : (
              <>
                <img
                  src="http://cdn.onlinewebfonts.com/svg/img_391162.png"
                  width="50px"
                  height="50px"
                />
                <br />
                <small>Change your avatar</small>
              </>
            )}
          </label>
        </div>
      </div>
    </>
  );
}

export default AccountManager;
