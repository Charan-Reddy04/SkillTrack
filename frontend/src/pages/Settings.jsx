
import { useState, useEffect } from "react";
import {
    UserRound,
    Lock,
    ShieldCheck,
    Save,
    Eye,
    EyeOff,
    CheckCircle
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import settingsService from "../services/settingsService";

function Settings() {
    const { user, updateUser } = useAuth();

    const [profile, setProfile] = useState({
        name: user?.name || "",
        email: user?.email || ""
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    const [showPasswords, setShowPasswords] = useState(false);

    const [profileLoading, setProfileLoading] = useState(false);
    const [passwordLoading, setPasswordLoading] = useState(false);

    const [profileMessage, setProfileMessage] = useState("");
    const [profileError, setProfileError] = useState("");

    const [passwordMessage, setPasswordMessage] = useState("");
    const [passwordError, setPasswordError] = useState("");

    // Keep profile fields synchronized with logged-in user
    useEffect(() => {
        setProfile({
            name: user?.name || "",
            email: user?.email || ""
        });
    }, [user]);

    const handleProfileChange = (e) => {
        setProfile({
            ...profile,
            [e.target.name]: e.target.value
        });
    };

    const handlePasswordChange = (e) => {
        setPasswordData({
            ...passwordData,
            [e.target.name]: e.target.value
        });
    };

    // Update Profile
    const handleProfileSubmit = async (e) => {
        e.preventDefault();

        try {
            setProfileLoading(true);
            setProfileError("");
            setProfileMessage("");

            const response = await settingsService.updateProfile(profile);

            updateUser(response.user);

            setProfileMessage("Profile updated successfully.");

        } catch (error) {
            setProfileError(
                error.response?.data?.message ||
                "Unable to update profile."
            );
        } finally {
            setProfileLoading(false);
        }
    };

    // Change Password
    const handlePasswordSubmit = async (e) => {
        e.preventDefault();

        setPasswordError("");
        setPasswordMessage("");

        if (passwordData.newPassword.length < 6) {
            setPasswordError(
                "New password must contain at least 6 characters."
            );
            return;
        }

        if (
            passwordData.newPassword !==
            passwordData.confirmPassword
        ) {
            setPasswordError("New passwords do not match.");
            return;
        }

        try {
            setPasswordLoading(true);

            await settingsService.changePassword({
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });

            setPasswordMessage(
                "Password changed successfully. Please log in again."
            );

            setPasswordData({
                currentPassword: "",
                newPassword: "",
                confirmPassword: ""
            });

        } catch (error) {
            setPasswordError(
                error.response?.data?.message ||
                "Unable to change password."
            );
        } finally {
            setPasswordLoading(false);
        }
    };

    const inputClass =
        "w-full rounded-xl border border-[#D9D5FA] px-4 py-3 outline-none transition focus:border-[#7045ED] focus:ring-2 focus:ring-purple-100";

    const labelClass =
        "mb-2 block text-sm font-semibold text-[#39436D]";

    const cardClass =
        "rounded-2xl border border-[#EAE6FA] bg-white p-5 shadow-sm md:p-7";

    return (
        <div className="min-h-screen bg-[#F5F3FF]">
            <div className="mx-auto max-w-6xl px-4 py-6 md:px-8 md:py-8">

                {/* Page Heading */}
                <div className="mb-8 overflow-hidden rounded-3xl bg-gradient-to-r from-[#3820A8] via-[#6435D9] to-[#9148E9] p-6 text-white shadow-lg md:p-8">

                    <p className="mb-2 text-sm text-purple-100">
                        MANAGE YOUR ACCOUNT
                    </p>

                    <h1 className="text-3xl font-extrabold md:text-4xl">
                        Settings
                    </h1>

                    <p className="mt-2 text-sm text-purple-100">
                        Manage your profile and keep your account secure.
                    </p>
                </div>

                {/* Account Information */}
                <div className={`${cardClass} mb-7`}>

                    <div className="mb-5 flex items-center gap-3">

                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
                            <ShieldCheck size={24} />
                        </div>

                        <div>
                            <h2 className="text-xl font-bold text-[#18204D]">
                                Account Information
                            </h2>

                            <p className="text-sm text-[#8991B1]">
                                Your SkillTrack account details
                            </p>
                        </div>

                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                        <div className="rounded-xl bg-[#F8F6FF] p-4">
                            <p className="text-sm text-[#8991B1]">
                                Account Name
                            </p>

                            <p className="mt-1 break-words font-semibold text-[#18204D]">
                                {user?.name || "Not available"}
                            </p>
                        </div>

                        <div className="rounded-xl bg-[#F8F6FF] p-4">
                            <p className="text-sm text-[#8991B1]">
                                Email Address
                            </p>

                            <p className="mt-1 break-words font-semibold text-[#18204D]">
                                {user?.email || "Not available"}
                            </p>
                        </div>

                    </div>
                </div>

                {/* Profile and Password - Side by Side */}
                <div className="grid grid-cols-1 items-start gap-7 lg:grid-cols-2">

                    {/* Update Profile */}
                    <div className={cardClass}>

                        <div className="mb-6 flex items-center gap-3">

                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
                                <UserRound size={24} />
                            </div>

                            <div>
                                <h2 className="text-xl font-bold text-[#18204D]">
                                    Update Profile
                                </h2>

                                <p className="text-sm text-[#8991B1]">
                                    Update your personal information
                                </p>
                            </div>

                        </div>

                        {profileMessage && (
                            <div className="mb-5 flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-700">
                                <CheckCircle size={18} />
                                {profileMessage}
                            </div>
                        )}

                        {profileError && (
                            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                                {profileError}
                            </div>
                        )}

                        <form
                            onSubmit={handleProfileSubmit}
                            className="space-y-5"
                        >

                            <div>
                                <label className={labelClass}>
                                    Full Name
                                </label>

                                <input
                                    type="text"
                                    name="name"
                                    value={profile.name}
                                    onChange={handleProfileChange}
                                    placeholder="Enter your name"
                                    required
                                    className={inputClass}
                                />
                            </div>

                            <div>
                                <label className={labelClass}>
                                    Email Address
                                </label>

                                <input
                                    type="email"
                                    name="email"
                                    value={profile.email}
                                    onChange={handleProfileChange}
                                    placeholder="Enter your email"
                                    required
                                    className={inputClass}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={profileLoading}
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#5636E8] to-[#8241EC] px-6 py-3 font-semibold text-white shadow-md transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                <Save size={18} />

                                {profileLoading
                                    ? "Updating..."
                                    : "Save Profile"}
                            </button>

                        </form>
                    </div>

                    {/* Change Password */}
                    <div className={cardClass}>

                        <div className="mb-6 flex items-center gap-3">

                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                                <Lock size={24} />
                            </div>

                            <div>
                                <h2 className="text-xl font-bold text-[#18204D]">
                                    Change Password
                                </h2>

                                <p className="text-sm text-[#8991B1]">
                                    Keep your account secure
                                </p>
                            </div>

                        </div>

                        {passwordMessage && (
                            <div className="mb-5 flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-700">
                                <CheckCircle size={18} />
                                {passwordMessage}
                            </div>
                        )}

                        {passwordError && (
                            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                                {passwordError}
                            </div>
                        )}

                        <form
                            onSubmit={handlePasswordSubmit}
                            className="space-y-5"
                        >

                            <div>
                                <label className={labelClass}>
                                    Current Password
                                </label>

                                <input
                                    type={showPasswords ? "text" : "password"}
                                    name="currentPassword"
                                    value={passwordData.currentPassword}
                                    onChange={handlePasswordChange}
                                    placeholder="Enter current password"
                                    required
                                    className={inputClass}
                                />
                            </div>

                            <div>
                                <label className={labelClass}>
                                    New Password
                                </label>

                                <input
                                    type={showPasswords ? "text" : "password"}
                                    name="newPassword"
                                    value={passwordData.newPassword}
                                    onChange={handlePasswordChange}
                                    placeholder="Enter new password"
                                    minLength={6}
                                    required
                                    className={inputClass}
                                />
                            </div>

                            <div>
                                <label className={labelClass}>
                                    Confirm New Password
                                </label>

                                <input
                                    type={showPasswords ? "text" : "password"}
                                    name="confirmPassword"
                                    value={passwordData.confirmPassword}
                                    onChange={handlePasswordChange}
                                    placeholder="Confirm new password"
                                    minLength={6}
                                    required
                                    className={inputClass}
                                />
                            </div>

                            <label className="flex cursor-pointer items-center gap-2 text-sm text-[#68739B]">

                                <input
                                    type="checkbox"
                                    checked={showPasswords}
                                    onChange={(e) =>
                                        setShowPasswords(e.target.checked)
                                    }
                                    className="h-4 w-4 accent-purple-600"
                                />

                                Show passwords

                                {showPasswords ? (
                                    <EyeOff size={16} />
                                ) : (
                                    <Eye size={16} />
                                )}

                            </label>

                            <button
                                type="submit"
                                disabled={passwordLoading}
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#5636E8] to-[#8241EC] px-6 py-3 font-semibold text-white shadow-md transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                <Lock size={18} />

                                {passwordLoading
                                    ? "Changing..."
                                    : "Change Password"}
                            </button>

                        </form>
                    </div>

                </div>

            </div>
        </div>
    );
}

export default Settings;
