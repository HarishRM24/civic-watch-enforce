
import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar setIsSidebarOpen={setIsSidebarOpen} />
      <div className="flex flex-1">
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        <main className="flex-1 px-4 sm:px-6 py-8 bg-gray-50">
          <Outlet />
        </main>
      </div>
      <footer className="bg-police-800 text-white p-4 text-center text-sm">
        <div className="container mx-auto">
          <p>© {new Date().getFullYear()} Police Management System. All rights reserved.</p>
          <p className="mt-1">Developed by: Sarvesh Chandran (20MIS0439)</p>
          <p className="mt-1">Contact: sarveshchandran.j2020@vitstudent.ac.in</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
