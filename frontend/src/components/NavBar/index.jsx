const NavBar = ({ isLoggedIn }) => {
    const onLogout = () => {
        localStorage.removeItem("token");
        window.location.href = "/login";
    }



    return (
        <nav className="bg-white shadow-md p-4">
            <div className="max-w-6xl mx-auto flex justify-between items-center">
                <h1 className="text-xl font-bold text-gray-800">TradeRiser</h1>
                <div className="space-x-4">
                    {
                        isLoggedIn ?
                            <>
                                <a href="/portfolio" className="text-gray-600 hover:text-blue-500">Portfolio</a>
                                <a href="/analyze" className="text-gray-600 hover:text-blue-500">Analyze</a>
                                <a href="/trade" className="text-gray-600 hover:text-blue-500">Trade</a>
                                <a id="logoutBtn" className="text-gray-600 hover:text-red-500 font-semibold" onClick={onLogout}>Logout</a>
                            </>
                        : <a href="/login" className="text-gray-600 hover:text-blue-500">Log in</a>
                    }
                </div>
            </div>
        </nav>
    )
}

export default NavBar