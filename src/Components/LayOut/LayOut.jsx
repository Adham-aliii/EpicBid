import React, { useContext, useEffect } from 'react';
import styles from './LayOut.module.css';
import Navbar from '../Navbar/Navbar';
import { Outlet, useNavigate } from 'react-router-dom';
import Footer from '../Footer/Footer';
import { UserContext } from '../../Context/UserContext';


export default function LayOut() {


    let { setUserData } = useContext(UserContext)
    let navigate = useNavigate();

    

    return <>
        <Navbar />

        <div className={styles.layout}>



            <Outlet></Outlet>
        </div>

        <Footer />
    </>

}


