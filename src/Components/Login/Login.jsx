import React, { useContext, useState } from 'react';
import styles from './login.module.css';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { NavLink, useNavigate } from 'react-router-dom';
import Profile from '../Profile/Profile.jsx';
import { UserContext } from '../../Context/UserContext.jsx';

export default function Login() {
    const [apiError, setApiError] = useState(null);
    const [loading, setLoading] = useState(false);

    const { setUserData } = useContext(UserContext);
    const navigate = useNavigate();

    const validationSchema = Yup.object().shape({
        email: Yup.string().required('Email is required').email('Invalid email address'),
        password: Yup.string()
            .required('Password is required')
            .min(8, 'Password must be at least 8 characters')
            .max(20, 'Password must be at most 20 characters')
            .matches(
                /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/,
                'Password must contain: 1 uppercase, 1 number, 1 special character'
            ),
    });

    async function handleSubmit(values) {
        try {
            setLoading(true);
            const { data } = await axios.post(
                'http://ebic-bid11.runasp.net/api/Account/login',
                values,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    },
                    timeout: 10000,
                }
            );

            localStorage.setItem('userToken', data.token);
            setUserData({ isLoggedIn: true, token: data.token });
            navigate('/');
        } catch (err) {
            console.log('Full error response:', err.response?.data);
            if (err.response?.data?.message?.includes('Email')) {
                setApiError('This email is already registered');
            } else {
                setApiError('Login failed. Please check your details');
            }
            setLoading(false);
        }
    }

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema,
        onSubmit: handleSubmit,
    });

    return (
        <main className={styles['login-container']}>
            <Profile headerText="Login" />
            <section className={styles['form-section']}>
                <header>
                    <h1 className={styles['form-title']}>Welcome Back</h1>
                    <p className={styles['form-subtitle']}>Login to Your Epic Bid Account</p>
                </header>
                {apiError && (
                    <div className={styles['error-alert']} role="alert">
                        <span className="font-medium">{apiError}</span>
                    </div>
                )}
                <form onSubmit={formik.handleSubmit} className={styles['form']}>
                    <div className={styles['input-field']}>
                        <div className={styles['input-wrapper']}>
                            <input
                                onBlur={formik.handleBlur}
                                type="email"
                                id="email"
                                name="email"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                className={styles['input']}
                                placeholder="Enter your email"
                            />
                            <i className={`fa-solid fa-envelope ${styles['input-icon']}`}></i>
                        </div>
                    </div>
                    {formik.errors.email && formik.touched.email && (
                        <div className={styles['error-alert']} role="alert">
                            <span className="font-medium">{formik.errors.email}</span>
                        </div>
                    )}
                    <div className={styles['input-field']}>
                        <div className={styles['input-wrapper']}>
                            <input
                                onBlur={formik.handleBlur}
                                type="password"
                                id="password"
                                name="password"
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                className={styles['input']}
                                placeholder="Enter your password"
                            />
                            <i className={`fa-solid fa-lock ${styles['input-icon']}`}></i>
                        </div>
                    </div>
                    {formik.errors.password && formik.touched.password && (
                        <div className={styles['error-alert']} role="alert">
                            <span className="font-medium">{formik.errors.password}</span>
                        </div>
                    )}
                    <div className={styles.loginOptions}>
                        <div className={styles.rememberMe}>
                            <label className={styles.checkboxLabel}>
                                <input type="checkbox" className={styles.checkbox} />
                                <span className={styles.checkmark}></span>
                                Remember Me
                            </label>
                        </div>
                        <NavLink to="/forgetpassword" className={styles.forgetPassword}>
                            Forget Password?
                        </NavLink>
                    </div>
                    <button
                        type="submit"
                        className={styles.submitButton}
                        disabled={loading}
                    >
                        {loading ? (
                            <i className={`fas fa-spinner ${styles.spinner}`}></i>
                        ) : (
                            'Login'
                        )}
                    </button>
                </form>
            </section>
            <aside className={styles['sidebar-login-container']}>
                <div className={styles['sidebar-content']}>
                    <img
                        src="https://cdn.builder.io/api/v1/image/assets/TEMP/6ed99270797e08e0e2a1afe9778936fbe585b56e?placeholderIfAbsent=true&apiKey=2a718d7df90e4b65886e83d9868fee3e"
                        alt="Background decoration"
                        className={styles['sidebar-image']}
                    />
                    <div className={styles['contentt']}>
                        <div className={styles['sidebar-text']}>
                            <h2 className={styles['sidebar-title']}>New to Epic Bid?</h2>
                        </div>
                        <button type="button" className={styles['login-button']}>
                            <NavLink to="/signup" className={styles['nav-link']}>
                                Create Account
                            </NavLink>
                        </button>
                    </div>
                </div>
            </aside>
        </main>
    );
}