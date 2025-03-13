import { useEffect, useState } from "react";
import { Route, Routes, useLocation, Navigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

import Loader from "./common/Loader";
import PageTitle from "./components/PageTitle";
import SignIn from "./pages/Authentication/SignIn";
import SignUp from "./pages/Authentication/SignUp";
import Calendar from "./pages/Calendar";
import Chart from "./pages/Chart";
import ECommerce from "./pages/Dashboard/ECommerce";
import FormElements from "./pages/Form/FormElements";
import FormLayout from "./pages/Form/FormLayout";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Tables from "./pages/Tables";
import Alerts from "./pages/UiElements/Alerts";
import Buttons from "./pages/UiElements/Buttons";
import DefaultLayout from "./layout/DefaultLayout";

// Protected Route wrapper component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      loginWithRedirect();
    }
  }, [isAuthenticated, isLoading, loginWithRedirect]);

  if (isLoading) {
    return <Loader />;
  }

  return isAuthenticated ? <>{children}</> : null;
};

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();
  const { isAuthenticated } = useAuth0();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <DefaultLayout>
      <Routes>
        <Route
          index
          element={
            <>
              <PageTitle title="eCommerce Dashboard | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <ECommerce />
            </>
          }
        />

        {/* Protected Routes */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <PageTitle title="Profile | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <PageTitle title="Settings | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <Settings />
            </ProtectedRoute>
          }
        />

        {/* Public Routes */}
        <Route
          path="/auth/signin"
          element={
            isAuthenticated ? (
              <Navigate to="/profile" replace />
            ) : (
              <>
                <PageTitle title="Signin | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <SignIn />
              </>
            )
          }
        />

        <Route
          path="/auth/signup"
          element={
            isAuthenticated ? (
              <Navigate to="/profile" replace />
            ) : (
              <>
                <PageTitle title="Signup | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <SignUp />
              </>
            )
          }
        />

        {/* Other existing routes... */}
        <Route
          path="/calendar"
          element={
            <>
              <PageTitle title="Calendar | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <Calendar />
            </>
          }
        />
        <Route
          path="/forms/form-elements"
          element={
            <>
              <PageTitle title="Form Elements | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <FormElements />
            </>
          }
        />
        <Route
          path="/forms/form-layout"
          element={
            <>
              <PageTitle title="Form Layout | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <FormLayout />
            </>
          }
        />
        <Route
          path="/tables"
          element={
            <>
              <PageTitle title="Tables | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <Tables />
            </>
          }
        />
        <Route
          path="/chart"
          element={
            <>
              <PageTitle title="Basic Chart | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <Chart />
            </>
          }
        />
        <Route
          path="/ui/alerts"
          element={
            <>
              <PageTitle title="Alerts | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <Alerts />
            </>
          }
        />
        <Route
          path="/ui/buttons"
          element={
            <>
              <PageTitle title="Buttons | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <Buttons />
            </>
          }
        />
        <Route
          path="/auth/signin"
          element={
            <>
              <PageTitle title="Signin | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <SignIn />
            </>
          }
        />
        <Route
          path="/auth/signup"
          element={
            <>
              <PageTitle title="Signup | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <SignUp />
            </>
          }
        />
      </Routes>
    </DefaultLayout>
  );
}

export default App;

// import { useEffect } from "react";
// import { useAuth0 } from "@auth0/auth0-react";
// import {
//   Routes,
//   Route,
//   Link,
//   useLocation,
//   useNavigate,
// } from "react-router-dom";
// import { useAuth0UserMetadata } from "./hooks/useAuth0UserMetadata";
// import LogoutButton from "./components/LogoutButton";
// import Profile from "./pages/Profile";
// import "./App.css";

// function App() {
//   const {
//     isAuthenticated,
//     loginWithRedirect,
//     user,
//     isLoading: authLoading,
//     error: authError,
//   } = useAuth0();
//   const {
//     userMetadata,
//     isLoading: metadataLoading,
//     error: metadataError,
//   } = useAuth0UserMetadata();
//   const location = useLocation();
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (!authLoading && !isAuthenticated && location.pathname !== "/") {
//       navigate("/");
//     }
//   }, [authLoading, isAuthenticated, location, navigate]);

//   if (authLoading || metadataLoading) {
//     return <div>Loading...</div>;
//   }

//   if (authError || metadataError) {
//     return <div>Error: {(authError || metadataError)?.message}</div>;
//   }

//   if (!isAuthenticated) {
//     return <button onClick={() => loginWithRedirect()}>Log In</button>;
//   }

//   return (
//     <div className="app-container p-4">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold">
//           <Link to="/" className="hover:text-primary">
//             Dashboard
//           </Link>
//         </h1>
//         <div className="flex gap-4">
//           <Link
//             to="/profile"
//             className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-all"
//           >
//             Profile
//           </Link>
//           <LogoutButton />
//         </div>
//       </div>

//       <Routes>
//         <Route path="/profile" element={<Profile />} />
//         <Route
//           path="/"
//           element={
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div className="bg-boxdark p-6 rounded-lg shadow-md">
//                 <h2 className="text-xl font-semibold mb-4 text-white">
//                   User Profile
//                 </h2>
//                 <pre className="bg-black bg-opacity-50 p-4 rounded text-white overflow-auto">
//                   {JSON.stringify(user, null, 2)}
//                 </pre>
//               </div>

//               <div className="bg-boxdark p-6 rounded-lg shadow-md">
//                 <h2 className="text-xl font-semibold mb-4 text-white">
//                   User Metadata
//                 </h2>
//                 <pre className="bg-black bg-opacity-50 p-4 rounded text-white overflow-auto">
//                   {JSON.stringify(userMetadata, null, 2)}
//                 </pre>
//               </div>
//             </div>
//           }
//         />
//       </Routes>
//     </div>
//   );
// }

// export default App;
