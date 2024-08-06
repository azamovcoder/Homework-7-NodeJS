import "./Home.scss";

import React, { Fragment } from "react";

import { NavLink } from "react-router-dom";
import UsersFront from "../../components/Users/Users";

const Home = () => {
  return (
    <Fragment>
      <div className="container">
        <NavLink to={"/profile"}>Profile</NavLink>
      </div>
      <UsersFront />
    </Fragment>
  );
};

export default Home;
