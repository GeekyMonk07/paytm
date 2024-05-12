export const Appbar = () => {
    const firstName = localStorage.getItem('firstName');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('firstName');
        window.location.href = '/signin';
    }
    
    return <div className="shadow h-14 flex justify-between">
        <div className="flex flex-col justify-center h-full ml-4">
            GEEKPAY
        </div>
        <div className="flex">
            <div className="flex flex-col justify-center h-full mr-4">
                Hello👋 {firstName}
            </div>
            <div className="flex flex-col justify-center h-full mr-4">
                <button onClick={handleLogout} className="bg-slate-200 text-black hover:bg-red-500 hover:text-white px-4 py-1 rounded">Logout</button>
            </div>
        </div>
    </div>
}