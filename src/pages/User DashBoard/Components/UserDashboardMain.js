import React, { useEffect, useState } from 'react'
import '../../../css/UserDashboard/UserDashboard.css'
import davlogo from '../../../Resources/davlogo.png'
// import profilelogo from '../../../Resources/Profile.jpg'
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { CiLogout } from "react-icons/ci";
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

export default function UserDashboardMain() {
    const [profilelogo, setProfileLogo] = useState();
    const navigate = useNavigate();
    const fid = useSelector((state) => state.fIdReducers.fid);
    const [dashboardData, setDashboardData] = useState([]);
    const [academicYear, setAcademicYears] = useState([]);
    const [isUpdate, setIsUpdate] = useState(false);
    const [formIndex, setFormIndex] = useState();

    const fetchuserdetails = async () => {
        let res = await fetch(`http://localhost:4000/fetchuserdetails`, {
            method: "GET",
            credentials: 'include'
        });
        res = await res.json();
        console.log(res);
        if (res.msg === "NoToken" || res.msg === "InvalidToken") {
            navigate('/');
            return;
        }
        // console.log(res[1].fname);
        let username = document.getElementsByClassName('fname');
        let deptname = document.getElementsByClassName('deptname');
        let logoutemailid = document.getElementsByClassName('logoutemailid');
        // console.log(res);

        setProfileLogo(res.userpic);
        username[0].innerHTML = res.userdata[0].fname;
        deptname[0].innerHTML = "Department of " + res.userdata[0].dname;
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
            activity_name: activity_name,
            academic_year: academic_year,
            activity_date: activity_date,
            female_student: female,
            male_student: male,
        }
        let res = await fetch(`http://localhost:4000/updateactivitydata`, {
            method: "POST",
            body: JSON.stringify(data),
            credentials: 'include',
            headers: {
                Accept: "application/json",
                "Content-type": "application/json",
            },
        });

        res = await res.json();
        console.log(res);
        if (res.msg === "NoToken" || res.msg === "InvalidToken") {
            navigate('/');
            return;
        }
        if (res.msg === "Success") {
            toast.success("Acivity updated Successfully !");
            for (let i = 0; i < element.length; i++) {
                element[i].value = "";
            }
        }
        // console.log("Im in update activity");
        fetchActivityData();

    }
    const deleteActivityData = async (index) => {
        console.log(dashboardData[index]);

        let data = {
            aid: dashboardData[index].aid,
        }
        let res = await fetch(`http://localhost:4000/deleteActivityData`, {
            method: "POST",
            credentials: 'include',
            body: JSON.stringify(data),
            headers: {
                Accept: "application/json",
                "Content-type": "application/json",
            },
        });

        res = await res.json();
        console.log(res);
        if (res.msg === "NoToken" || res.msg === "InvalidToken") {
            navigate('/');
            return;
        }
        if (res.msg === "Data Deleted Successfully") {
            toast.success(" Activity Deleted Successfully !")
        }
        fetchActivityData();
    }
    const fetchActivityData = async () => {
        let res = await fetch(`http://localhost:4000/fetchactivitydata`, {
            method: "GET",
            credentials: 'include'
        });
        res = await res.json();
        console.log(res);
        if (res.msg === "NoToken" || res.msg === "InvalidToken") {
            navigate('/');
            return;
        } else {
            setDashboardData(res.data);
        }
    }

    const insertActivityData = async () => {
        let element = document.getElementsByClassName('activityforminput ');
        let pdffile = document.querySelector('.pdffile');
        pdffile = pdffile.files[0];

        console.log(pdffile.size);
        console.log("maxsize = ", 2 * 1024 * 1024);

        if (pdffile.size > (2 * 1024 * 1024)) {
            console.log("File greater than 2mb");
        }

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
                activity_name: activity_name,
                academic_year: academic_year,
                activity_date: activity_date,
                female_student: female,
                male_student: male,
                pdf: base64data
            }
            try {
                let res = await fetch(`http://localhost:4000/insertactivitydata`, {
                    method: "POST",
                    credentials: 'include',
                    body: JSON.stringify(data),
                    headers: {
                        // Accept: "application/json",
                        "Content-type": "application/json",
                    },
                });
                res = await res.json();
                if (res.msg === "NoToken" || res.msg === "InvalidToken") {
                    navigate('/');
                    return;
                }
                if (res.msg === "Success") {
                    toast.success("Acivity added successfully");
                    let elements = document.getElementsByClassName('activityforminput ');
                    elements[0].value = "";
                    elements[1].value = "";
                    elements[2].value = "";
                    elements[3].value = "";
                    elements[4].value = "";
                    fetchActivityData();
                }
            } catch (error) {
                toast.error("Upload File upto 1MB   ")
            }
        }

    }

    const validateActivityForm = () => {
        let element = document.getElementsByClassName('activityforminput ');
        // let activityerrorlabel = document.getElementsByClassName('activityformerrormsg');
        let pdffile = document.querySelector('.pdffile');
        let erroractivitycounter = 0;

        if (!pdffile.files[0]) {
            erroractivitycounter++;
            // activityerrorlabel[5].style.display = "flex";
            toast.error("This is required field");
        } else {
            // activityerrorlabel[5].innerHTML = "";
        }

        for (var i = 0; i < element.length; i++) {
            console.log(element[i].value);
            if (element[i].value === "" || element[i].value === "Select Academic Year") {
                erroractivitycounter++;
                toast.error("This is required field");
            } else {

            }
        }
        if (erroractivitycounter === 0) {
            insertActivityData();
        }
    }

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

    const exitDashboard = async () => {
        let res = await fetch('http://localhost:4000/logout', {
            credentials: 'include',
            method: 'GET'
        })
        res = await res.json();
        if (res.msg === "LoggedOut") {
            navigate("/");
        }
    }

    const uservalidatefilterinput = () => {
        let aname = document.getElementsByClassName('userfiltervalue')[0].value;
        let aacademic_year = document.getElementsByClassName('userfilterselectvalue')[0].value;
        if (aname === "" && aacademic_year === "Select...") {
            toast.error("Please ! Select option to proceed further .");
        } else {
            fetchdatabyfilter();
        }
    }
    const fetchdatabyfilter = async () => {
        let aname = document.getElementsByClassName('userfiltervalue')[0].value;
        let aacademic_year = document.getElementsByClassName('userfilterselectvalue')[0].value;
        console.log(document.getElementsByClassName('userfilterselectvalue')[0].value);
        if (aname === "") {
            aname = "emptyinpfield";
        }
        console.log(aname);
        let res = await fetch(`http://localhost:4000/fetchdatabyfilter/${aname}/${aacademic_year}`, {
            method: "GET",
            credentials: 'include',
        });
        res = await res.json();
        console.log(res);
        if (res.msg === "NoToken" || res.msg === "InvalidToken") {
            navigate('/');
            return;
        }
        if (res.msg !== "empty") {
            setDashboardData(res);
        } else {
            toast.error("Activity not found !")
        }
    }
    const generateAcademicYears = () => {
        let currentYear = new Date().getFullYear();
        console.log(currentYear);
        currentYear = currentYear + 2;

        let startYear = 2021; // Change this to the desired start year
        let totalYears = currentYear - startYear;
        let years = [];

        for (let i = 0; i < totalYears; i++) {
            const year1 = startYear + i;
            const year2 = year1 + 1;
            if (year2 < currentYear) {
                years.push(`${year1}-${year2}`);
            }
        }

        setAcademicYears(years);
        return years;
    };
    const resetuserdasboardtablesearch = () => {
        document.getElementsByClassName('userfilterselectvalue')[0].selectedIndex = "0";
        fetchActivityData();
    }
    useEffect(() => {
        fetchuserdetails();
        fetchActivityData();
        generateAcademicYears();
    }, [])

    return (
        <>
            <ToastContainer />
            <div className="dashboardmaincontainer">
                <div className="dashboardcontainerdiv1">
                    <div className="dashboardcontainerdiv1left">
                        <div className="davlogoimgdiv">
                            <img src={davlogo} className='davlogo' alt='davlogo' />
                        </div>
                        <div className="clgnamediv">
                            <div className="clgnamediv1">
                                <label className='clgname' >Ramanand Arya DAV College</label>
                            </div>
                            <div className="clgnamediv2">
                                <label className='deptname'></label>
                            </div>
                        </div>
                    </div>
                    <div className="btnandprofile">
                        <button className='addactivitybtn' onClick={() => {
                            setIsUpdate(false);
                            document.getElementsByClassName('activityforminput')[0].value = "";
                            document.getElementsByClassName('activityforminput')[1].selectedIndex = 0;
                            document.getElementsByClassName('activityforminput')[2].value = "";
                            document.getElementsByClassName('activityforminput')[3].value = "";
                            document.getElementsByClassName('activityforminput')[4].value = "";
                            // document.getElementsByClassName('activityforminput')[5].value = "";
                            displayForm()
                        }}>Add Activity</button>
                        <div className="userinfo">
                            <div className="profilelogo">
                                <img src={profilelogo} alt='' className='profilephoto' />
                                <div className="logoutsection">
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
                <div className="lowercontainer">
                    <div className='filtersectionerrormsg'></div>
                    <p className='userheaderadmin'>Filter Section</p>
                    <div className="dashboardcontainerdiv2">
                        <div className="userdashboardcontainerdiv2">
                            <div className="userfiltersectiondiv">
                                <label>Activity Name : </label>
                                <input className=' userfiltervalue' type="text" name="" id="" />
                            </div>
                            <div className="userfiltersectiondiv">
                                <label>Select Year :  </label>
                                <select className='userfilterselectvalue'>
                                    <option value="Select...">Select...</option>
                                    {academicYear.map((year, index) => (
                                        <option key={index} value={year}>
                                            {year}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="userfiltersectiondiv">
                                <button onClick={uservalidatefilterinput}>Search</button>
                                <button className='searchuserbtn' onClick={resetuserdasboardtablesearch} >Reset</button>
                            </div>

                        </div>
                    </div>
                    <p className='userheaderadmin'>Activity Details </p>
                    < div className="dashboardcontainerdiv3">
                        <div className="tablescroll">

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
                    </div>
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
        </>
    )
}
