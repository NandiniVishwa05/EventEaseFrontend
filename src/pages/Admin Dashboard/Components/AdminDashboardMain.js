import React, { useEffect, useState } from 'react'
import '../../../css/AdminDashboard/AdminDashboard.css'
import '../../../css/AdminDashboard/ManageUser.css'
import davlogo from '../../../Resources/davlogo.png';
import profilelogo from '../../../Resources/Profile.jpg'
import { CiLogout } from "react-icons/ci";
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
export default function AdminDashboardMain() {
    const navigate = useNavigate();
    const [adminDashboardData, setAdminDashboardData] = useState([]);
    const [academicYears, setAcademicYears] = useState([]);
    const [userData, setUserData] = useState([]);
    const [aidarray, setAidarray] = useState([]);
    const [departmentData, setDepartmentData] = useState([]);
    // const token = useSelector((state) => state.fIdReducers.token);

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
        if (res.msg === "Added successfully") {
            toast.success("User added successfully !");
            element[0].value = "";
            element[1].value = "";
            element[2].value = "";
            fetchUserCredentialsData();
        } else {
            toast.error("Please! Enter unique Email ID.")
        }
    }

    const deleteUserCredentials = async (index) => {
        console.log(userData[index].fid);

        let data = {
            fid: userData[index].fid
        }
        let res = await fetch(`http://localhost:4000/deleteusercredentials`, {
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
        if (res.msg === "Deleted Successfully") {
            toast.success("Deleted successfully !")
            fetchUserCredentialsData();
            fetchAdminDashboardData();
        }
    }

    const validateuserlabel = () => {
        let element = document.getElementsByClassName('adduserlabel');
        // let errorlabel = document.getElementsByClassName('addusererrorlabel');
        console.log(element);
        let errorcount = 0;
        for (var i = 0; i < element.length; i++) {
            if (element[i].value === "") {
                errorcount++;
                element[i].style.borderLeft = "5px solid red";
                toast.error("This is required field!")
                // errorlabel.style.display="flex";
            } else {
                element[i].style.borderLeft = "";
            }
        }

        if (!element[2].value.includes("@") || !element[2].value.includes(".com")) {
            errorcount++;
            element[2].style.borderLeft = "5px solid red";
            // element[1].style.borderLeft="";
            toast.error("Invalid Input!")
        } else {
            element[2].style.borderLeft = "";

        }
        if (errorcount === 0) {
            addUserCredentials();
            fetchUserCredentialsData()
        }
    }

    const fetchAdminDashboardData = async () => {
        let res = await fetch(`http://localhost:4000/fetchadmindashboardactivitydata`, {
            method: "GET",
            credentials: 'include'
        })
        res = await res.json();
        console.log(res.data)
        if (res.msg === "NoToken" || res.msg === "InvalidToken") {
            navigate('/');
            return;
        } else {
            setAdminDashboardData(res.data);
        }
        // }
    }

    const fetchUserCredentialsData = async () => {
        let res = await fetch(`http://localhost:4000/fetchusercredentials`, {
            credentials: 'include',
            method: "GET"
        })
        res = await res.json();
        console.log(res);
        if (res.msg === "NoToken" || res.msg === "InvalidToken") {
            navigate('/');
            return;
        } else {
            setUserData(res.data);
        }
    }

    const displayAdminUserForm = () => {
        let element = document.getElementsByClassName('manageuserdiv');
        element[0].style.display = "flex";
        let elements = document.getElementsByClassName('adminoverlay');
        elements[0].style.display = "flex";
        let clearforminput = document.getElementsByClassName("adduserlabel");
        clearforminput[0].value = "";
        clearforminput[1].value = "";
        clearforminput[2].value = "";
        document.getElementsByClassName('usersearchbar')[0].value = "";
    }
    const displaymanagedepartmentform = () => {
        let element = document.getElementsByClassName('adddepartmentmaincontainer');
        element[0].style.display = "flex";
        let elements = document.getElementsByClassName('adminoverlay');
        elements[0].style.display = "flex";
        document.getElementsByClassName('adddepartmentlabelinput')[0].value = "";
    }
    const exitadminuserform = () => {
        let element = document.getElementsByClassName('manageuserdiv');
        element[0].style.display = "none";
        let elements = document.getElementsByClassName('adminoverlay');
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

    const downloadZipFile = async () => {
        let ele = document.getElementsByClassName('checkboxinput');
        setAidarray([]);
        let arr = [], count;

        for (let i = 0; i < ele.length; i++) {
            if (ele[i].checked) {
                count++;
            }
        }

        if (count === 0) {
            return;
        }
        for (let i = 0; i < ele.length; i++) {
            if (ele[i].checked) {
                arr.push(adminDashboardData[i].aid);
            }
        }

        setAidarray(arr)
        console.log(arr);
        try {
            let data = {
                aidarray
            }
            const response = await fetch('http://localhost:4000/fetchzipfile', {
                method: "POST",
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ data })
            });

            if (!response.ok) {
                throw new Error('Failed to download files');
            }

            const blob = await response.blob();
            if (blob.msg === "NoToken" || blob.msg === "InvalidToken") {
                navigate('/');
                return;
            }

            // Create a link to download the ZIP file
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'pdfs.zip';
            link.click();

            // Clean up the object URL after download
            URL.revokeObjectURL(link.href);
        } catch (error) {
            console.error('Error downloading files:', error);
            toast.error('Failed to download files. Please try again.')
            // alert();
        }
    }

    const deleteMultipleActivity = async () => {
        let ele = document.getElementsByClassName('checkboxinput');
        let arr = [], count;

        for (let i = 0; i < ele.length; i++) {
            if (ele[i].checked) {
                count++;
            }
        }

        if (count === 0) {
            return;
        }

        for (let i = 0; i < ele.length; i++) {
            if (ele[i].checked) {
                arr.push(adminDashboardData[i].aid);
            }
        }

        console.log(arr);
        try {

            let data = {
                arr
            }
            let res = await fetch('http://localhost:4000/deletemultipleactivity', {
                method: "POST",
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ data })
            });
            res = await res.json();
            if (res.msg === "NoToken" || res.msg === "InvalidToken") {
                navigate('/');
                return;
            }
            if (res.deleted === true) {
                toast.success("Deleted Successfully !")
                fetchAdminDashboardData();
                let ele2 = document.getElementsByClassName('checkboxinput');
                for (let i = 0; i < ele2.length; i++) {
                    const element = ele2[i];
                    element.checked = false;
                }
            }
        } catch (err) {
            console.log(err);
        }
    }

    const validateusersearch = () => {
        let searchuserinput = document.getElementsByClassName('usersearchbar');
        if (searchuserinput[0].value === "") {
            toast.error("Select option to search !")
            console.log("Enter the input to search");
        } else {
            fetchfilteruserdetail();
        }
    }
    const fetchfilteruserdetail = async () => {
        console.log("fikteruser");

        let searchuserinput = document.getElementsByClassName('usersearchbar');
        let name = searchuserinput[0].value;
        console.log(name);
        let res = await fetch(`http://localhost:4000/fetchfilteruserdetail/${name}`, {
            method: "GET",
            credentials: 'include',
        })
        res = await res.json();
        console.log(res);
        if (res.msg === "NoToken" || res.msg === "InvalidToken") {
            navigate('/');
            return;
        }
        if (res.msg === "UserNotExist") {
            // setUserData(res);
            toast.warning("User not exist!")
            console.log("usernotexist error msg ");
        } else {
            setUserData(res)
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
    const resetusersearch = () => {
        document.getElementsByClassName('usersearchbar')[0].value = "";
        fetchUserCredentialsData();
    }
    const validateadmindashboardfiltersection = () => {
        console.log('hello');

        let errorcount = 0;
        let adminfilterinput = document.getElementsByClassName('adminfilterinput');

        if (adminfilterinput[0].value === "Select..." && adminfilterinput[1].value === "Select...") {
            toast.error("Select option to search !");

            errorcount++;
        }
        if (errorcount === 0) {
            fetchfilteradmindashboarddata();
        }

    }

    const fetchfilteradmindashboarddata = async () => {

        let adminfilterinput = document.getElementsByClassName('adminfilterinput');
        let ayear = adminfilterinput[0].value;
        let adept = adminfilterinput[1].value;
        console.log(ayear + "" + adept);

        let res = await fetch(`http://localhost:4000/fetchfilteradmindashboarddata/${ayear}/${adept}`, {
            method: "GET",
            credentials: 'include',
        })
        res = await res.json();
        console.log(res);
        if (res.msg === "NoToken" || res.msg === "InvalidToken") {
            navigate('/');
            return;
        }
        if (res.msg === "found") {
            setAdminDashboardData(res.data);
        } else {
            toast.error("Data not found !")
        }
    }
    const validateadddepartmentinput = () => {
        let element = document.getElementsByClassName('adddepartmentlabelinput');
        console.log(element[0].value);
        if (element[0].value === "") {
            toast.error("Enter Department !");
        } else {
            insertdepartmentdetail();
        }
    }
    const insertdepartmentdetail = async () => {
        let element = document.getElementsByClassName('adddepartmentlabelinput');
        let dept = element[0].value;
        let data = {
            dept: dept
        }
        let res = await fetch(`http://localhost:4000/insertdepartmentdetail`, {
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
        if (res.msg === "Inserted Successfully") {
            toast.success("Department added successfully !")
            document.getElementsByClassName('adddepartmentlabelinput')[0].value = "";
            fetchdepartmenttabledata();
            element[0].innerHTML = "";
        }
    }

    const fetchdepartmenttabledata = async () => {
        let res = await fetch(`http://localhost:4000/fetchdepartmenttabledata`, {
            method: "GET",
            credentials: 'include',
        })
        res = await res.json();
        console.log(res);
        if (res.msg === "NoToken" || res.msg === "InvalidToken") {
            navigate('/');
            return;
        }else{
            setDepartmentData(res);
        }
    }
    const deletedepartmentdata = async (index) => {
        // console.log();
        let dept = departmentData[index].did;
        console.log(dept);

        let res = await fetch(`http://localhost:4000/deletedepartmentdata/${dept}`, {
            method: "GET",
            credentials: 'include',
        })
        res = await res.json();
        console.log(res);
        if (res.msg === "NoToken" || res.msg === "InvalidToken") {
            navigate('/');
            return;
        }
        if (res.msg === "Deleted Successfully") {
            toast.success("Deleted Successfully!")
            fetchdepartmenttabledata();
        }
    }
    const departmentformexitbtn = () => {
        let element = document.getElementsByClassName('adddepartmentmaincontainer');
        element[0].style.display = "none";
        let elements = document.getElementsByClassName('adminoverlay');
        elements[0].style.display = "none";
    }

    const deleteallselectedrow = (e) => {
        let checkboxes = document.getElementsByClassName('checkboxinput')
        console.log(checkboxes);
        if (e.target.checked) {
            for (let i = 0; i < checkboxes.length; i++) {
                const element = checkboxes[i];
                element.checked = true;
            }
        } else {
            for (let i = 0; i < checkboxes.length; i++) {
                const element = checkboxes[i];
                element.checked = false;
            }
        }
    }

    const checkallcheckboxes = () => {
        let checkboxes = document.getElementsByClassName('checkboxinput');
        let selectall = document.getElementById('selectall');
        let isAllChecked = false;
        for (let i = 0; i < checkboxes.length; i++) {
            const element = checkboxes[i];
            if (element.checked) {
                isAllChecked = true;
            } else {
                isAllChecked = false;
                break;
            }
        }

        if (isAllChecked) {
            selectall.checked = true;
        } else {
            selectall.checked = false;
        }
    }
    const resetadmintablesearch = () => {
        document.getElementsByClassName('adminfilterinput')[0].selectedIndex = 0
        document.getElementsByClassName('adminfilterinput')[1].selectedIndex = 0
        fetchAdminDashboardData();

    }
    useEffect(() => {
        generateAcademicYears();
        fetchAdminDashboardData();
        fetchUserCredentialsData();
        fetchdepartmenttabledata();
    }, []);

    return (
        <>
            <div className="toastmessagediv">
                <ToastContainer />
            </div>
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
                        <img src={profilelogo} className='profilelogo' alt='profilelogo' />
                        <label className='adminname'>Admin</label>
                        <div className="admindropdownmenu">
                            <div className="admindropdownitem" onClick={displayAdminUserForm}>
                                <p >Manage User</p>
                            </div>
                            <div className="admindropdownitem" onClick={displaymanagedepartmentform}>
                                <p>Manage Department</p>
                            </div>
                            <div className="admindropdownitem" onClick={exitDashboard}>
                                <p>Logout</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="div2containerheader">
                    <p className='headeradmin'>Filter Section</p>
                </div>
                <div className="admindashboardcontainerdiv2">
                    <div className="adminfiltersectiondiv">
                        <label htmlFor="academicYear">Select Academic Year: </label>
                        <select id="academicYear" className='adminfilterinput'>
                            <option value="Select...">Select...</option>
                            {academicYears.map((year, index) => (
                                <option key={index} value={year}>
                                    {year}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="adminfiltersectiondiv">
                        <label>Select Department : </label>
                        <select className='adminfilterinput'>
                            <option value="Select...">Select...</option>
                            {departmentData.map((item, index) => (
                                <option value={item.dname}>Department of {item.dname}</option>
                            ))}
                        </select>
                    </div>
                    <div className="adminfiltersectiondiv">
                        <button onClick={validateadmindashboardfiltersection} className='filtersubmitbtn'>Search</button>
                        <button className='searchuserbtn' onClick={resetadmintablesearch} >Reset</button>

                    </div>
                </div>
                <div className="downloadandactivityheaderdiv">
                    <p className='headeradmin'>Activity Details</p>
                    <div className="downloadactivitytablebtns">
                        <button className='downloadall' onClick={deleteMultipleActivity}>Delete</button>
                        <button className='downloadall' onClick={downloadZipFile}>Download</button>
                    </div>
                </div>
                <div className="admindashboardcontainerdiv3">
                    <div className="admindashboardsubcontainerdiv3">
                        <div className="admindashboardsubcontainerdiv3table">

                            <table>
                                <tr> <th>Sr no</th> <th>Faculty Name</th>
                                    <th>Activity Name</th>
                                    <th>Department</th>
                                    <th>Academic Year</th>
                                    <th>Activity Date</th>
                                    <th>Uploaded File</th>
                                    <th><input type="checkbox" id='selectall' className="selectall" onChange={deleteallselectedrow} /></th>
                                </tr>
                                {adminDashboardData?.map((item, index) => (
                                    <>
                                        <tr>
                                            <td>{index + 1}</td>
                                            <td>{item.fname}</td>
                                            <td>{item.aname}</td>
                                            <td>{item.dname}</td>
                                            <td>{item.aacademic_year}</td>
                                            <td>{item.adate.substr(0, 10)}</td>
                                            <td><a href={`http://localhost:4000/downloadactivitypdf/${item.aid}`} className='ufiles'>Download</a></td>
                                            <td><input type="checkbox" className="checkboxinput" name="" id="chkinput" onChange={checkallcheckboxes} /></td>
                                        </tr>
                                    </>
                                ))}

                            </table>
                        </div>
                    </div>
                </div>
                <div className="adminoverlay"> </div>
                <div className="manageuserdiv">
                    <div className="manageusermaincontainer">
                        <label className='exitadminuserform' onClick={exitadminuserform}>x</label>
                        <label className='manageuserheader'>User Management</label>
                        <div className="adduserbar">
                            <div className="adduserformfield">
                                <label ><span className='adduserlabelname'>Enter Faculty Name : </span><input type='text' className='adduserlabel' /></label>
                            </div>
                            <div className="adduserformfield">
                                <label ><span className='adduserlabelname'>Enter Password: </span><input type='password' className='adduserlabel' /></label>
                            </div>
                            <div className="adduserformfield">
                                <label ><span className='adduserlabelname'>Enter Email ID : </span><input type='text' className='adduserlabel' /></label>
                            </div>
                            <div className="adduserbtndiv">
                                <button className='adduserbtn' onClick={validateuserlabel}>Add User</button>
                            </div>
                        </div>
                        <div className="searchbardiv">
                            <label className='searchlabelname'>Search : </label>
                            <input type='text' className='usersearchbar' />
                            <button className='searchuserbtn' onClick={validateusersearch} >Search</button>
                            <button className='searchuserbtn' onClick={resetusersearch} >Reset</button>
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
                                            <td>{item.dname}</td>
                                            <td>{item.femail}</td>
                                            <td><button className='deleteuser' onClick={() => { deleteUserCredentials(index) }}>Delete</button></td>
                                        </tr>
                                    </>
                                ))}
                            </table>
                        </div>
                    </div>
                </div>
                <div className="adddepartmentmaincontainer">
                    <div className="adddepartmentexitbtn" onClick={departmentformexitbtn}>
                        <label className='managedepartmentexit'>x</label>
                    </div>
                    <div className="adddepartmentheader">
                        <label className='managedepartmentheader'>Manage Department</label>
                    </div>
                    <div className="adddepartmentaddinputsection">
                        <div className="adddepartmentinput">
                            <label className='adddepartmentlabelname'>Enter Department : </label><input type="text" name="dept" className='adddepartmentlabelinput' />
                        </div>
                        <div className="adddepartmentaddbtn">
                            <button className='adddepartmentbtn' onClick={validateadddepartmentinput}>Add</button>
                        </div>
                    </div>
                    <div className="adddepartmenttablecontainer">
                        <div className="adddepartmenttablemaincontainer">
                            <table>
                                <tr>
                                    <th>Sr no</th>
                                    <th>Department Name</th>
                                    <th></th>
                                </tr>
                                {departmentData.map((item, index) => (
                                    <>
                                        <tr>
                                            <td>{index + 1}</td>
                                            <td>Department of {item.dname}</td>
                                            <td><button className='adddepartmentdeletebtn' onClick={() => { deletedepartmentdata(index) }}>Delete</button></td>
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
