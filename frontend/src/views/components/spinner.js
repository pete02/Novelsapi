import React from "react";
import "./spinner.css";

export default function LoadingSpinner() {
    console.log("spin")
  return (
    <div className="spinner-container">
      <div className="loading-spinner"></div>
    </div>
  );
}