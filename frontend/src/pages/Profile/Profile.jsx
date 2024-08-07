import "react-toastify/dist/ReactToastify.css";
import "./Profile.scss";

import React, { Fragment, useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify"; // Import Toastify
import {
  useGetProfileQuery,
  useUpdatePasswordMutation,
  useUpdateProfileMutation,
} from "../../context/api/userApi";

import FemaleImg from "../../assets/not-fml.jpeg";
import MaleImg from "../../assets/not.jpg";
import Module from "../../components/Module/Module";

const initialState = {
  fname: "",
  lname: "",
  username: "",
  age: "",
  budget: "",
  gender: "",
};

const Profile = () => {
  const [formData, setFormData] = useState(initialState);
  const [module, setModal] = useState(false);
  const [passwordModule, setPasswordModule] = useState(false);

  const { data, refetch } = useGetProfileQuery();
  const [updateProfile] = useUpdateProfileMutation();
  const [updatePassword] = useUpdatePasswordMutation();
  const user = data?.payload;
  console.log(user);

  useEffect(() => {
    if (data) {
      setFormData({
        fname: data.payload.fname,
        lname: data.payload.lname,
        username: data.payload.username,
        age: data.payload.age,
        budget: data.payload.budget,
        gender: data.payload.gender,
      });
    }
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(formData).unwrap();
      setModal(false);
      refetch();
    } catch (error) {
      toast.error("Failed to update profile. Please try again."); // Show error toast
      console.log(error);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    const { oldPassword, newPassword } = e.target.elements;
    try {
      await updatePassword({
        oldPassword: oldPassword.value,
        newPassword: newPassword.value,
      }).unwrap();
      setPasswordModule(false);
      refetch();
      toast.success("Password updated successfully."); // Show success toast
    } catch (error) {
      toast.error("Failed to update password. Please try again."); // Show error toast
      console.log(error);
    }
  };

  return (
    <Fragment>
      <div className="container profile">
        <div className="profile__img">
          <img src={user?.gender == "male" ? MaleImg : FemaleImg} alt="" />
        </div>
        <div className="profile__info">
          <div className="fd">
            <h3>Fname</h3>
            <p>{user?.fname}</p>
          </div>
          <div className="fd">
            <h3>Lname</h3>
            <p>{user?.lname}</p>
          </div>
          <div className="fd">
            <h3>Gender</h3>
            <p>{user?.gender}</p>
          </div>
          <div className="fd">
            <h3>Username</h3>
            <p>{user?.username}</p>
          </div>
          <div className="fd">
            <h3>Budget</h3>
            <p>{user?.budget}</p>
          </div>
          <div className="fd">
            <h3>Age</h3>
            <p>{user?.age}</p>
          </div>
          <button onClick={() => setModal((prev) => !prev)}>
            Edit Profile
          </button>
          <button onClick={() => setPasswordModule((prev) => !prev)}>
            Edit Password
          </button>
        </div>
      </div>
      {module && (
        <Module bg={"#aaa8"} width={550} close={setModal}>
          <form onSubmit={handleSubmit} className="edit__profile">
            <div className="fd">
              <label htmlFor="fname">Fname</label>
              <input
                id="fname"
                value={formData.fname}
                onChange={handleChange}
                type="text"
                placeholder="Fname"
                name="fname"
              />
            </div>
            <div className="fd">
              <label htmlFor="lname">Lname</label>
              <input
                id="lname"
                value={formData.lname}
                onChange={handleChange}
                type="text"
                placeholder="lname"
                name="lname"
              />
            </div>
            <div className="fd">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                value={formData.username}
                onChange={handleChange}
                type="text"
                name="username"
              />
            </div>

            <div className="fd">
              <label htmlFor="age">Age</label>
              <input
                id="age"
                value={formData.age}
                onChange={handleChange}
                type="text"
                name="age"
              />
            </div>
            <div className="fd">
              <label htmlFor="budget">Budget</label>
              <input
                id="budget"
                value={formData.budget}
                onChange={handleChange}
                type="text"
                name="budget"
              />
            </div>
            <div className="fd">
              <label htmlFor="gender">Gender</label>
              <select
                id="gender"
                value={formData.gender}
                onChange={handleChange}
                name="gender"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <button type="submit">Save</button>
          </form>
        </Module>
      )}
      {passwordModule && (
        <Module bg={"#aaa8"} width={300} close={setPasswordModule}>
          <form
            className="edit__profile__password"
            onSubmit={handlePasswordSubmit}
          >
            <div className="fd">
              <label htmlFor="oldPassword">Old Password</label>
              <input
                id="oldPassword"
                type="password"
                placeholder="Old Password"
                name="oldPassword"
                required
              />
            </div>
            <div className="fd">
              <label htmlFor="newPassword">New Password</label>
              <input
                id="newPassword"
                type="password"
                placeholder="New Password"
                name="newPassword"
                required
              />
            </div>
            <button>Update Password</button>
          </form>
        </Module>
      )}
      <ToastContainer /> 
    </Fragment>
  );
};

export default Profile;
