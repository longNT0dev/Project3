import { auth, storage, firestore } from "./firebase.service.js";

// Handle all backend api call

const register = ({ phoneNumber, userName, password }) => {
  const avatar = storage.ref("avatarDefault.png");
  auth
    .createUserWithEmailAndPassword(phoneNumber + "@gmail.com", password)
    .then((userCredential) => {
      const user = userCredential.user;
      user.updateProfile({
        displayName: userName,
        phoneNumber: phoneNumber,
        photoUrl: avatar,
      });
    });
};

const login = (phoneNumber, password) => {
  const appVerifier = window.recaptchaVerifier;
  auth
    .signInWithPhoneNumber(phoneNumber, appVerifier)
    .then((confirmationResult) => {
      window.confirmationResult = confirmationResult;
    });
};

const getMessages = (sender, receiver) => {
  return [
    {
      text: "Hello there",
      id: "1",
      sender: {
        name: "Ironman",
        uid: "user1",
        avatar: "https://data.cometchat.com/assets/images/avatars/ironman.png",
      },
    },
    {
      text: "Hi Mr. Stark",
      id: "2",
      sender: {
        name: "Spiderman",
        uid: "user2",
        avatar:
          "https://data.cometchat.com/assets/images/avatars/spiderman.png",
      },
    },
  ];
};

const sendMessages = (sender, receiver, message) => {
  console.log(message);
};

export const userService = {
  register,
  // login,
  // logout,
  // verifyOTP,
  // getAll, // Lấy tất cả bài đăng
  // getById, // Dùng id lấy chi tiết bài đăng
  // update,
  // deleteById: _delete,
  getMessages,
  sendMessages,
};
