import React from "react";

function Alert(props) {
  if (props.message) return <div className="alert">{props.message}</div>;
  else return null;
}

export default Alert;
