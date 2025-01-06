import React, { useState } from "react";
import { auth } from "../firebase-config";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

const OtpSignup = () => {
    const [phoneNumber, setPhoneNumber] = useState("");
    const [otp, setOtp] = useState("");
    const [confirmationResult, setConfirmationResult] = useState(null);
    const [isOtpSent, setIsOtpSent] = useState(false);

    // Thiết lập ReCAPTCHA
    const setupRecaptcha = () => {
        if (!window.recaptchaVerifier) {
            window.recaptchaVerifier = new RecaptchaVerifier(
                "recaptcha-container",
                {
                    size: "invisible",
                    callback: () => {
                        console.log("ReCAPTCHA verified");
                    },
                },
                auth
            );
        }
    };

    // Gửi OTP
    const sendOtp = () => {
        setupRecaptcha();
        const appVerifier = window.recaptchaVerifier;

        signInWithPhoneNumber(auth, phoneNumber, appVerifier)
            .then((confirmation) => {
                setConfirmationResult(confirmation);
                setIsOtpSent(true);
                console.log("OTP sent successfully");
            })
            .catch((error) => {
                console.error("Error sending OTP:", error);
            });
    };

    // Xác thực OTP
    const verifyOtp = () => {
        if (confirmationResult) {
            confirmationResult
                .confirm(otp)
                .then((result) => {
                    console.log("User signed in successfully:", result.user);
                })
                .catch((error) => {
                    console.error("Error verifying OTP:", error);
                });
        }
    };

    return (
        <div style={{ padding: "20px", maxWidth: "400px", margin: "auto" }}>
            <h2>Đăng ký với Số điện thoại</h2>
            <div id="recaptcha-container"></div>

            {!isOtpSent ? (
                <>
                    <input
                        type="tel"
                        placeholder="Nhập số điện thoại"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        style={{ padding: "10px", width: "100%", marginBottom: "10px" }}
                    />
                    <button
                        onClick={sendOtp}
                        style={{
                            backgroundColor: "#007bff",
                            color: "#fff",
                            padding: "10px",
                            border: "none",
                            width: "100%",
                            cursor: "pointer",
                        }}
                    >
                        Gửi OTP
                    </button>
                </>
            ) : (
                <>
                    <input
                        type="text"
                        placeholder="Nhập mã OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        style={{ padding: "10px", width: "100%", marginBottom: "10px" }}
                    />
                    <button
                        onClick={verifyOtp}
                        style={{
                            backgroundColor: "#28a745",
                            color: "#fff",
                            padding: "10px",
                            border: "none",
                            width: "100%",
                            cursor: "pointer",
                        }}
                    >
                        Xác thực OTP
                    </button>
                </>
            )}
        </div>
    );
};

export default OtpSignup;
