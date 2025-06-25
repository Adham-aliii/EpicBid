import React from 'react';
import styles from './Loading.module.css';
import { FourSquare } from 'react-loading-indicators';


export default function Loading() {
    return <>
        <div className='flex justify-center items-center h-screen py-16'>
            <FourSquare color="#2d5356" size="medium" text="" textColor="#7e2424" />
        </div>

    </>

}


