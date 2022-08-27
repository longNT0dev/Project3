import React, { useState } from "react";
import { useContext } from "react";
import AuthContext from "../../contexts/AuthContext";
import PreviewImage from "../UploadForm/PreviewImage";
import {
  db,
  storage,
  ref,
  doc,
  uploadBytesResumable,
  getDownloadURL,
  updateDoc,
  getDoc,
} from "../../services/firebase.service.js";

function VerifyAccount() {
  const { user, setUser } = useContext(AuthContext);
  const [files, setFiles] = useState([]);
  const handleSendVerifyAccount = () => {
    if (files.length !== 0) {
      const promises = [];
      const uid = Date.now();
      files.forEach((file) => {
        const uploadTask = uploadBytesResumable(
          ref(storage, `${file.path}-${uid}`),
          file
        ).then((result) => {
          return getDownloadURL(result.ref);
        });

        promises.push(uploadTask);
      });

      Promise.all(promises)
        .then((src) => {
          // store to firebase
          updateDoc(doc(db, "users", user.uid), {
            imgForVerify: src,
            isRequestVerify: 1,
          });
        })
        .then(() => {
          // call to get new data
          getDoc(doc(db, "users", user.uid)).then((result) => {
            let userInfo = Object.assign(result.data(), {
              uid: user.uid,
            });
            localStorage.user = JSON.stringify(userInfo);
            setUser(userInfo);
            window.location.reload();
          });
        })
        .catch((err) => new Error(err));
    } else {
      alert("Pls choose at least 1 image");
    }
  };
  return (
    <ul className="mt-3" style={{ listStyle: "none" }}>
      {user &&
        user.isRequestVerify &&
        {
          "-1": <h4 style={{ color: "red", marginTop: "12px" }}>
          Tài khoản của bạn đã được xét duyệt thành công 
        </h4>,
          0: (
            <div>
              <li>Tài khoản của bạn chưa được xác thực hoặc yêu cầu xác thực không được chấp nhận</li>
              <li>Cung cấp giấy tờ tùy thân (cmnd,cccd)</li>
              <li>Cung cấp giấy tờ sở hữu và sử dụng đất</li>
              <PreviewImage files={files} setFiles={setFiles}></PreviewImage>
              <li>
                <button
                  className="btn btn-primary"
                  onClick={() => handleSendVerifyAccount(user.uid)}
                >
                  Xác thực
                </button>
              </li>
            </div>
          ),
          1: (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <img
                src="https://c8.alamy.com/comp/2C6X18E/waiting-room-icon-vector-graphics-beautiful-design-and-fully-editable-vector-for-commercial-print-media-web-or-any-type-of-design-projects-2C6X18E.jpg"
                width="200px"
                height="200px"
              />
              <h4 style={{ color: "red", marginTop: "12px" }}>
                Tài khoản của bạn đang trong quá trình xét duyệt, vui lòng đợi
              </h4>
            </div>
          ),
        }[user.isRequestVerify]}
    </ul>
  );
}

export default VerifyAccount;
