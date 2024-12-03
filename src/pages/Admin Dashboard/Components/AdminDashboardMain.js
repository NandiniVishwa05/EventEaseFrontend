import React, { useEffect, useState } from 'react'
import '../../../css/AdminDashboard/AdminDashboard.css'
import '../../../css/AdminDashboard/ManageUser.css'
import davlogo from '../../../Resources/davlogo.png';
import profilelogo from '../../../Resources/Profile.jpg'
import { CiLogout } from "react-icons/ci";
import { useNavigate } from 'react-router-dom';

export default function AdminDashboardMain() {
    const navigate = useNavigate();
    const [adminDashboardData, setAdminDashboardData] = useState([]);
    const [userData, setUserData] = useState([]);
    const [pdfData, setPdfdata] = useState([]);
    // const fid = useSelector((state) => state.fIdReducers.fid);
    const addUserCredentials = async () => {
        let element = document.getElementsByClassName('adduserlabel');
        console.log(element[0].value);
        let data = {
            fname: element[0].value,
            fpassword: element[1].value,
            femail_ID: element[2].value,
        }
        let res = await fetch(`http://localhost:4000/addusercredentials`, {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                Accept: "application/json",
                "Content-type": "application/json",
            },
        });

        res = await res.json();
        console.log(res);
        if (res.msg === "Added successfully") {
            fetchUserCredentialsData();
        }
    }

    const deleteUserCredentials = async (index) => {
        console.log(userData[index].fid);

        let data = {
            fid: userData[index].fid
        }
        let res = await fetch(`http://localhost:4000/deleteusercredentials`, {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                Accept: "application/json",
                "Content-type": "application/json",
            },
        });

        res = await res.json();
        console.log(res);
        if (res.msg === "Deleted Successfully") {
            fetchUserCredentialsData();
            fetchAdminDashboardData();
        }
    }

    const validateuserlabel = () => {
        let element = document.getElementsByClassName('adduserlabel');
        let errorlabel = document.getElementsByClassName('addusererrorlabel');
        console.log(element);
        let errorcount = 0;
        for (var i = 0; i < element.length; i++) {
            if (element[i].value === "") {
                errorcount++;
                errorlabel[i].innerHTML = "This is required field"
                // errorlabel.style.display="flex";
            } else if (!element[2].value.includes("@") || !element[2].value.includes(".com")) {
                errorlabel[0].innerHTML = "";
                errorlabel[1].innerHTML = "";
                errorcount++;
                errorlabel[2].innerHTML = "Invalid input"
            } else {
                errorlabel[i].innerHTML = "";
            }
        }


        if (errorcount === 0) {
            addUserCredentials();
        }
    }
    const fetchAdminDashboardData = async () => {
        let res = await fetch(`http://localhost:4000/fetchadmindashboardactivitydata`, {
            method: "GET"
        })
        res = await res.json();
        console.log(res.data);
        setAdminDashboardData(res.data);
        console.log(userData);

    }
    const fetchUserCredentialsData = async () => {
        let res = await fetch(`http://localhost:4000/fetchusercredentials`, {
            method: "GET"
        })
        res = await res.json();
        console.log(res);
        setUserData(res.data);
        console.log(adminDashboardData);
    }

    const displaylogoutsection = () => {
        let element = document.getElementsByClassName('adminlogoutsection');
        element[0].style.display = "flex";
    }

    const hidelogoutsection = () => {
        let element = document.getElementsByClassName('adminlogoutsection');
        element[0].style.display = "none";
    }

    const displayAdminUserForm = () => {
        let element = document.getElementsByClassName('manageuserdiv');
        element[0].style.display = "flex";
        let elements = document.getElementsByClassName('adminoverlay');
        elements[0].style.display = "flex";

    }

    const exitadminuserform = () => {
        let element = document.getElementsByClassName('manageuserdiv');
        element[0].style.display = "none";
        let elements = document.getElementsByClassName('adminoverlay');
        elements[0].style.display = "none";
    }
    // const exitloginsection = () => {
    //     let element = document.getElementsByClassName('adminlogoutsection');
    //     element[0].style.display = "none";
    // }

    const exitDashboard = () => {
        navigate("/");
    }

    const downloadactivitypdf = async (aid) => {
        try {
            let res = await fetch(`http://localhost:4000/downloadactivitypdf/${aid}`, {
                method: "GET"
            });

            res = await res.blob();
            console.log(res);
            const url = window.URL.createObjectURL(res);
            const a = document.createElement("a");
            a.href = url;
            a.download = "user_document.pdf";
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            console.log(res);

        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        fetchAdminDashboardData();
        fetchUserCredentialsData();
    }, []);
    return (
        <>
            <div className="admindashboardcontainer">
                <div className="admindashboardcontainerdiv1">
                    <div className="admindashboardcontainerleftdiv">
                        <img src={davlogo} alt='davlogo' className='davlogo' />
                        <div className="collegenamediv">
                            <label className='first'>Uttari Bharat Sabha's</label>
                            <label className='second'>Ramanand Arya Dav College</label>
                            <label className='third'>( Autonomous )</label>
                        </div>
                    </div>
                    <div className="admindashboardcontainerrightdiv">
                        <button className='user' onClick={displayAdminUserForm}>User</button>
                        <div className="adminprofile">
                            <img src={profilelogo} className='profilelogo' alt='profilelogo' onMouseEnter={displaylogoutsection} onClick={displaylogoutsection} />
                            <label className='adminname'>Admin</label>
                        </div>
                    </div>
                </div>
                <div className="admindashboardcontainerdiv2">
                    filter
                </div>
                <div className="admindashboardcontainerdiv3">
                    <table>
                        <tr> <th>Sr no</th> <th>Faculty Name</th> <th>Activity Name</th> <th>Department</th> <th>Academic Year</th> <th>Activity Date</th>  <th>Uploaded File</th></tr>
                        {adminDashboardData.map((item, index) => (
                            <>
                                <tr>
                                    <td>{index + 1}</td>
                                    <td>{item.fname}</td>
                                    <td>{item.aname}</td>
                                    <td>{item.fdepartment}</td>
                                    <td>{item.aacademic_year}</td>
                                    <td>{item.adate.substr(0, 10)}</td>
                                    <td><a href={`http://localhost:4000/downloadactivitypdf/${item.aid}`}>Download</a></td>
                                </tr>
                            </>
                        ))}

                    </table>
                </div>
                <div className="adminlogoutsection">
                    <div onClick={hidelogoutsection} >

                    <label className='adminlogoutexitbtn'  >x</label><br />
                    </div>
                    <img src={profilelogo} alt='profilephoto' className='adminlogoutprofilephoto' />
                    <label className='adminlogoutname'>Admin</label>
                    <button className='adminlogoutbtn' onClick={exitDashboard}><CiLogout /> <b>Logout</b></button>
                </div>
                <div className="adminoverlay">
                </div>
                <div className="manageuserdiv">
                    <div className="manageusermaincontainer">
                        <label className='exitadminuserform' onClick={exitadminuserform}>x</label>
                        <label className='manageuserheader'>User Management</label>
                        <div className="adduserbar">
                            <div className="adduserformfield">
                                <label ><span className='adduserlabelname'>Enter Faculty Name : </span><input type='text' className='adduserlabel' /></label>
                                <label className='addusererrorlabel'></label>
                            </div>
                            <div className="adduserformfield">
                                <label ><span className='adduserlabelname'>Enter Password: </span><input type='password' className='adduserlabel' /></label>
                                <label className='addusererrorlabel'></label>
                            </div>
                            <div className="adduserformfield">
                                <label ><span className='adduserlabelname'>Enter Email ID : </span><input type='text' className='adduserlabel' /></label>
                                <label className='addusererrorlabel'></label>
                            </div>
                            <div className="adduserbtndiv">
                                <button className='adduserbtn' onClick={validateuserlabel}>Add User</button>
                            </div>
                        </div>
                        <div className="searchbardiv">
                            <label className='searchlabelname'>Search : </label>
                            <input type='text' className='searchbar' />
                        </div>
                        <div className="usertablediv">
                            <table>
                                <tr>
                                    <th>Sr no.</th>
                                    <th>Faculty Name</th>
                                    <th>Department</th>
                                    <th>Email ID</th>
                                    <th></th>
                                </tr>
                                {userData.map((item, index) => (
                                    <>
                                        <tr>
                                            <td>{index + 1}</td>
                                            <td>{item.fname}</td>
                                            <td>{item.fdepartment}</td>
                                            <td>{item.femail}</td>
                                            <td><button className='deleteuser' onClick={() => { deleteUserCredentials(index) }}>Delete</button></td>
                                        </tr>
                                    </>
                                ))}
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
