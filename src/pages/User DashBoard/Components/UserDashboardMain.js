import React, { useEffect, useState } from 'react'
import '../../../css/UserDashboard/UserDashboard.css'
import davlogo from '../../../Resources/davlogo.png'
// import profilelogo from '../../../Resources/Profile.jpg'
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { CiLogout } from "react-icons/ci";
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';

export default function UserDashboardMain() {
    const [profilelogo, setProfileLogo] = useState();
    const navigate = useNavigate();
    const fid = useSelector((state) => state.fIdReducers.fid);
    const [dashboardData, setDashboardData] = useState([]);
    const [isUpdate, setIsUpdate] = useState(false);
    const [formIndex, setFormIndex] = useState();

    const fetchuserdetails = async () => {
        let res = await fetch(`http://localhost:4000/fetchuserdetails/${fid}`, {
            method: "GET",
        });
        res = await res.json();
        console.log(res);

        // console.log(res[1].fname);
        let username = document.getElementsByClassName('fname');
        let deptname = document.getElementsByClassName('deptname');
        let logoutemailid = document.getElementsByClassName('logoutemailid');
        // console.log(res);

        setProfileLogo(res.userpic);
        username[0].innerHTML = res.userdata[0].fname;
        deptname[0].innerHTML = "Department of " + res.userdata[0].fdepartment;
        logoutemailid[0].innerHTML = res.userdata[0].femail;
    }

    const displayEditForm = (index) => {
        displayForm();
        setIsUpdate(true);
        setFormIndex(index);
        let element = document.getElementsByClassName('activityforminput ');
        console.log(dashboardData[index].aid);
        element[0].value = dashboardData[index].aname;
        element[1].value = dashboardData[index].aacademic_year;
        element[2].value = dashboardData[index].adate.substr(0, 10);
        element[3].value = dashboardData[index].afemale_student;
        element[4].value = dashboardData[index].amale_student;

    }

    const updateActivityData = async () => {
        let element = document.getElementsByClassName('activityforminput ');
        console.log(element);
        let activity_name = element[0].value;
        let academic_year = element[1].value;
        let activity_date = element[2].value;
        let female = element[3].value;
        let male = element[4].value;
        console.log(activity_date);


        let data = {
            aid: dashboardData[formIndex].aid,
            afid: fid,
            activity_name: activity_name,
            academic_year: academic_year,
            activity_date: activity_date,
            female_student: female,
            male_student: male,
        }
        let res = await fetch(`http://localhost:4000/updateactivitydata`, {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                Accept: "application/json",
                "Content-type": "application/json",
            },
        });

        res = await res.json();
        console.log(res);
        console.log("Im in update activity");
        fetchActivityData();

    }
    const deleteActivityData = async (index) => {
        console.log(dashboardData[index]);

        let data = {
            aid: dashboardData[index].aid,
            afid: fid,
        }
        let res = await fetch(`http://localhost:4000/deleteActivityData`, {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                Accept: "application/json",
                "Content-type": "application/json",
            },
        });

        res = await res.json();
        console.log(res);
        fetchActivityData();
    }
    const fetchActivityData = async () => {
        let res = await fetch(`http://localhost:4000/fetchactivitydata/${fid}`, {
            method: "GET",
        });
        res = await res.json();
        console.log(res);

        setDashboardData(res.data);
    }

    const insertActivityData = async () => {
        let element = document.getElementsByClassName('activityforminput ');
        let pdffile = document.querySelector('.pdffile');
        pdffile = pdffile.files[0];

        if (!pdffile || pdffile.type !== "application/pdf") {
            console.log("Please select a pdf file");
        }

        const reader = new FileReader();
        reader.readAsDataURL(pdffile);

        reader.onload = async () => {
            let activity_name = element[0].value;
            let academic_year = element[1].value;
            let activity_date = element[2].value;
            let female = element[3].value;
            let male = element[4].value;
            const base64data = reader.result;

            let data = {
                afid: fid,
                activity_name: activity_name,
                academic_year: academic_year,
                activity_date: activity_date,
                female_student: female,
                male_student: male,
                pdf: base64data
            }

            let res = await fetch(`http://localhost:4000/insertactivitydata`, {
                method: "POST",
                body: JSON.stringify(data),
                headers: {
                    // Accept: "application/json",
                    "Content-type": "application/json",
                },
            });

            res = await res.json();
            console.log(res);
            if (res.msg === "Success") {
                let elements = document.getElementsByClassName('activityforminput ');
                elements[0].value = "";
                elements[1].value = "";
                elements[2].value = "";
                elements[3].value = "";
                elements[4].value = "";
                fetchActivityData();
            }
        }

    }

    const validateActivityForm = () => {
        let element = document.getElementsByClassName('activityforminput ');
        let activityerrorlabel = document.getElementsByClassName('activityformerrormsg');
        let pdffile = document.querySelector('.pdffile');
        let erroractivitycounter = 0;

        if (!pdffile.files[0]) {
            erroractivitycounter++;
            activityerrorlabel[5].style.display = "flex";
            activityerrorlabel[5].innerHTML = "This is required field";
        } else {
            activityerrorlabel[5].innerHTML = "";
        }

        for (var i = 0; i < element.length; i++) {
            console.log(element[i].value);
            if (element[i].value === "" || element[i].value === "Select Academic Year") {
                erroractivitycounter++;
                activityerrorlabel[i].style.display = "flex";
                activityerrorlabel[i].innerHTML = "This is required field";
            } else {
                activityerrorlabel[i].style.display = "none";

            }
        }
        if (erroractivitycounter === 0) {
            insertActivityData();
        }
    }

    // const logout = () => {
    //     let element = document.getElementsByClassName('logoutsection');
    //     element[0].style.display = "flex";
    // }

    // const exitloginsection = () => {
    //     let element = document.getElementsByClassName('logoutsection');
    //     element[0].style.display = "none";
    // }

    const displayForm = () => {
        let element = document.getElementsByClassName('dashboardaddactivityform');
        element[0].style.display = "flex";
        let elements = document.getElementsByClassName('overlay');
        elements[0].style.display = "flex";
    }

    const exitform = () => {
        let element = document.getElementsByClassName('dashboardaddactivityform');
        element[0].style.display = "none";
        let elements = document.getElementsByClassName('overlay');
        elements[0].style.display = "none";
    }

    const exitDashboard = () => {
        navigate("/");
    }

    useEffect(() => {
        fetchuserdetails();
        fetchActivityData();
    }, [])

    return (
        <div className="dashboardmaincontainer">
            <div className="dashboardcontainerdiv1">
                <div className="logo">
                    <img src={davlogo} className='davlogo' alt='davlogo' />
                    <div className="name">
                        <label className='clgname' >Ramanand Arya DAV College</label>
                        <label className='deptname'></label>
                    </div>
                </div>
                <div className="btnandprofile">
                    <button className='addactivitybtn' onClick={() => { setIsUpdate(false); displayForm() }}>Add Activity</button>
                    <div className="userinfo">
                        <div className="profilelogo">
                            <img src={profilelogo} alt='' className='profilephoto' />
                            <div className="logoutsection">
                                {/* <label className='logoutexitbtn' onClick={exitloginsection}>x</label><br /> */}
                                <div className="logoutprofilephoto">
                                    <img src={profilelogo} alt='profilephoto' className='' />
                                </div>
                                <label className='logoutname'></label>
                                <label className='logoutemailid'></label>
                                <button className='logoutbtn' onClick={exitDashboard}><CiLogout /> <b>Logout</b></button>
                            </div>
                        </div>
                        <div className="username">
                            <label className='fname'>Nandini Vishwakarma</label>
                        </div>
                    </div>
                </div>
            </div>
            <div className="dashboardcontainerdiv2">
                <label className='search'>Search By :
                    <input type='text' />
                </label>
                <select name="Academic year" >
                    <option defaultValue="Select Year">Select Academic Year</option>
                    <option value="2024-2025">2024 - 2025</option>
                    <option value="2023-2024">2023 - 2024</option>
                    <option value="2022-2023">2022 - 2023</option>
                    <option value="2021-2022">2021 - 2022</option>
                </select>
                <input type="date" className="date-input" />
            </div>
            < div className="dashboardcontainerdiv3">

                <table>

                    <tr>
                        <th>Sr no</th>
                        <th>Activity Name</th>
                        <th>Academic Year</th>
                        <th>Activity Date</th>
                        <th>Male Student</th>
                        <th>Female Student</th>
                        <th>Upload File</th>
                        <th>Edit</th>
                    </tr>
                    {dashboardData?.map((item, index) => (
                        <>
                            <tr>
                                <td>{index + 1}</td>
                                <td>{item.aname}</td>
                                <td>{item.aacademic_year}</td>
                                <td>{item.adate.substr(0, 10)}</td>
                                <td>{item.afemale_student}</td>
                                <td>{item.amale_student}</td>
                                <td><input type='file' /></td>
                                <td><label className='editbtn' onClick={() => { displayEditForm(index) }}>Edit <FaRegEdit /> </label><label className='deletebtn' onClick={() => { deleteActivityData(index) }}>Delete <RiDeleteBin6Line /> </label></td>
                            </tr>
                        </>
                    ))}
                </table>

            </div>

            <div className="dashboardaddactivityform">
                <label className='activityformexitbtn' onClick={exitform}> x </label>
                <label className='activityfromheadername'>Activity Detail Form</label>
                <div className="activityfromdiv">
                    <div className="activityformdiv1">
                        <label className='activityformfieldname'>Activity Name :</label><input type='text' className='activityforminput' />
                        <label className='activityformerrormsg'></label>

                        <label className='activityformfieldname'>Academic year :</label>
                        <select name="Academic year" className='activityforminput '>
                            <option value="Select Academic Year">Select Academic Year</option>
                            <option value="2024-2025">2024 - 2025</option>
                            <option value="2023-2024">2023 - 2024</option>
                            <option value="2022-2023">2022 - 2023</option>
                            <option value="2021-2022">2021 - 2022</option>
                        </select>
                        <label className='activityformerrormsg'></label>

                        <label className='activityformfieldname'>Activity Date :</label><input className=" activityforminput " type='date' />
                        <label className='activityformerrormsg'></label>

                    </div>
                    <div className="activityformdiv2">
                        <label className='activityformfieldname'>No. of Female Student :</label><input className="activityforminput" type='text' maxLength={5} />
                        <label className='activityformerrormsg'></label>

                        <label className='activityformfieldname'>No. of Male Student :</label><input className="activityforminput" type='text' maxLength={5} />
                        <label className='activityformerrormsg'></label>

                        <label className='activityformfieldname'>Upload Activity File :</label><input className="pdffile" accept="application/pdf" type='file' />
                        <label className='activityformerrormsg'></label>

                    </div>
                </div>
                <button className='submitactivityformbtn' onClick={() => { isUpdate ? updateActivityData() : validateActivityForm() }}>Submit</button>
            </div>
            <div className="overlay">

            </div>
        </div>
    )
}
