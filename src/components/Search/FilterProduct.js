// district: "",
// subDistrict: "",
// street: "",
// min: "",
// max: "",
// category: "",
// areaMin: "",
// areaMax: "",
// facilities: "",
import { db, collection, getDocs } from "../../services/firebase.service.js";

const FilterProduct = async (keyword) => {
  console.log(keyword);
  let docs = await getDocs(collection(db, "posts"));
  let result = [];
  docs.forEach((doc) => {
    let data = Object.assign(doc.data(), {id: doc.id });
    let check = false;

    if (
      data.district.includes(keyword.district) ||
      data.subDistrict.includes(keyword.subDistrict) ||
      data.street.includes(keyword.street) ||
      data.category.includes(keyword.category)
    ) {
      check = true;
    }

    console.log("Giá", data.price >= keyword.min && data.price <= keyword.max);
    if (
      (data.price >= keyword.min && data.price <= keyword.max) ||
      (data.area >= keyword.areaMin && data.area <= keyword.areaMax)
    ) {
      check = true;
    }

    for (let el of data.facilities) {
      if (keyword.facilities.includes(el)) {
        check = true;
        break;
      }
    }

    if (check) {
      result.push(data);
    }
  });

  return result;
};

export default FilterProduct;
