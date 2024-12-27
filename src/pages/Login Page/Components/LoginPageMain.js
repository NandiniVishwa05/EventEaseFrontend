import React, { useEffect, useState } from 'react'
import '../../../css/LoginPage/LoginPage.css'
import davlogo from "../../../Resources/davlogo.png"
import otplogo from '../../../Resources/otpLogo.png'
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux'
import { setFid, setToken } from '../../../redux/reducers/fIdReducers';
import { ToastContainer, toast } from 'react-toastify';

export default function LoginPageMain() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [sendemail, setSendEmail] = useState('');
    let [generatedOtp, setGeneratedOtp] = useState('')
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
            toast.error("Invalid OTP")
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
            toast.success("Email sent Successfully !")
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
            credentials: 'include'
        })
        res = await res.json();

        if (res.msg === "ValidUserandadmin") {
            dispatch(setFid(res.fid))
            sendMail();
            displayOtpPage();
            console.log("Valid User");
        } else {
            const elements = document.getElementsByClassName('logininput');
            elements[0].style.borderLeft = "5px solid red";
            elements[1].style.borderLeft = "5px solid red";
            console.log("Invalid User");
            toast.error("Invalid Credentials!")
        }
    }

    const validateDetails = () => {
        let errorcount = 0;
        const elements = document.getElementsByClassName('logininput');
        if (elements[0].value === "") {
            errorcount++;
            elements[0].style.borderLeft = "5px solid red";
            toast.error("This is required field !");
        } else if (!elements[0].value.includes("@") || !elements[0].value.includes(".com")) {
            errorcount++;
            // errorElements[0].style.display = 'flex';
            elements[0].style.borderLeft = "5px solid red";
            toast.error("Please! Enter valid Email ID");
            // errorElements[0].innerHTML = "Please ! Enter the valid Email ID."
        } else {
            // errorElements[0].style.display = 'none';
            elements[0].style.borderLeft = "5px solid #0376d4";
        }

        if (elements[1].value === "") {
            errorcount++;
            // errorElements[1].style.display = 'flex';
            elements[1].style.borderLeft = "5px solid red";
            toast.error("This is required field !");
            // errorElements[1].innerHTML = "This is required field!"
        } else {
            // errorElements[1].style.display = 'none';
            elements[1].style.borderLeft = "5px solid #0376d4";
        }
        // console.log(errorcount);
        if (errorcount === 0) {
            checkCredentials();
        }
    }
    const enableverifyemaildiv = () => {
        let elements = document.getElementsByClassName('loginpagemaincontainerrightdiv');
        let element2 = document.getElementsByClassName('loginpagemaincontainerforgotpassworddiv')
        let element3 = document.getElementsByClassName('forgotpasswordinput')
        document.getElementsByClassName('forgotpasswordotpinput')[0].style.display = "none"
        document.getElementsByClassName('verifyotpbtn')[0].style.display = "none"
        document.getElementsByClassName('sendotpbtn')[0].style.display = "block"

        element3[0].value = ""
        element3[0].disabled = false
        element3[1].value = ""
        elements[0].style.display = "none";
        element2[0].style.display = "flex";
    }
    const disableforgotpasswordpage = () => {
        let element2 = document.getElementsByClassName('loginpagemaincontainerrightdiv');
        let elements = document.getElementsByClassName('loginpagemaincontainerforgotpassworddiv')
        elements[0].style.display = "none";
        element2[0].style.display = "flex";

    }
    const validateforgotpasswordemail = () => {
        console.log("hhh");
        let elements = document.getElementsByClassName('forgotpasswordinput');
        let err = 0;
        if (elements[0].value === "") {
            // console.log("This is required field !");
            elements[0].style.borderLeft = "5px solid red";
            toast.error("This is required field !");
            err++;
        } else if (!elements[0].value.includes(".com") || !elements[0].value.includes("@")) {
            // console.log("invalid email");
            elements[0].style.borderLeft = "5px solid red";
            toast.error("Invalid Email ID!")
            err++;
            return;
        }
        if (err === 0) {
            elements[0].style.borderLeft = "";
            checkValidEmail();
        }

    }
    const checkValidEmail = async () => {
        let checkedemail = document.getElementsByClassName('forgotpasswordinput')[0].value;
        console.log(checkedemail);
        try {

            let res = await fetch(`http://localhost:4000/checkValidEmail/${checkedemail}`, {
                method: "GET",
            });
            res = await res.json();
            console.log(res[0].femail);
            if (res.msg === "UserNotExist") {
                console.log("Invalid Email");
                toast.error("Invalid Email");

            } else {
                setSendEmail(res[0].femail);
                sendForgotEmail();
            }
        } catch (error) {
            toast.error("Invalid Email");
            // console.log("This is admin user trying to vhange the pssword");
        }
    }
    // let generatedOtp =0;
    const sendForgotEmail = async () => {
        let email = document.getElementsByClassName('forgotpasswordinput')[0].value;
        let otp = randomNumber(100000, 999999);
        setGeneratedOtp(otp);
        console.log("Send Mail", otp);

        let data = {
            otp: otp,
            email: email
        }
        console.log(data);

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
            toast.success("Email sent successfully!")
            enableOtpDiv();
        }
    }
    const enableOtpDiv = () => {
        let email = document.getElementsByClassName('forgotpasswordinput')[0].value;
        document.getElementsByClassName('forgotpasswordinput')[0].disabled = true;
        document.getElementsByClassName('verifyotpbtn')[0].style.display = "block";
        document.getElementsByClassName('sendotpbtn')[0].style.display = "none";
        document.getElementsByClassName('forgotpassworddesc')[0].innerHTML = "OTP has been sent to " + email;
        document.getElementsByClassName('otpdiv')[0].style.display = "flex";
        let element = document.getElementsByClassName('forgotpassworddesc')[0].style.display = "flex";
        document.getElementsByClassName('forgotpasswordotpresendlabel')[0].style.display = "flex";
    }
    const resendForgotEmailOtp = () => {
        document.getElementsByClassName('otpinput')[1].value = "";
        sendForgotEmail();
    }
    const checkforgotpasswordotp = () => {
        let enteredotp = parseInt(document.getElementsByClassName("otpinput")[1].value);
        let element = document.getElementsByClassName('otpinput');
        let element2 = document.getElementsByClassName('setpasswordinput');
        element2[0].value = "";
        element2[1].value = "";
        console.log(enteredotp + "   " + generatedOtp);

        if (generatedOtp === enteredotp) {
            document.getElementsByClassName('setpasswordcontainer')[0].style.display = "flex";
            document.getElementsByClassName('loginpagemaincontainerforgotpassworddiv')[0].style.display = "none";
            // element[1].value=="";
            console.log("true");
        } else {
            console.log("Incorrect Otp");
            toast.error(" Incorrect OTP");
        }
    }
    const validatenewpassword = () => {
        let element = document.getElementsByClassName('setpasswordinput');
        let errorcount = 0;
        console.log(element[0].value.length);
        if (element[0].value === "" || element[1].value === "") {
            console.log("Enter new password");
            element[0].style.borderLeft = "5px solid red";
            element[1].style.borderLeft = "5px solid red";
            toast.error("This is required field  !");
            errorcount++;
        } else if (element[0].value.length < 8 || element[1].value.length < 8) {
            console.log("Set password with maximum length 8 ");
            element[0].style.borderLeft = "5px solid red";
            element[1].style.borderLeft = "5px solid red";
            toast.error("Password length should be 8.");
            errorcount++
        }
        if (element[0].value !== element[1].value) {
            console.log("Password are not same");
            element[0].style.borderLeft = "5px solid red";
            element[1].style.borderLeft = "5px solid red";
            toast.error("Please! Enter same password.")
            errorcount++;
        }
        if (errorcount === 0 && (element[0].value === element[1].value)) {
            console.log("insert same passs");
            element[1].style.borderLeft = "";
            element[0].style.borderLeft = "";
            insertNewPassword();
        }

    }
    const insertNewPassword = async () => {
        let elements = document.getElementsByClassName('setpasswordinput');
        let element = document.getElementsByClassName('setpasswordinput')[1].value;
        let data = {
            password: element,
            email: sendemail
        }
        let res = await fetch(`http://localhost:4000/insertNewPassword`, {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                Accept: "application/json",
                "Content-type": "application/json",
            }
        });
        res = await res.json();
        console.log(res);
        if (res.msg === "Password Updated") {
            console.log("password updated");
            toast.success("Password updated successfully!")
            elements[0].disabled = true;
            elements[1].disabled = true;
            window.location.reload();
        }

    }
    const disablesetpasswordpage = () => {
        let element2 = document.getElementsByClassName('loginpagemaincontainerrightdiv');
        let elements = document.getElementsByClassName('setpasswordcontainer')
        elements[0].style.display = "none";
        element2[0].style.display = "flex";
    }
    return (
        <>
            <div className="loginpagecontainer">
                <div className='toastmessagediv'>
                    <ToastContainer />
                </div>
                <div className="loginpagemaincontainer">
                    <div className="loginpagemaincontainerleftdiv">
                        <img src={davlogo} alt='davlogo' className='logo'></img>
                        <label className='first'>Uttari Bharat Sabha's</label>
                        <label className='second'>Ramanand Arya Dav College</label>
                        <label className='third'>( Autonomous )</label>
                    </div>
                    <div className="loginpagemaincontainerrightdiv">
                        <div className="loginpagemaincontainerrightdivitems">
                            <label className='logintext'>Login</label>
                        </div>
                        <div className="loginpagemaincontainerrightdivitems">
                            <input type='email' className='logininput' onChange={(e) => setEmail(e.target.value)} placeholder='Email ID' />
                        </div>

                        <div className="loginpagemaincontainerrightdivitems">
                            <input type='password' className='logininput' onChange={(e) => setPassword(e.target.value)} placeholder='Password' />
                        </div>
                        <div className="adminselectdiv">
                            <label className='admintext'>Are you Admin ?</label>
                            <label className="switch"><input type="checkbox" className="adminvalue" /><span className="slider round"></span></label>
                        </div>
                        <div className="loginpagemaincontainerrightdivitems">
                            <button className='submitbtn' onClick={validateDetails}>Submit</button>
                        </div>
                        <div className="loginpagemaincontainerrightdivitems">
                            <label className='forgotpassword' onClick={enableverifyemaildiv}>Forgot Password  ?</label>
                        </div>
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
                                <input type="text" name="otp" className='otpbox' maxLength={6} />
                            </div>
                            <label className='otpresend'>Didn't receive OTP code ? <a href='#' className='resendcode' onClick={resendOtp}>Resend code</a> </label>
                            <button className='otpsubmitbtn' onClick={verifyOtp}>Verify & Proceed</button>
                        </div>
                    </div>
                    <div className="loginpagemaincontainerforgotpassworddiv">
                        <div className="forgotpasswordheaderdiv">
                            <label className='forgotpasswordheader'>Forgot Password ?</label>
                            <p className='forgotpassworddesc'>OTP has been sent to username@gmail.com </p>
                        </div>
                        <div className="forgotpasswordemailinput">
                            <label className='forgotpasswordinputlabel'>Email ID</label>
                            <input type='email' className='forgotpasswordinput' placeholder='username@gmail.com' />

                        </div>
                        <div className="forgotpasswordotpinput otpdiv">
                            <label className='forgotpasswordinputlabel'>OTP</label>
                            <input type="text" name="" className='forgotpasswordinput otpinput' placeholder='XXXXXX' />
                        </div>
                        <div className="forgotpasswordinputbtndiv">
                            <button className='forgotpasswordinputbtn verifyotpbtn' onClick={checkforgotpasswordotp}>Verify OTP</button>
                            <button className='forgotpasswordinputbtn sendotpbtn' onClick={validateforgotpasswordemail}>Send OTP</button>
                        </div>
                        <label className='forgotpasswordotpresendlabel'>Didn't receive OTP code ? <a href='#' className='resendcode' onClick={resendForgotEmailOtp}>Resend code</a> </label>
                        <div className="forgotpasswordbackbtndiv">
                            <label className='forgotpasswordbackbtn' onClick={disableforgotpasswordpage}><span className='forgotpasswordbackarrow'>&#8617;</span>Back to Login</label>
                        </div>

                    </div>
                    <div className="setpasswordcontainer">
                        <div className="setpasswordheader">
                            <label className='setpasswordheaderlabel'>Set Password</label>
                        </div>
                        <div className="setpasswordbody">
                            <div className="setpasswordinputdiv1">
                                <label className='setpasswordinputlabel'>New Password</label>
                                <input type="password" name="" className='setpasswordinput' placeholder='Enter password' />
                            </div>
                            <div className="setpasswordinputdiv2">
                                <label className='setpasswordinputlabel'>Confirm Password</label>
                                <input type="password" name="" className='setpasswordinput' placeholder='Enter password' />
                            </div>
                        </div>
                        <div className="setpasswordsubmitbtn">
                            <button className='setpasswordinputbtn' onClick={validatenewpassword}>Submit</button>
                        </div>
                        <div className="setpasswordbackbtn">
                            <label className='setpasswordbackbtn' onClick={disablesetpasswordpage}><span className='setpasswordbackarrow'>&#8617;</span>Back to Login</label>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
