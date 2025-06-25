import styles from './ForgetPassword.module.css';
import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";

export default function ForgetPassword() {
    const [step, setStep] = useState(1); // 1: Email, 2: Code Verification, 3: New Password
    const [email, setEmail] = useState("");
    const [apiError, setApiError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Step 1: Send verification code
    const handleSendCode = async (values) => {
        try {
            setLoading(true);
            await axios.post(
                "http://ebic-bid11.runasp.net/api/Account/forgetpassword",
                { email: values.email },
                { headers: { "Content-Type": "application/json" } }
            );
            setEmail(values.email);
            setStep(2);
            setSuccessMessage("Verification code sent to your email");
        } catch (error) {
            setApiError("Failed to send verification code. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Step 2: Verify code
    const handleVerifyCode = async (values) => {
        try {
            setLoading(true);
            const response = await axios.post(
                "http://ebic-bid11.runasp.net/api/Account/verifycode",
                {
                    email: email,
                    resetcode: values.code.trim() // Ensure trimmed value
                },
                { headers: { "Content-Type": "application/json" } }
            );

            // Handle specific backend responses
            if (response.data.message === "Code expired") {
                setApiError("Code has expired. Please request a new one.");
            } else {
                setStep(3);
                setSuccessMessage("Code verified successfully");
            }

        } catch (error) {
            // Detailed error handling
            const backendMessage = error.response?.data?.message?.toLowerCase();

            if (backendMessage?.includes("expired")) {
                setApiError("Code has expired. Please request a new one.");
            } else if (error.response?.status === 400) {
                setApiError("Invalid code. Please check and try again.");
            } else if (error.response?.status === 404) {
                setApiError("No reset request found. Please start over.");
            } else {
                setApiError("Verification failed. Please try again.");
            }

        } finally {
            setLoading(false);
        }
    };

    // Step 3: Reset password
    const handleResetPassword = async (values) => {
        try {
            setLoading(true);
            await axios.put(
                "http://ebic-bid11.runasp.net/api/Account/resetpassword",
                {
                    email: email,
                    newPassword: values.newPassword,
                    confirmPassword: values.confirmPassword
                },
                { headers: { "Content-Type": "application/json" } }
            );
            setSuccessMessage("Password reset successfully. Redirecting to login...");
            setTimeout(() => navigate("/login"), 2000);
        } catch (error) {
            setApiError("Password reset failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className={styles.container}>
            <div className={styles.formContainer}>
                <h2>Password Reset</h2>

                {successMessage && <div className={styles.success}>{successMessage}</div>}
                {apiError && <div className={styles.error}>{apiError}</div>}

                {step === 1 && (
                    <EmailStep
                        onSubmit={handleSendCode}
                        loading={loading}
                    />
                )}

                {step === 2 && (
                    <VerifyCodeStep
                        onSubmit={handleVerifyCode}
                        loading={loading}
                        email={email}
                        onResend={handleSendCode}
                    />
                )}

                {step === 3 && (
                    <ResetPasswordStep
                        onSubmit={handleResetPassword}
                        loading={loading}
                    />
                )}

                <NavLink to="/login" className={styles.backLink}>
                    Back to Login
                </NavLink>
            </div>
        </main>
    );
}

// Sub-components for each step
const EmailStep = ({ onSubmit, loading }) => {
    const formik = useFormik({
        initialValues: { email: "" },
        validationSchema: Yup.object({
            email: Yup.string()
                .required("Email is required")
                .email("Invalid email address")
        }),
        onSubmit
    });

    return (
        <form onSubmit={formik.handleSubmit}>
            <div className={styles.inputGroup}>
                <label>Email Address</label>
                <input
                    type="email"
                    name="email"
                    placeholder="Enter your registered email"
                    {...formik.getFieldProps("email")}
                />
                {formik.touched.email && formik.errors.email && (
                    <div className={styles.error}>{formik.errors.email}</div>
                )}
            </div>
            <button type="submit" disabled={loading}>
                {loading ? "Sending..." : "Send Verification Code"}
            </button>
        </form>
    );
};

const VerifyCodeStep = ({ onSubmit, loading, email, onResend }) => {
    const handleResend = async () => {
        try {
            await onResend({ email });
        } catch (error) {
            console.error("Resend failed:", error);
        }
    };
    const formik = useFormik({
        initialValues: { code: "" },
        validationSchema: Yup.object({
            code: Yup.string()
                .required("Verification code is required")
                .length(4, "Must be 4 characters")
        }),
        onSubmit
    });

    return (
        <form onSubmit={formik.handleSubmit}>
            <div className={styles.inputGroup}>
                <label>Verification Code</label>
                <input
                    type="text"
                    name="code"
                    pattern="\d{4}" // Only allow 4 digits
                    maxLength={4}
                    placeholder={`Enter 4-digit code sent to ${email}`}
                    {...formik.getFieldProps("code")}
                />
                {formik.touched.code && formik.errors.code && (
                    <div className={styles.error}>{formik.errors.code}</div>
                )}
            </div>
            <div className={styles.resendContainer}>
                <p>Didn't receive the code?</p>
                <button
                    type="button"
                    onClick={handleResend}
                    disabled={loading}
                    className={styles.resendButton}
                >
                    {loading ? "Sending..." : "Resend Code"}
                </button>
            </div>
        </form>
    );
};

const ResetPasswordStep = ({ onSubmit, loading }) => {
    const formik = useFormik({
        initialValues: { newPassword: "", confirmPassword: "" },
        validationSchema: Yup.object({
            newPassword: Yup.string()
                .required("Password is required")
                .min(8, "Password must be at least 8 characters")
                .max(20, "Password must be at most 20 characters")
                .matches(
                    /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/,
                    "Must contain: 1 uppercase, 1 number, 1 special character"
                ),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
                .required("Confirm Password is required")
        }),
        onSubmit
    });

    return (
        <form onSubmit={formik.handleSubmit}>
            <div className={styles.inputGroup}>
                <label>New Password</label>
                <input
                    type="password"
                    name="newPassword"
                    placeholder="Enter new password"
                    {...formik.getFieldProps("newPassword")}
                />
                {formik.touched.newPassword && formik.errors.newPassword && (
                    <div className={styles.error}>{formik.errors.newPassword}</div>
                )}
            </div>

            <div className={styles.inputGroup}>
                <label>Confirm Password</label>
                <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm new password"
                    {...formik.getFieldProps("confirmPassword")}
                />
                {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                    <div className={styles.error}>{formik.errors.confirmPassword}</div>
                )}
            </div>

            <button type="submit" disabled={loading}>
                {loading ? "Resetting..." : "Reset Password"}
            </button>
        </form>
    );
};


