
import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import Sidebar from "../dashboard/Sidebar";

function AppLayout() {
    const navigate = useNavigate();
    const location = useLocation();

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const pageNames = {
        "/dashboard": "Dashboard",
        "/learning-goals": "Learning Goals",
        "/roadmap-explorer": "Roadmap Explorer",
        "/learning-resources": "Learning Resources",
        "/coding-practice": "Coding Practice",
        "/contest-hub": "Contest Hub",
        "/skill-assessment": "Skill Assessment",
        "/study-tracker": "Study Tracker",
        "/analytics": "Analytics & Reports",
        "/personal-notes": "Personal Notes",
        "/settings": "Settings"
    };

    const activePage = pageNames[location.pathname] || "Dashboard";

    const handleNavigate = (page) => {
        const routes = {
            "Dashboard": "/dashboard",
            "Learning Goals": "/learning-goals",
            "Roadmap Explorer": "/roadmap-explorer",
            "Learning Resources": "/learning-resources",
            "Coding Practice": "/coding-practice",
            "Contest Hub": "/contest-hub",
            "Skill Assessment": "/skill-assessment",
            "Study Tracker": "/study-tracker",
            "Analytics & Reports": "/analytics",
            "Personal Notes": "/personal-notes",
            "Settings": "/settings"
        };

        if (routes[page]) {
            navigate(routes[page]);
            setMobileMenuOpen(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-[#F5F3FF]">

            {/* Mobile Overlay */}
            {mobileMenuOpen && (
                <button
                    type="button"
                    aria-label="Close navigation menu"
                    onClick={() => setMobileMenuOpen(false)}
                    className="fixed inset-0 z-40 bg-black/40 lg:hidden"
                />
            )}

            {/* Sidebar */}
            <Sidebar
                activePage={activePage}
                onNavigate={handleNavigate}
                mobileMenuOpen={mobileMenuOpen}
                onClose={() => setMobileMenuOpen(false)}
            />

            {/* Main Content */}
            <main className="min-h-screen min-w-0 flex-1">

                {/* Mobile Header */}
                <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[#EAE6FA] bg-white px-4 shadow-sm lg:hidden">

                    <div className="flex items-center gap-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[#4930E8] to-[#8739ED] text-white">
                            <span className="text-lg font-bold">S</span>
                        </div>

                        <span className="text-lg font-extrabold text-[#18204D]">
                            Skill<span className="text-[#7045ED]">Track</span>
                        </span>
                    </div>

                    <button
                        type="button"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                        className="flex h-10 w-10 items-center justify-center rounded-xl text-[#6036E8] transition hover:bg-[#F3F0FF]"
                    >
                        {mobileMenuOpen ? (
                            <X size={24} />
                        ) : (
                            <Menu size={24} />
                        )}
                    </button>

                </header>

                <Outlet />

            </main>
        </div>
    );
}

export default AppLayout;
