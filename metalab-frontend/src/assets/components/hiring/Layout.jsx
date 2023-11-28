import { Outlet } from "react-router-dom";
import Navbar from "./NavbarHiring";


function Layout() {
    return (
        <>
            <div className="mb-5">
                <Navbar />
            </div>

            <main>
                <Outlet />
            </main>
        </>
    )
}

export default Layout;