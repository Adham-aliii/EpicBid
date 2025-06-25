import React, { useContext, useEffect, useState } from "react";
import styles from "./SignUp.module.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";
import Profile from "../Profile/Profile";
import { UserContext } from "../../Context/UserContext";

export default function SignUp() {
    const [apiError, setApiError] = useState(null);
    const [loading, setLoading] = useState(false);

    let { setUserData } = useContext(UserContext)

    let navigate = useNavigate();


    let validationSchema = Yup.object().shape({
        displayName: Yup.string().required("Name is required").min(3, "Name must be at least 3 characters").max(20, "Name must be at most 20 characters"),
        userName: Yup.string()
            .required("Username is required")
            .min(3, "Username must be at least 3 characters"),
        email: Yup.string().required("Email is required").email("Invalid email address"),
        password: Yup.string()
            .required("Password is required")
            .min(8, "Password must be at least 8 characters")
            .max(20, "Password must be at most 20 characters")
            .matches(
                /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/,
                "Password must contain: 1 uppercase, 1 number, 1 special character"
            ),
        phone: Yup.string()
            .required("Phone number is required")
            .matches(
                /^01[0125][0-9]{8}$/,
                "Egyptian Phone Number (e.g. 01xxxxxxxxx)"
            ),
    })


    async function register(values) {

        /////////////////////////////////// Call API
        console.log(values);

        try {
            setLoading(true);
            let { data } = await axios.post('http://ebic-bid11.runasp.net/api/Account/register', values, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                timeout: 10000 // 10-second timeout
            });
            console.log(data);
            localStorage.setItem("userToken", data.token);
            navigate("/home");
            setUserData(data.token);
        } catch (err) {          //catching Error
            console.log('Full error response:', err.response?.data);
            if (err.response?.data?.message?.includes("Email")) {
                setApiError("This email is already registered");
            } else {
                setApiError("Registration failed. Please check your details");
            }
            setLoading(false);
        }
    }
    // State to manage form data
    let formik = useFormik({
        initialValues: {
            displayName: "",
            userName: "",
            email: "",
            password: "",
            phone: ""
        }, validationSchema: validationSchema
        , onSubmit: register
    })



    return (
        <main className={styles["login-container"]}>

            <Profile headerText="Sign Up" />

            {/* Form Section */}
            <section className={styles["form-section"]}>
                <header>
                    <h1 className={styles["form-title"]}>Sign Up</h1>
                    <p className={styles["form-subtitle"]}>You Can Sign Up Epic Bid Here</p>
                </header>

                {apiError && <div className="p-4 mb-4 py-2 text-sm text-yellow-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
                    <span className="font-medium">{apiError}</span>
                </div>}



                <form onSubmit={formik.handleSubmit} className={styles["form"]}>
                    {/* name Input */}
                    <div className={styles["input-field"]}>
                        <div className={styles["input-wrapper"]}>
                            <input
                                onBlur={formik.handleBlur}
                                type="text"
                                id="displayName"
                                name="displayName"  // Changed from "name"
                                value={formik.values.displayName}
                                onChange={formik.handleChange}
                                className={styles["input"]}
                                placeholder="Enter your display name"
                            />
                            <i className={`fa-solid fa-user ${styles["input-icon"]}`}></i>
                        </div>
                    </div>
                    {formik.errors.displayName && formik.touched.displayName && <div className={styles["error-alert"]} role="alert">
                        <span className="font-medium">{formik.errors.displayName}</span>
                    </div>}

                    {/* Add Missing userName Field */}
                    <div className={styles["input-field"]}>
                        <div className={styles["input-wrapper"]}>
                            <input
                                onBlur={formik.handleBlur}
                                type="email"
                                id="userName"
                                name="userName"
                                value={formik.values.userName}
                                onChange={formik.handleChange}
                                className={styles["input"]}
                                placeholder="Enter your username (email)"
                            />
                            <i className={`fa-solid fa-at ${styles["input-icon"]}`}></i>
                        </div>
                    </div>
                    {formik.errors.userName && formik.touched.userName && <div className={styles["error-alert"]} role="alert">
                        <span className="font-medium">{formik.errors.userName}</span>
                    </div>}


                    {/* email Input */}
                    <div className={styles["input-field"]}>
                        <div className={styles["input-wrapper"]}>
                            <input
                                onBlur={formik.handleBlur}
                                type="email"
                                id="email"
                                name="email"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                className={styles["input"]}
                                placeholder="Enter your email"
                            />
                            <i className={`fa-solid fa-envelope ${styles["input-icon"]}`}></i>
                        </div>
                    </div>
                    {formik.errors.email && formik.touched.email && <div className={styles["error-alert"]} role="alert">
                        <span className="font-medium">{formik.errors.email}</span>
                    </div>}

                    {/* password Input */}
                    <div className={styles["input-field"]}>
                        <div className={styles["input-wrapper"]}>
                            <input
                                onBlur={formik.handleBlur}
                                type="password"
                                id="password"
                                name="password"
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                className={styles["input"]}
                                placeholder="Enter your password"
                            />
                            <i className={`fa-solid fa-lock ${styles["input-icon"]}`}></i>
                        </div>
                    </div>
                    {formik.errors.password && formik.touched.password && <div className={styles["error-alert"]} role="alert">
                        <span className="font-medium">{formik.errors.password}</span>
                    </div>}

                    {/* Phone Input */}
                    <div className={styles["input-field"]}>
                        <div className={styles["input-wrapper"]}>
                            <input
                                onBlur={formik.handleBlur}
                                type="tel"
                                id="phone"
                                name="phone"
                                value={formik.values.phone}
                                onChange={(e) => {
                                    // Ensure number starts with 01 and has exactly 11 digits
                                    let value = e.target.value.replace(/[^0-9]/g, '');
                                    if (value.length > 11) value = value.slice(0, 11);
                                    if (!value.startsWith('01')) value = '01' + value.slice(2);
                                    formik.setFieldValue('phone', value);
                                }}
                                className={styles["input"]}
                                placeholder="Enter your phone number"
                                pattern="01[0125][0-9]{8}"
                            />
                            <i className={`fa-solid fa-phone ${styles["input-icon"]}`}></i>
                        </div>
                    </div>
                    {formik.errors.phone && formik.touched.phone && <div className={styles["error-alert"]} role="alert">
                        <span className="font-medium">{formik.errors.phone}</span>
                    </div>}

                    {/* Remember Me Checkbox */}
                    {/* <div className={styles["checkbox-container"]}>
                        <label htmlFor="rememberMe" className={styles["checkbox-label"]}>
                            Remember Me
                        </label>
                        <button
                            type="button"
                            className={`${styles["custom-checkbox"]} ${formData.rememberMe ? styles["checked"] : ""
                                }`}
                            onClick={() => handleInputChange("rememberMe", !formData.rememberMe)}
                            role="checkbox"
                            aria-checked={formData.rememberMe}
                            id="rememberMe"
                        >
                            {formData.rememberMe && <span className={styles["checkbox-tick"]}>✓</span>}
                        </button>
                    </div> */}

                    
                    {!loading ? <button type="submit" className={styles["login-button"]}>
                        Submit
                    </button> : <button type="submit" className={styles["login-button"]}>
                        <i className="fas fa-spinner fa-spin-pulse "></i>
                    </button>}

                </form>
            </section>

            {/* Sidebar Section */}
            <aside className={styles["sidebar-container"]}>
                <div className={styles["sidebar-content"]}>
                    <img
                        src="https://cdn.builder.io/api/v1/image/assets/TEMP/6ed99270797e08e0e2a1afe9778936fbe585b56e?placeholderIfAbsent=true&apiKey=2a718d7df90e4b65886e83d9868fee3e"
                        alt="Background decoration"
                        className={styles["sidebar-image"]}
                    />
                    <div className={styles['contentt']}>
                        <div className={styles["sidebar-text"]}>
                            <h2 className={styles["sidebar-title"]}>Already Have An Account</h2>
                        </div>
                        <NavLink to="/login" className={styles["signup-button"]}>
                            Log In
                        </NavLink>
                    </div>
                </div>
            </aside>
        </main>
    );
}