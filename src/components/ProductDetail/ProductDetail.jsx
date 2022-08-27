import React, { useContext, useState, useEffect } from "react";
import "./ProductDetail.css";
import { default as ImageSlider } from "./ImageSlider";
import { FaStar } from "react-icons/fa";
import {
  doc,
  getDoc,
  db,
  addDoc,
  getDocs,
  query,
  where,
  collection,
} from "../../services/firebase.service";
import { Link, useParams } from "react-router-dom";
import { facilityOptions } from "../Search/SearchConstant";
import AuthContext from "../../contexts/AuthContext";
import { BsMessenger } from "react-icons/bs";
import { Button } from "react-bootstrap";

const colors = {
  orange: "#FFBA5A",
  grey: "#A9A9A9",
};

const ratingStyles = {
  room_review_by_self: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },

  textarea: {
    border: "1px solid #A9A9A9",
    borderRadius: 5,
    width: 400,
    padding: 10,
    minHeight: 150,
    margin: "20px",
  },

  button: {
    border: "1px solid #A9A9A9",
    borderRadius: 5,
    width: 400,
    padding: 10,
    backgroundColor: "#f6dddf",
    marginBottom: "30px",
  },

  create_review_comment: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
};

function ProductDetail() {
  const stars = Array(5).fill(0);
  const [rate, setRate] = useState(0);
  const [error, setError] = useState("");
  const [comment, setComment] = useState("");
  const { productId } = useParams();
  const { user } = useContext(AuthContext);

  const handleClick = (value) => {
    setRate(value);
  };

  const handleSubmitComment = () => {
    if (comment) {
      addDoc(collection(db, "comments"), {
        rate: rate,
        comment: comment,
        sender: {
          avatar: user.avatar,
          name: user.name,
        },
        productId: productId,
      }).then(() => {
        window.location.reload();
      });
    } else {
      setError("Comment không được để trống");
    }
  };

  // get detail product
  const [productDetail, setProductDetail] = useState();

  useEffect(() => {
    async function getDetailProduct(productId) {
      let result = await getDoc(doc(db, "posts", productId));

      setProductDetail(result.data());
    }

    getDetailProduct(productId);
  }, [productId]);

  const [owner, setOwner] = useState();
  useEffect(() => {
    async function getOwnerInfo(productId) {
      let result = await getDoc(doc(db, "posts", productId));

      getDoc(result.data().userRef).then((user) => {
        setOwner(Object.assign(user.data(), { id: user.id }));
      });
    }

    getOwnerInfo(productId);
  }, [productId]);

  // Get rate star
  const [rateStar, setRateStar] = useState(0);
  useEffect(() => {
    async function getRateStar(productId) {
      getDocs(
        query(collection(db, "comments"), where("productId", "==", productId))
      ).then((docs) => {
        let count = 0
        let rateSum = 0
        docs.forEach((doc) => {
          count++
          rateSum += doc.data().rate
        });

        setRateStar(rateSum / count)
      });
    }

    getRateStar(productId);
  }, [productId]);

  const [commentList, setCommentList] = useState([]);
  async function getComments(productId) {
    getDocs(
      query(collection(db, "comments"), where("productId", "==", productId))
    ).then((docs) => {
      let result = [];
      docs.forEach((doc) => {
        result.push(Object.assign(doc.data(), { commentId: doc.id }));
      });

      setCommentList(result);
    });
  }
  useEffect(() => {
    getComments(productId);
  }, [productId]);


  const [filterCommentList, setFilterCommentList] = useState([]);
  const [isPositive, setIsPositive] = useState(true);
  const handleFilterPositive = () => {
    setFilterCommentList(commentList.filter(el => el.rate >= 4))
    setIsPositive(true)
  }


  const handleFilterNegative = () => {
    setFilterCommentList(commentList.filter(el => el.rate > 0 && el.rate < 4))
    setIsPositive(false)
  }

  return (
    <div className="room_detail_container">
      <div className="room_detail">
        <div className="show_detail">
          <div className="row justify_space_around">
            <div className="col-md-7 col-12 room_illustation">
              <div className="show_detail_image_slider v-window carousel v-item-group theme--dark v-window--show-arrows-on-hover v-carousel v-carousel--hide-delimiter-background">
                <div className="slideshow_container">
                  <div className="v-window-item">
                    <ImageSlider
                      slides={productDetail && productDetail.src}
                    ></ImageSlider>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-5 col-12 room_information">
              <div className="row room_owner_info">
                <div className="col col-12">
                  <div className="detail_list_item">
                    <div className="item--title">Thông tin chung</div>
                    <div className="item--content">
                      <div>
                        <div className="item--subtitle">Họ tên chủ trọ: </div>
                        <div className="item--text">
                          {owner && owner.name}
                        </div>
                      </div>
                      <div>
                        <div className="item--subtitle">
                          Số điện thoại liên hệ:{" "}
                        </div>
                        <div className="item--text">
                          {owner && owner.phoneNumber}
                        </div>
                      </div>
                      <div>
                        <div className="item--subtitle">
                          Kiểu phòng cho thuê:{" "}
                        </div>
                        <div className="item--text">
                          {productDetail && productDetail.category}
                        </div>

                        {/* <Link to={`/chat/${owner && owner.id}`}><BsMessenger className="ms-5" /></Link> */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row room_detail_info">
                <div className="col col-12">
                  <div className="detail-list-item mt-4">
                    <div className="item--title">Chi tiết loại phòng</div>
                  </div>
                  <div className="v-data-table v-data-table--fixed-header theme--light">
                    <div className="v-data-table__wrapper">
                      <table>
                        <tbody>
                          <tr className="info_table_tr">
                            <td>Diện tích&nbsp;</td>
                            <td>
                              {productDetail && productDetail.area}m<sup>2</sup>
                            </td>
                          </tr>
                          <tr className="info_table_tr">
                            <td>Địa chỉ&nbsp;</td>
                            <td>{productDetail && productDetail.address}</td>
                          </tr>
                          <tr className="info_table_tr">
                            <td>Cơ sở vật chất</td>
                            <td>
                              <ul className="facilities ml-auto mr-auto">
                                {productDetail &&
                                  productDetail.facilities.map((e) => (
                                    <li key={"facilities" + e}>
                                      {facilityOptions[e].label}
                                    </li>
                                  ))}
                              </ul>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row room_price">
                <div className="col">
                  <div className="detail-list-item mt-4">
                    <div className="item--title">
                      Giá thuê
                      <br />
                    </div>
                    <div className="price">
                      {productDetail && productDetail.price} triệu đồng/tháng
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row_room_opinion">
          <div className="room_review_by_others">
            <div className="item--title ribbon--title room_review_by_others_ribbon">
              Bình luận
            </div>

            <div className="room_reviews_list">
              <div className="row mb-3" style={{ height: "240px", backgroundColor: "rgb(240 226 216)" }}>
                <div className="col-3 d-flex flex-column justify-content-center align-items-center">
                  <div className="text-center">
                    {Math.floor(rateStar * 10) / 10} trên 5
                  </div>
                  <div className="text-center">
                    {Array(Math.round(rateStar)).fill(0).map((_, index) => {
                      return (
                        <FaStar
                          className="create_rating_stars"
                          key={index}
                          size={30}
                          color={colors.orange}
                        />
                      );
                    })}
                  </div>
                </div>
                <div className="col-9 d-flex justify-content-start align-items-center">
                  <Button variant="outline-success mx-2" onClick={handleFilterPositive}>Tích cực {isPositive && (filterCommentList.length)}</Button>
                  <Button variant="outline-danger" onClick={handleFilterNegative}>Tiêu cực {!isPositive && (filterCommentList.length)}</Button>
                </div>
              </div>
              <ul className="d-flex flex-column align-items-start">
                {filterCommentList.length !== 0 ?
                  filterCommentList.map((e) => (
                    <li key={"filter" + e.commentId} className="comment_detail">
                      <div className="user_avatar">
                        <img
                          style={{ borderRadius: "50%" }}
                          width="50px"
                          height="50px"
                          className="user_avatar_img"
                          src={e.sender.avatar}
                        />
                      </div>
                      <div className="user_text">
                        <div className="comment_info">
                          <div className="user_name">
                            <span className="me-2">{e.sender.name}</span>
                            <span>
                              {Array(e.rate)
                                .fill(0)
                                .map((e) => (
                                  <FaStar
                                    className="create_rating_stars"
                                    size={15}
                                    style={{
                                      margin: 2,
                                      cursor: "pointer",
                                      color: "orange",
                                    }}
                                  />
                                ))}
                            </span>
                          </div>
                          <div className="user_comment">{e.comment}</div>
                        </div>
                      </div>
                    </li>
                  ))
                  :
                  commentList &&
                  commentList.map((e) => (
                    <li key={e.commentId} className="comment_detail">
                      <div className="user_avatar">
                        <img
                          style={{ borderRadius: "50%" }}
                          width="50px"
                          height="50px"
                          className="user_avatar_img"
                          src={e.sender.avatar}
                        />
                      </div>
                      <div className="user_text">
                        <div className="comment_info">
                          <div className="user_name">
                            <span className="me-2">{e.sender.name}</span>
                            <span>
                              {Array(e.rate)
                                .fill(0)
                                .map((e) => (
                                  <FaStar
                                    className="create_rating_stars"
                                    size={15}
                                    style={{
                                      margin: 2,
                                      cursor: "pointer",
                                      color: "orange",
                                    }}
                                  />
                                ))}
                            </span>
                          </div>
                          <div className="user_comment">{e.comment}</div>
                        </div>
                      </div>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
          <hr className="room_review_separator" />
          <div
            style={ratingStyles.room_review_by_self}
            className="room_review_by_self"
          >
            <div className="item--title ribbon--title room_review_by_self_ribbon">
              Đánh giá của bạn
            </div>
            <div className="create_review">
              <div className="create_review_rating">
                {stars.map((_, index) => {
                  return (
                    <FaStar
                      className="create_rating_stars"
                      key={index}
                      size={45}
                      style={{
                        margin: 10,
                        cursor: "pointer",
                      }}
                      color={rate > index ? colors.orange : colors.grey}
                      onClick={() => handleClick(index + 1)}
                    />
                  );
                })}
              </div>
              <div
                style={ratingStyles.create_review_comment}
                className="create_review_comment"
              >
                <textarea
                  style={ratingStyles.textarea}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Cảm nhận của bạn về phòng trọ này ..."
                ></textarea>
                <p style={{ color: "red" }}>{error && error}</p>
                <button
                  style={ratingStyles.button}
                  className="button_submit_rating"
                  onClick={() => handleSubmitComment()}
                >
                  Gửi đánh giá
                </button>
              </div>
            </div>
          </div>
          <hr className="room_review_separator" />
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
