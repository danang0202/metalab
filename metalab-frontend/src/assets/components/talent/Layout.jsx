import { Outlet } from "react-router-dom";
import NavbarTalent from "./NavbarTalent"
import Footer from "./Footer";
import { useEffect } from "react";
import Cookies from 'js-cookie';
import { useNavigate } from "react-router-dom";



function Layout() {
    const navigate = useNavigate();
    useEffect(() => {
        if (Cookies.get('role_metalab') && Cookies.get('role_metalab') !== 'talent') {
            navigate('/admin/talent') // kalau role sebagai admin --> diarahkan ke  halaman admin
        }
    }, [])
    return (
        <>
            <NavbarTalent />
            <Outlet />
            <Footer />
        </>

    )

}

export default Layout;