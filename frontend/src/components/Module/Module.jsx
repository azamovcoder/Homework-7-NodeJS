import "./module.scss";

import React from "react";

function Module({ children, width, close, bg }) {
  return (
    <>
      <div
        style={{ backgroundColor: bg }}
        onClick={() => close(false)}
        className="overlay"
      ></div>

      <div style={{ width }} className="model">
        <button onClick={() => close(false)} className="model__btn"></button>
        {children}
      </div>
    </>
  );
}

export default Module;
