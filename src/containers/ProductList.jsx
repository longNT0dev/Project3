import React, { useEffect, useState } from "react";
import { Card, Placeholder } from "react-bootstrap";
import ProductItem from "../components/ProductItem/ProductItem";
import {
  db,
  collection,
  getDocs,
  where,
  query,
  orderBy,
} from "../services/firebase.service.js";

function ProductList({ keyword, hasQuery, queryItems }) {
  const [products, setProducts] = useState([]);
  const [productFilter, setProductFilter] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 10;


  async function fetchDataList() {
    let favoritePost
    if (!localStorage.favoritePost) {
      localStorage.favoritePost = JSON.stringify([])
    } else {
      favoritePost = new Set(JSON.parse(localStorage.favoritePost))
    }

    let docs = await getDocs(
      query(
        collection(db, "posts"),
        where("status", "==", 1),
        orderBy("typeOfNews", "desc")
      )
    );
    let result = [];
    docs.forEach((doc) => {
      doc.data().files = result.push({ id: doc.id, ...doc.data() });
    });

    for (let el1 of result) {
      for (let el2 of favoritePost) {
        if (el1.id == el2) {
          el1.isFavor = true
        }
      }
    }
    setTotalPages(Math.ceil(result.length / itemsPerPage));
    setProducts(result);
    setProductFilter(
      result.slice((page - 1) * itemsPerPage, page * itemsPerPage)
    );
    setIsLoading(false);
  }


  let [detectChangeLocal, setDetectChangeLocal] = useState(true)
  useEffect(() => {
    fetchDataList();
  }, [detectChangeLocal]);

  const [queryItemsFilter, setQueryItemsFilter] = useState([]);
  useEffect(() => {
    if (!hasQuery) {
      setProductFilter(
        products.slice((page - 1) * itemsPerPage, page * itemsPerPage - 1)
      );
    } else {
      setTotalPages(Math.ceil(queryItems.length / itemsPerPage));
      setQueryItemsFilter(
        queryItems.slice((page - 1) * itemsPerPage, page * itemsPerPage)
      );
    }
  }, [hasQuery, page]);

  return (
    <div className="col-9 d-grid gap-3">
      {isLoading ? (
        <Card style={{ width: "100%", height: "100%" }}>
          <Card.Body>
            <Placeholder as={Card.Title} animation="glow">
              <Placeholder xs={6} />
            </Placeholder>
            <Placeholder as={Card.Text} animation="glow">
              <Placeholder xs={7} /> <Placeholder xs={4} />{" "}
              <Placeholder xs={4} /> <Placeholder xs={6} />{" "}
              <Placeholder xs={8} />
            </Placeholder>
            <Placeholder.Button variant="primary" xs={6} />
          </Card.Body>
        </Card>
      ) : hasQuery ? (
        <>
          {
            queryItemsFilter &&
            queryItemsFilter.map((product, i) => (
              <ProductItem
                key={"query" + product.id}
                id={product.id}
                src={product.src[0]}
                title={product.title}
                content={product.content}
                price={product.price}
                category={product.category}
                area={product.area}
                address={product.address}
                createdAt={product.createdAt}
                typeNews={product.typeOfNews}
                isFavorite={product.isFavor}
                setChangeLocal={setDetectChangeLocal}
              ></ProductItem>
            ))}
          <ul className="pagination justify-content-center">
            <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => setPage((prev) => prev - 1)}
              >
                Previous
              </button>
            </li>
            {totalPages &&
              Array(totalPages)
                .fill(0)
                .map((e, i) => (
                  <li
                    key={"page" + i}
                    className={`page-item ${i + 1 === page ? "active" : ""}`}
                  >
                    <button
                      className="page-link"
                      onClick={() => setPage(i + 1)}
                    >
                      {i + 1}
                    </button>
                  </li>
                ))}
            <li
              className={`page-item ${page === totalPages ? "disabled" : ""}`}
            >
              <button
                className="page-link"
                onClick={() => setPage((prev) => prev + 1)}
              >
                Next
              </button>
            </li>
          </ul>
        </>
      ) : (
        productFilter && (
          <>
            {productFilter.map((product, i) => (
              <ProductItem
                key={product.id}
                id={product.id}
                src={product.src[0]}
                title={product.title}
                content={product.content}
                price={product.price}
                category={product.category}
                area={product.area}
                address={product.address}
                createdAt={product.createdAt}
                typeNews={product.typeOfNews}
                isFavorite={product.isFavor && product.isFavor}
                setChangeLocal={setDetectChangeLocal}
              ></ProductItem>
            ))}
            <ul className="pagination justify-content-center">
              <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                <button
                  className="page-link"
                  onClick={() => setPage((prev) => prev - 1)}
                >
                  Previous
                </button>
              </li>
              {totalPages &&
                Array(totalPages)
                  .fill(0)
                  .map((e, i) => (
                    <li
                      key={"page" + i}
                      className={`page-item ${i + 1 === page ? "active" : ""}`}
                    >
                      <button
                        className="page-link"
                        onClick={() => setPage(i + 1)}
                      >
                        {i + 1}
                      </button>
                    </li>
                  ))}
              <li
                className={`page-item ${page === totalPages ? "disabled" : ""}`}
              >
                <button
                  className="page-link"
                  onClick={() => setPage((prev) => prev + 1)}
                >
                  Next
                </button>
              </li>
            </ul>
          </>
        )
      )}
    </div>
  );
}

export default ProductList;
