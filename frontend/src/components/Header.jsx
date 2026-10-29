import React from "react";
import { NavLink } from "react-router-dom";

const Header = () => {

  
  return (
    <>
      <header className="sticky top-0 z-50 border-b border-white/15 bg-linear-to-r from-blue-600 via-blue-600/80 to-cyan-500/80 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-2 py-5 text-white">
          <div>
            <span className="text-4xl font-bold text-pink-500">E</span>
            <span className="text-3xl font-bold ">duconnect</span>
          </div>
          <div className="flex gap-6">
            <NavLink className ={({isActive})=>isActive? "text-[18px] underline decoration-pink-600 ":"text-[18px] hover:text-[20px]"} to="/">Home</NavLink>
            <NavLink className ={({isActive})=>isActive? "text-[18px] underline decoration-pink-600 ":"text-[18px] hover:text-[20px]"} to="/about">About</NavLink>
            <NavLink className ={({isActive})=>isActive? "text-[18px] underline decoration-pink-600 ":"text-[18px] hover:text-[20px]"} to="/works">How It work</NavLink>
            <NavLink className ={({isActive})=>isActive? "text-[18px] underline decoration-pink-600 ":"text-[18px] hover:text-[20px]"} to="/features">Features</NavLink>
             <NavLink className ={({isActive})=>isActive? "text-[18px] underline decoration-pink-600 ":"text-[18px] hover:text-[20px]"} to="/team">Team</NavLink>
            <NavLink className ={({isActive})=>isActive? "text-[18px] underline decoration-pink-600 ":"text-[18px] hover:text-[20px]"} to="/contact">contact</NavLink>
          </div>
          <div className="flex gap-3">
            <NavLink className="border-2 rounded-2xl border-transparent px-6 py-2 text-[18px] bg-blue-300 text-black" to="/login">Login</NavLink>
            <NavLink className="border-2 rounded-2xl border-transparent px-10 py-2 text-[18px] bg-white text-black" to="/Register">Register</NavLink>
          </div>
        </nav>
      </header>
    </>
  );
};

export default Header;
