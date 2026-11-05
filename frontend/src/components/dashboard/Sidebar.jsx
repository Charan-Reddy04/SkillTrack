
import {
    LayoutDashboard,
    Target,
    Map,
    BookOpen,
    Code2,
    Trophy,
    ClipboardCheck,
    Clock,
    BarChart3,
    NotebookPen,
    Settings,
    LogOut,
    GraduationCap,
    X
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "Learning Goals", icon: Target },
    { name: "Roadmap Explorer", icon: Map },
    { name: "Learning Resources", icon: BookOpen },
    { name: "Coding Practice", icon: Code2 },
    { name: "Contest Hub", icon: Trophy },
    { name: "Skill Assessment", icon: ClipboardCheck },
    { name: "Study Tracker", icon: Clock },
    { name: "Analytics & Reports", icon: BarChart3 },
    { name: "Personal Notes", icon: NotebookPen }
];

function Sidebar({
    activePage = "Dashboard",
    onNavigate,
    mobileMenuOpen = false,
    onClose
}) {
    const { logout } = useAuth();

    const handleLogout = () => {
        onClose?.();
        logout();
    };

    return (
        <aside
            className={`
                fixed inset-y-0 left-0 z-50
                flex h-screen w-72 shrink-0 flex-col
                overflow-hidden border-r border-[#EAE6FA]
                bg-white p-5
                transition-transform duration-300 ease-in-out
                lg:sticky lg:top-0 lg:z-40 lg:w-64
                lg:translate-x-0
                ${mobileMenuOpen
                    ? "translate-x-0"
                    : "-translate-x-full"
                }
            `}
        >

            {/* Logo */}
            <div className="mb-9 flex items-center justify-between px-2">

                <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#4930E8] to-[#8739ED] text-white">
                        <GraduationCap size={25} />
                    </div>

                    <div>
                        <h1 className="text-xl font-extrabold text-[#18204D]">
                            Skill<span className="text-[#7045ED]">Track</span>
                        </h1>

                        <p className="text-[10px] text-[#8991B1]">
                            YOUR LEARNING SPACE
                        </p>
                    </div>
                </div>

                {/* Close Button - Mobile Only */}
                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close sidebar"
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-[#68739B] hover:bg-[#F3F0FF] lg:hidden"
                >
                    <X size={21} />
                </button>

            </div>

            {/* Workspace */}
            <p className="mb-3 px-3 text-xs font-bold uppercase tracking-wider text-[#A0A5BD]">
                Workspace
            </p>

            {/* Main Navigation */}
            <nav className="flex-1 space-y-1">

                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const active = activePage === item.name;

                    return (
                        <button
                            key={item.name}
                            onClick={() => onNavigate?.(item.name)}
                            className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium transition ${
                                active
                                    ? "bg-gradient-to-r from-[#5636E8] to-[#8241EC] text-white shadow-lg shadow-purple-200"
                                    : "text-[#68739B] hover:bg-[#F3F0FF] hover:text-[#6036E8]"
                            }`}
                        >
                            <Icon size={19} />
                            {item.name}
                        </button>
                    );
                })}

            </nav>

            {/* Settings and Logout */}
            <div className="mt-4 shrink-0 space-y-2 border-t border-[#EEEAF8] pt-4">

                <button
                    onClick={() => onNavigate?.("Settings")}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium transition ${
                        activePage === "Settings"
                            ? "bg-gradient-to-r from-[#5636E8] to-[#8241EC] text-white"
                            : "text-[#68739B] hover:bg-[#F3F0FF] hover:text-[#6036E8]"
                    }`}
                >
                    <Settings size={19} />
                    Settings
                </button>

                <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium text-red-500 transition hover:bg-red-50"
                >
                    <LogOut size={19} />
                    Logout
                </button>

            </div>

        </aside>
    );
}

export default Sidebar;
