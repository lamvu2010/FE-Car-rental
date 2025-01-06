// Import các chức năng cần thiết từ Firebase SDK
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Cấu hình Firebase từ dự án Firebase của bạn
const firebaseConfig = {
    apiKey: "AIzaSyAQSUCGqcQfOd35O469C3_Awv7-ELe1LTU",
    authDomain: "otp-signup-car-rental.firebaseapp.com",
    projectId: "otp-signup-car-rental",
    storageBucket: "otp-signup-car-rental.firebasestorage.app",
    messagingSenderId: "1084485205159",
    appId: "1:1084485205159:web:54a6da66dc42c19110ef82",
    measurementId: "G-09HSSJX0CT"
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);

// Xuất đối tượng Authentication để sử dụng cho xác thực OTP
const auth = getAuth(app);

export { auth };
