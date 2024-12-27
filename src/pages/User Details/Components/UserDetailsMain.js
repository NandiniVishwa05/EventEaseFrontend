import React, { useEffect, useState } from 'react'
import '../../../css/UserDetails/UserDetails.css'
import davlogo from '../../../Resources/davlogo.png'
import { useDispatch, useSelector } from 'react-redux'
import { setFid } from '../../../redux/reducers/fIdReducers';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom'
export default function UserDetailsMain() {
  const navigate = useNavigate();
  const fid = useSelector((state) => state.fIdReducers.fid);
  const dispatch = useDispatch();
  const [fname, setFname] = useState();
  const [deptDropdownData, setDeptDropdownData] = useState([]);
  const fetchfname = async () => {
    // console.log(fid);
    let res = await fetch(`http://localhost:4000/fetchfname`, {
      method: "GET",
      credentials: 'include'
    })
    if (res.msg === "NoToken" || res.msg === "InvalidToken") {
      navigate('/');
      return;
    }
    res = await res.json();
    console.log(res[0]);
    setFname(res[0].fname);
  }
  console.log(fid);
  const ValidateDetails = () => {
    // console.log("hello");
    let errorcount = 0;
    const elements = document.getElementsByClassName("inputfield");
    const errorelements = document.getElementsByClassName('errorlabel');
    const profilepic = document.querySelector('.profilepic');
    console.log(profilepic.files);
    const imagefile = profilepic.files[0];

    if (!imagefile) {
      errorcount++;
      toast.error( "This is required field !");
    }
    
    // console.log(elements);
    for (var i = 1; i < elements.length; i++) {
      if (elements[i].value === "") {
        toast.error( "This is required field !");
        // errorelements[i].innerHTML = "This is required field !";
        errorcount++
      }
    }

    if (errorcount === 0) {
      insertData();
    }
  }

  const insertData = async () => {
    const elements = document.getElementsByClassName("inputfield");
    let did = deptDropdownData[elements[1].selectedIndex - 1].did;
    const fjoiningdate = elements[2].value;
    const phoneno = elements[3].value;
    const profilepic = document.querySelector('.profilepic');
    const imagefile = profilepic.files[0];

    const reader = new FileReader();
    reader.readAsDataURL(imagefile);

    reader.onload = async () => {
      const base64data = reader.result;
      console.log(base64data);
      let data = {
        fid: fid,
        fjoiningdate: fjoiningdate,
        phoneno: phoneno,
        image: base64data,
        did: did
      }
      let res = await fetch(`http://localhost:4000/insertfdata`, {
        method: "POST",
        body: JSON.stringify(data),
        credentials:'include',
        headers: {
          "Content-type": "application/json",
        },
      })
      res = await res.json();
      console.log(res);
      if (res.msg === "InsertedSuccessfully") {
        navigate('/userdashboard');
      }
    }

  }
  const fetchdepartmenttabledata = async () => {
    let res = await fetch(`http://localhost:4000/fetchdepartmenttabledata`, {
      method: "GET",
      credentials: 'include'
    })
    res = await res.json();
    console.log(res);
    if (res.msg === "NoToken" || res.msg === "InvalidToken") {
      navigate('/');
      return;
    }
    setDeptDropdownData(res);
  }

  useEffect(() => {
    fetchdepartmenttabledata();
    fetchfname();
  }, []);

  return (
    <>
      <div className="userformmaincontainer">
        <div className="userformcontainer">
          <label className='formname'>User Details</label>
          <div className="formfielddiv">
            <label className='fieldname'>Username</label>
            <input type='text' className='field inputfield' disabled value={fname} />
            <label className='errorlabel'></label>
          </div>
          <div className="formfielddiv">
            <label className='fieldname'>Department</label>
            <select className="dept inputfield">
              <option value="" disabled selected hidden>Select...</option>
              {deptDropdownData.map((item, index) => (
                <>
                  <option value={item.dname}>{item.dname} </option>
                </>
              ))}
            </select>
            <label className='errorlabel'></label>

          </div>
          <div className="formfielddiv">
            <label className='fieldname '>Joining Date</label>
            <input type='date' className='field inputfield' />
            <label className='errorlabel'></label>
          </div>
          <div className="formfielddiv">
            <label className='fieldname'>Phone Number</label>
            <input type='text' maxLength={12} className='field inputfield' />
            <label className='errorlabel'></label>

          </div>
          <div className="formfielddiv">
            <label className='fieldname'>Profile Photo</label>
            <input type='file' className='profilepic filefield' accept='image/*' />
            <label className='errorlabel'></label>
          </div>
          <button onClick={ValidateDetails} className='formbtn'>Submit</button>
        </div>
      </div>
    </>
  )
}
