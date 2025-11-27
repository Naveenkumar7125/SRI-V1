import React from "react";
import "./rightsidebar.css";
import Operations from "./rightsidecomponents/operations";
import Agent from "./rightsidecomponents/agent";

const RightSidebar = () => {
  return (
    <aside className="right-sidebar">
      <Operations />
      <Agent />
    </aside>
  );
};

export default RightSidebar;
