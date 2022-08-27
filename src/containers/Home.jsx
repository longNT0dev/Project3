import React, { useState } from "react";
import Banner from "../components/Banner/Banner";
import Search from "../components/Search/Search";
import ProductList from "./ProductList";

function Home() {
  const [keyword, setKeyword] = useState({
    district: null,
    subDistrict: null,
    street: null,
    min: 0,
    max: 0,
    category: null,
    areaMin: 0,
    areaMax: 0,
    facilities: [],
  });
  
  console.log(keyword);

  const [hasQuery, setHasQuery] = useState(false);
  const [queryItems, setQueryItems] = useState([]);
  return (
    <div className="col">
      <Banner></Banner>
      <div className="row" style={{minWidth:'1300px'}}>
        <Search
          keyword={keyword}
          setKeyword={setKeyword}
          setHasQuery={setHasQuery}
          setQueryItems={setQueryItems}
        ></Search>
        <ProductList
          search={keyword}
          hasQuery={hasQuery}
          queryItems={queryItems}
        ></ProductList>
      </div>
    </div>
  );
}

export default Home;








