import React, { useState } from 'react'
import '../../../css/LoginPage/LoginPage.css'
import davlogo from "../../../Resources/davlogo.png"
import otplogo from '../../../Resources/otpLogo.png'
import { useNavigate } from 'react-router-dom';
import {useDispatch} from 'react-redux'
import { setFid } from '../../../redux/reducers/fIdReducers';
export default function LoginPageMain() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    let otp = "";

    const checkUser = async () => {
        const adminverify = document.getElementsByClassName('adminvalue');
        const admin = adminverify[0].checked

        let res = await fetch(`http://localhost:4000/checkuser/${email}/${password}/${admin}`, {
            method: "GET",
        });
        res = await res.json();
        console.log(res);

        if (res.msg === "NewUser") {
            navigate('/userform')
        } else if (res.msg === "OldUser") {
            navigate('/userdashboard')
        } else if (res.msg === "Admin") {
            navigate('/admindashboard')
        } else {
            navigate('/')
        }

    }

    const verifyOtp = () => {
        let otpelements = document.getElementsByClassName('otpbox');
        let otpconcatvalue = 0;
        console.log(otpelements);

        for (let i = 0; i < otpelements.length; i++) {
            let ele = parseInt(otpelements[i].value)
            console.log(ele);
            otpconcatvalue = otpconcatvalue * 10 + ele;
        }
        console.log(otpconcatvalue);
        console.log(otp);

        if (otpconcatvalue === otp) {
            console.log("valid otp");
            checkUser();
        } else {
            console.log("invalid otp");
        }
    }

    const validateOtp = (e) => {
        // try {
        //     if (e.keyCode === 8) {
        //         if (e.target.value === "") {
        //             if (otpinputcounter > 0) {
        //                 --otpinputcounter;
        //                 otpelements[otpinputcounter].focus();
        //             }
        //         }
        //     } else if ((e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 96 && e.keyCode <= 105)) {
        //         if (otpinputcounter < 5) {
        //             ++otpinputcounter;
        //             otpelements[otpinputcounter].focus();
        //         }
        //     }
        // } catch (error) {
        // }
    }

    const randomNumber = (min, max) => {
        otp = Math.floor(Math.random() * (max - min) + min);
        console.log("Generated otp", otp);
        console.log("Generated otp type", typeof (otp));
        return otp;
    }

    const sendMail = async () => {
        // console.log("send email page");
        otp = randomNumber(100000, 999999);
        console.log("Send Mail", otp);

        let data = {
            otp: otp,
            email: email
        }
        let res = await fetch(`http://localhost:4000/sendmail`, {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                Accept: "application/json",
                "Content-type": "application/json",
            }
        });
        res = await res.json();
        console.log(res);
        if (res.msg === "EmailSentSuccessfully") {
            displayOtpPage();
        }
    }
    const resendOtp = () => {
        let otpelements = document.getElementsByClassName('otpbox');
        for (let i = 0; i < otpelements.length; i++) {
            otpelements[i].value = "";
        }
        sendMail();
    }
    const displayloginpage = () => {
        const logindiv = document.getElementsByClassName("loginpagemaincontainerrightdiv");
        const otppage = document.getElementsByClassName("loginpagemaincontainerrightdiv2");
        logindiv[0].style.display = "flex";
        otppage[0].style.display = "none";
        let otpelements = document.getElementsByClassName('otpbox');
        for (let i = 0; i < otpelements.length; i++) {
            otpelements[i].value = "";
        }

    }
    const displayOtpPage = () => {
        let logindiv = document.getElementsByClassName("loginpagemaincontainerrightdiv");
        let otppage = document.getElementsByClassName("loginpagemaincontainerrightdiv2");
        logindiv[0].style.display = "none";
        otppage[0].style.display = "flex";
        document.getElementsByClassName("");
    }
    const checkCredentials = async () => {
        console.log(email);
        console.log(password);
        const adminverify = document.getElementsByClassName('adminvalue');
        const admin = adminverify[0].checked
        console.log(admin);
        let res = await fetch(`http://localhost:4000/verifycredentials/${email}/${password}/${admin}`, {
            method: "GET",
        })
        res = await res.json();
        // console.log(res.fid);

        if (res.msg === "ValidUserandadmin") {
            dispatch(setFid(res.fid))
            sendMail();
            displayOtpPage();
            console.log("Valid User");
        } else {
            const elements = document.getElementsByClassName('logininput');
            const errorElements = document.getElementsByClassName('errormsg');
            errorElements[0].style.display = 'flex';
            elements[0].style.borderLeft = "5px solid red";
            errorElements[0].innerHTML = "Invalid User."
            errorElements[1].style.display = 'flex';
            elements[1].style.borderLeft = "5px solid red";
            errorElements[1].innerHTML = "Invalid Password ."
            console.log("Invalid User");
        }
    }

    const validateDetails = () => {
        let errorcount = 0;
        const elements = document.getElementsByClassName('logininput');
        const errorElements = document.getElementsByClassName('errormsg');
        // console.log(elements[0].value);
        if (elements[0].value === "") {
            errorcount++;
            errorElements[0].style.display = 'flex';
            elements[0].style.borderLeft = "5px solid red";
            errorElements[0].innerHTML = "This is required field!"
        } else if (!elements[0].value.includes("@") || !elements[0].value.includes(".com")) {
            errorcount++;
            errorElements[0].style.display = 'flex';
            elements[0].style.borderLeft = "5px solid red";
            errorElements[0].innerHTML = "Please ! Enter the valid Email ID."
        } else {
            errorElements[0].style.display = 'none';
            elements[0].style.borderLeft = "5px solid #0376d4";
        }

        if (elements[1].value === "") {
            errorcount++;
            errorElements[1].style.display = 'flex';
            elements[1].style.borderLeft = "5px solid red";
            errorElements[1].innerHTML = "This is required field!"
        } else {
            errorElements[1].style.display = 'none';
            elements[1].style.borderLeft = "5px solid #0376d4";
        }
        // console.log(errorcount);
        if (errorcount === 0) {
            checkCredentials();
        }
    }

    return (
        <>
            <div className="loginpagecontainer">
                <div className="loginpagemaincontainer">
                    <div className="loginpagemaincontainerleftdiv">
                        <img src={davlogo} alt='davlogo' className='logo'></img>
                        <label className='first'>Uttari Bharat Sabha's</label>
                        <label className='second'>Ramanand Arya Dav College</label>
                        <label className='third'>( Autonomous )</label>

                    </div>
                    <div className="loginpagemaincontainerrightdiv">
                        <label className='logintext'>Login</label>
                        <input type='email' className='logininput' onChange={(e) => setEmail(e.target.value)} placeholder='Email ID' />
                        <label className='errormsg'>errormsg</label>
                        <input type='password' className='logininput' onChange={(e) => setPassword(e.target.value)} placeholder='Password' />
                        <label className='errormsg'>errormsg</label>
                        <div className="admincontainer">
                            <label className='admintext'>Are you Admin ?</label>
                            <label className="switch"><input type="checkbox" className="adminvalue" /><span className="slider round"></span></label>
                        </div>
                        <button className='submitbtn' onClick={validateDetails}>Submit</button>
                    </div>
                    <div className="loginpagemaincontainerrightdiv2">
                        <div className="loginpagemaincontainerbackbtn">
                            <label className='backbtn' onClick={displayloginpage}><span className='backarrow'>&#8617;</span>Back to Login</label>
                        </div>
                        <div className="loginpagemaincontainerotpdiv">
                            <label className='otpheader'>Verification</label>
                            <label className='otpdescription'>Enter the six digit OTP code sent to </label>
                            <label className='otpdescription useremail'>{email}</label>
                            <img src={otplogo} alt='otplogo' className='otpimage'></img>
                            <div className="otpinput">
                                <input type='text' className='otpbox' maxLength={1} onKeyUp={(e) => { validateOtp(e) }} />
                                <input type='text' className='otpbox' maxLength={1} onKeyUp={(e) => { validateOtp(e) }} />
                                <input type='text' className='otpbox' maxLength={1} onKeyUp={(e) => { validateOtp(e) }} />
                                <input type='text' className='otpbox' maxLength={1} onKeyUp={(e) => { validateOtp(e) }} />
                                <input type='text' className='otpbox' maxLength={1} onKeyUp={(e) => { validateOtp(e) }} />
                                <input type='text' className='otpbox' maxLength={1} onKeyUp={(e) => { validateOtp(e) }} />
                            </div>
                            <label className='otpresend'>Didn't receive OTP code ? <a href='#' className='resendcode' onClick={resendOtp}>Resend code</a> </label>
                            <button className='otpsubmitbtn' onClick={verifyOtp}>Verify & Proceed</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
