import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
import ProductItem from '../ProductItem/ProductItem';
import styles from "./Favorite.module.scss";
import {
    db,
    collection,
    getDocs,
    where,
    query,
    orderBy,
} from "../../services/firebase.service.js";


function Favorite() {

    const [products, setProducts] = useState([])


    async function fetchDataList() {
        let favoritePost
        if (!localStorage.favoritePost) {
            localStorage.favoritePost = JSON.stringify([])
        } else {
            favoritePost = JSON.parse(localStorage.favoritePost)
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
            if(favoritePost.includes(doc.id)) {
                doc.data().files = result.push({ id: doc.id, ...doc.data() });
            }
        });



        setProducts(result)
    }

    useEffect(() => {
        fetchDataList()
    }, [])


    return (
        <div className={`${styles.container} container row`}>
            {
                products && products.map((product, i) => (
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
                        isNotShowFavorite={true}
                    ></ProductItem>
                ))
            }
        </div>
    )
}

export default Favorite