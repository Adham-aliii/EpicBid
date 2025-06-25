import React from 'react';
import styles from './Header.module.css';


export default function Header() {
    return <>
        <h3 className='text-3xl'>Header</h3>
        {/* <div className="flex items-center justify-between px-[120px] py-2 relative bg-gold">
            <div className="justify-center gap-[25px] inline-flex items-center relative flex-[0_0_auto]">
                <div className="relative w-fit [font-family:'Inter',Helvetica] font-normal text-white text-lg tracking-[0] leading-[normal]">
                    Follow Us
                </div>

                <div className="gap-1 inline-flex items-center relative flex-[0_0_auto]">
                    <div className="relative w-8 h-8 bg-[#ffffff33] rounded-[22px] overflow-hidden">
                        <i className='fab fa-facebook'></i>
                    </div>

                    <div className="relative w-8 h-8 bg-[#ffffff33] rounded-[22px] overflow-hidden">
                        <i><i className='fab fa-instagram'></i></i>
                    </div>

                    <div className="relative w-8 h-8 bg-[#ffffff33] rounded-[22px] overflow-hidden">
                        <i className='fab fa-twitter'></i>
                    </div>
                </div>
            </div>

            <p className="relative w-fit [font-family:'Inter',Helvetica] font-normal text-white text-lg tracking-[0] leading-[normal]">
                sign up get 20% Off for all collection
            </p>

            <div className="justify-center gap-1 inline-flex items-center relative flex-[0_0_auto]">
                <i><i className='fas fa-phone-alt'></i></i>
                <div className="relative w-fit [font-family:'Inter',Helvetica] font-normal text-white text-lg tracking-[0] leading-[normal]">
                    1(+01)224585624
                </div>
            </div>
        </div> */}
        <div className="frame">
            <div className="div">
                <div className="text-wrapper">Follow Us</div>
                <div className="div-2">
                    <i className='fab fa-facebook'></i>
                    <i className='fab fa-instagram'></i>
                    <i className='fab fa-twitter'></i>
                </div>
            </div>
            <p className="text-wrapper">sign up get 20% Off for all collection</p>
            <div className="div-3">
                <i className='fas fa-phone-alt'></i>
                <div className="text-wrapper">1(+01)224585624</div>
            </div>
        </div>


    </>

}


