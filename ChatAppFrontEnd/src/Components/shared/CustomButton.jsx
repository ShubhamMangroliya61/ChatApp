import React from "react";
import { Link } from "react-router-dom";
const CustomButton = ({
    type = "button",
    title,
    onClick,
    route,
    className = "",
}) => {
    return (
        <button
            className={className}
            variant="contained"
            type={type}
            onClick={onClick}
        >
            {route ? <Link to={route}>{title}</Link> : <span>{title}</span>}
        </button>
    );
};

export default CustomButton;
