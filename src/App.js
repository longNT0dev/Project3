import "./App.css";
import React, { useMemo, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthContext from "./contexts/AuthContext";
import { onAuthStateChanged, auth } from "./services/firebase.service.js";
import Home from "./containers/Home";
import Admin from "./components/Admin/Admin";
import UploadForm from "./components/UploadForm/UploadForm";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Info from "./components/Info/Info";
import NewsManager from "./components/NewsManager/NewsManager";
import AccountManager from "./components/AccountManager/AccountManager";
import VerifyAccount from "./components/AccountManager/VerifyAccount";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";

function App() {
  // console.log = console.warn = console.error = () => {};
  const [currentUser, setCurrentUser] = useState(localStorage.uid);

  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in
      setCurrentUser(user);
      localStorage.uid = user.uid;
    } else {
      // User is signed out
      setCurrentUser(null);
      delete localStorage.uid;
    }
  });
  // console.log(currentUser);

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
            <Route path="upload" element={<UploadForm />} />
            <Route path="account" element={<Info />}>
              <Route index element={<AccountManager />} />
              <Route path="xac-thuc-tai-khoan" element={<VerifyAccount />} />
              <Route path="quan-li-tin" element={<NewsManager />} />
              <Route path="nap-tien" element={<NewsManager />} />
              <Route path="lich-su-nap-tien" element={<NewsManager />} />
            </Route>
          </Routes>
          <Footer></Footer>
        </BrowserRouter>
      </div>
    </AuthContext.Provider>
  );
}

// {
//   /* <Suspense
//         fallback={
//           <Hypnosis
//             style={{
//               width: "100%",
//               height: "100%",
//               position: "absolute",
//               top: "0",
//               backgroundColor: "#222",
//               zIndex: "9999",
//             }}
//           />
//         }
//       ></Suspense> */
// }

export default App;
