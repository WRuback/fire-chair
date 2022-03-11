import React from "react";
import logo from "../Header/Firechair_Logo.png"
import "./style.css"

const Logo = () => {

    return (
        <div className="logo-container">
            <div className="logo-avatar">
                <a href="/">
                    <img src={logo} width={90} height={90} alt="Logo" />
                </a>
            </div>

        </div>



    )
}
export default Logo