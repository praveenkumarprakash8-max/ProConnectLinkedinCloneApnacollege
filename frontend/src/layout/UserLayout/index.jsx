import React from "react";
import NavbarComponent from "../../Component/Navbar/navbar";

export default function UserLayout({ children }) {
  return (
    <div>
      <NavbarComponent />
      {children}
    </div>
  );
}
