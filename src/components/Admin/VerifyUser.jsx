import React, { useEffect } from "react";
import { useState } from "react";
import {
  db,
  collection,
  getDocs,
  where,
  query,
  updateDoc,
  doc
} from "../../services/firebase.service.js";
import { Button, Modal } from "react-bootstrap";

function VerifyUser() {
  const [users, setUsers] = useState([]);
  const [show, setShow] = useState(false);
  useEffect(() => {
    async function getUserWaitingVerify() {
      let docs = await getDocs(
        query(collection(db, "users"), where("isRequestVerify", "==", 1))
      );

      let result = [];
      docs.forEach((doc) => {
        result.push(Object.assign(doc.data(),{uid: doc.id}));
      });

      setUsers(result);
    }

    getUserWaitingVerify();
  }, []);

  const handleAcceptUser = (uid) => {
      updateDoc(doc(db, "users",uid),{
        isRequestVerify: -1
      })
  }

  const handleRejectUser = (uid) => {
    updateDoc(doc(db, "users",uid),{
      isRequestVerify: 0
    })
  }

  return (
    <div>
      {users &&
        users.map((e) => (
          <div
            style={{ position: "relative", width: "300px", height: "200px" }}
            key={"verify" + e.uid}
          >
            <img
              src="https://img.freepik.com/premium-vector/realistic-3d-light-box-with-platform-background-design-performance-show-exhibition-lightbox-studio-interior-podium-with-spotlights_220217-2306.jpg?w=2000"
              width="200"
              height="150"
            />
            <button
              style={{
                width: "fit-content",
                padding: "0px 12px",
                height: "40px",
                position: "absolute",
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
                margin: "auto auto",
                background: "linear-gradient(to right, #4776e6, #8e54e9)",
                color: "white",
              }}
              onClick={() => setShow(true)}
            >
              Xem chi tiết
            </button>

            <Modal
              show={show}
              onHide={() => setShow(false)}
              style={{ width: "100vw", height: "100vh" }}
            >
              <Modal.Header closeButton>
                <Modal.Title>Thông tin cần kiểm tra</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {e.imgForVerify.map((src) => (
                  <img src={src} width="200px" height="200px" />
                ))}
              </Modal.Body>
              <Modal.Footer>
                <Button variant="primary" onClick={() => handleAcceptUser(e.uid)}>Accept</Button>
                <Button variant="danger" onClick={() => handleRejectUser(e.uid)}>Reject</Button>
              </Modal.Footer>
            </Modal>
          </div>
        ))}
    </div>
  );
}

export default VerifyUser;
