import "./App.css";
import React, { useMemo, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthContext from "./contexts/AuthContext";
import {
  onAuthStateChanged,
  auth,
  getDoc,
  doc,
  db,
} from "./services/firebase.service.js";
import Home from "./containers/Home";
import Admin from "./components/Admin/Admin";
import UploadForm from "./components/UploadForm/UploadForm";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Info from "./components/Info/Info";
import AccountManager from "./components/AccountManager/AccountManager";
import VerifyAccount from "./components/AccountManager/VerifyAccount";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";
import ProductDetail from "./components/ProductDetail/ProductDetail";
import PostManager from "./components/AccountManager/PostManager";
import ChargeMoney from "./components/AccountManager/ChargeMoney";
import ChargeHistory from "./components/AccountManager/ChargeHistory";

function App() {
  // console.log = console.warn = console.error = () => {};
  const [currentUser, setCurrentUser] = useState(localStorage.user && JSON.parse(localStorage.user));

  onAuthStateChanged(auth, (user) => {
    if (user) {
    } else {
      // User is signed out
      setCurrentUser(null);
      delete localStorage.user;
      delete localStorage.uid
    }
  });

  const authCtxValue = useMemo(
    () => ({
      user: currentUser,
      setUser: (user) => {
        setCurrentUser(user);
      },
    }),
    [currentUser]
  );
  return (
    <AuthContext.Provider value={authCtxValue}>
      <div className="App">
        <BrowserRouter>
          <Header></Header>
          <Routes>
            <Route index element={<Home />} />
            <Route path="admin" element={<PrivateRoute roles={["admin"]} />}>
              <Route index element={<Admin />}></Route>
            </Route>
            <Route
              path="products/:productId"
              element={<ProductDetail />}
            ></Route>
            <Route
              path="upload"
              element={<PrivateRoute roles={["admin", "owner"]} />}
            >
              <Route index element={<UploadForm />}></Route>
            </Route>

            <Route
              path="account"
              element={<PrivateRoute roles={["admin", "owner", "hirer"]} />}
            >
              <Route element={<Info />}>
                <Route index element={<AccountManager />} />
                <Route path="xac-thuc-tai-khoan" element={<VerifyAccount />} />
                <Route path="quan-li-tin" element={<PostManager />} />
                <Route path="nap-tien" element={<ChargeMoney />} />
                <Route path="lich-su-nap-tien" element={<ChargeHistory />} />
              </Route>
            </Route>
          </Routes>
          <Footer></Footer>
        </BrowserRouter>
      </div>
    </AuthContext.Provider>
  );
}


export default App;
