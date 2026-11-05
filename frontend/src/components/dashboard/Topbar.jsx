import { Bell, Search, UserCircle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

function Topbar() {
    const { user } = useAuth();

    const firstName = user?.name?.split(" ")[0] || "Student";

    return (
        <header className="bg-white border-b border-[#EAE6FA] px-5 md:px-8 py-4 flex items-center justify-between gap-4">

            <div>
                <h2 className="text-xl font-bold text-[#18204D]">
                    Dashboard
                </h2>
                <p className="text-xs text-[#8991B1] mt-1">
                    Your personal learning overview
                </p>
            </div>

            <div className="flex items-center gap-3">

                <div className="hidden md:flex items-center bg-[#F7F5FF] rounded-xl px-3 py-2 w-60">
                    <Search size={17} className="text-[#9299B5]" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="bg-transparent outline-none ml-2 w-full text-sm text-[#27315D]"
                    />
                </div>

                <button
                    type="button"
                    aria-label="Notifications"
                    className="w-10 h-10 rounded-xl bg-[#F5F2FF] flex items-center justify-center text-[#7045ED]"
                >
                    <Bell size={19} />
                </button>

                <div className="flex items-center gap-2 pl-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6540E8] to-[#A35BF0] flex items-center justify-center text-white font-bold">
                        {firstName.charAt(0).toUpperCase()}
                    </div>

                    <div className="hidden sm:block">
                        <p className="text-sm font-semibold text-[#18204D]">
                            {firstName}
                        </p>
                        <p className="text-xs text-[#9299B5]">
                            Student
                        </p>
                    </div>
                </div>

            </div>
        </header>
    );
}

export default Topbar;