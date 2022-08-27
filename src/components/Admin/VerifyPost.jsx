import React, { useEffect, useState } from "react";
import {
  getDocs,
  doc,
  db,
  collection,
  query,
  where,
  updateDoc,
} from "../../services/firebase.service";
import { Link } from "react-router-dom";

function VerifyPost() {
  const [post, setPost] = useState([]);
  useEffect(() => {
    getDocs(query(collection(db, "posts"), where("status", "==", 0))).then(
      (docs) => {
        let result = [];
        docs.forEach((doc) => {
          result.push(Object.assign(doc.data(), { id: doc.id }));
        });
        setPost(result);
      }
    );
  }, []);

  const handleAccept = (id) => {
    updateDoc(doc(db,"posts",id),{
      status: 1
    }).then(() => {
      window.location.reload();
    })
  };
  const handleReject = (id) => {
    updateDoc(doc(db,"posts",id),{
      status: -1
    }).then(() => {
      window.location.reload();
    })
  };

  return (
    <table className="mt-3 table">
      <thead>
        <tr>
          <th>#</th>
          <th>Link xem trước bài đăng</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {post &&
          post.map((e, i) => (
            <tr key={"post" + e.id}>
              <th>{i + 1}</th>
              <td>
                {" "}
                <Link target="_blank" to={`/products/${e.id}`}>
                  {e.id}
                </Link>
              </td>
              <td>
                <button
                  className="btn btn-primary me-2"
                  onClick={() => handleAccept(e.id)}
                >
                  Chấp nhận
                </button>
                <button className="btn btn-danger" onClick={() => handleReject(e.id)}>
                  Từ chối
                </button>
              </td>
            </tr>
          ))
        }
      </tbody>
    </table>
  );
}

export default VerifyPost;
