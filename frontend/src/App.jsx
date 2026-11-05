
import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";

import Dashboard from "./pages/Dashboard";
import LearningGoals from "./pages/LearningGoals";
import RoadmapExplorer from "./pages/RoadmapExplorer";
import LearningResources from "./pages/LearningResources";
import CodingPractice from "./pages/CodingPractice";
import ContestHub from "./pages/ContestHub";
import SkillAssessment from "./pages/SkillAssessment";
import StudyTracker from "./pages/StudyTracker";
import Analytics from "./pages/Analytics";
import PersonalNotes from "./pages/PersonalNotes";
import Settings from "./pages/Settings";
import ProtectedRoute from "./components/ProtectedRoute";
import AppLayout from "./components/layout/AppLayout";

function App() {
    return (
        <Routes>
            {/* Public pages */}
            <Route
                path="/"
                element={<Navigate to="/login" replace />}
            />

            <Route
                path="/login"
                element={<Login />}
            />

            <Route
                path="/register"
                element={<Register />}
            />

            {/* Protected pages with shared sidebar */}
            <Route
                element={
                    <ProtectedRoute>
                        <AppLayout />
                    </ProtectedRoute>
                }
            >
                <Route
                    path="/dashboard"
                    element={<Dashboard />}
                />

                <Route
                    path="/learning-goals"
                    element={<LearningGoals />}
                />

                <Route
                    path="/roadmap-explorer"
                    element={<RoadmapExplorer />}
                />

                <Route
                    path="/learning-resources"
                    element={<LearningResources />}
                />

                <Route
                    path="/coding-practice"
                    element={<CodingPractice />}
                />

                <Route
                    path="/contest-hub"
                    element={<ContestHub />}
                />

                <Route
                    path="/skill-assessment"
                    element={<SkillAssessment />}
                />

                <Route
                    path="/study-tracker"
                    element={<StudyTracker />}
                />

                <Route
                    path="/analytics"
                    element={<Analytics />}
                />
                <Route
    path="/personal-notes"
    element={<PersonalNotes />}
/>
<Route path="/settings" element={<Settings />} />
            </Route>

            {/* Unknown pages */}
            <Route
                path="*"
                element={<Navigate to="/login" replace />}
            />
        </Routes>
    );
}

export default App;
