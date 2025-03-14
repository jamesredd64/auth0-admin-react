import { Routes, Route } from "react-router-dom";
import { useAuth0 } from '@auth0/auth0-react';
import { useGlobalStorage } from './hooks/useGlobalStorage';
import AppLayout from "./layout/AppLayout";
// import { MetadataDebugger } from './components/MetadataDebugger';
import { useEffect } from 'react';
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import Calendar from "./pages/Calendar";
import TestMongoDB from './pages/TestMongoDB';

// import { ScrollToTop } from "./components/common/ScrollToTop";
 import Home from "./pages/Dashboard/Home";
import React from "react";


interface UserMetadata {
  adBudget: number;
  costPerAcquisition: number;
  dailySpendingLimit: number;
  marketingChannels: string;
  monthlyBudget: number;
  preferredPlatforms: string;
  notificationPreferences: boolean;
  roiTarget: number;
  name: string;
  nickname: string;
  roles: string[];
  email: string;
  picture: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  industry: string;
  dateOfBirth: string;
  gender: string;
  bio: string;
  company: string;
  position: string;
  profilePictureUrl: string;
  marketingBudget: {
    amount: number;
    frequency: string;
    adCosts: number;
  };
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    taxId: string;
  };
  auth0Id: string;
}

function App() {
  const { isLoading, isAuthenticated, error, user } = useAuth0();
  const [, setUserMetadata] = useGlobalStorage<UserMetadata | null>('userMetadata', null);

  console.log("App render - Auth state:", { isLoading, isAuthenticated, error });

  useEffect(() => {
    if (isAuthenticated && user) {
      const namespace = 'https://dev-uizu7j8qzflxzjpy.jr.com';
      
      const metadata: UserMetadata = {
        // Basic user info
        name: user.name || '',
        nickname: user.nickname || '',
        email: user.email || '',
        picture: user.picture || '',
        firstName: user[`${namespace}/firstName`] || '',
        lastName: user[`${namespace}/lastName`] || '',
        phoneNumber: user[`${namespace}/phoneNumber`] || '',
        roles: user[`${namespace}/roles`] || [],
        auth0Id: user.sub || '',
        
        // Business/Marketing fields
        adBudget: Number(user[`${namespace}/adBudget`]) || 0,
        costPerAcquisition: Number(user[`${namespace}/costPerAcquisition`]) || 0,
        dailySpendingLimit: Number(user[`${namespace}/dailySpendingLimit`]) || 0,
        marketingChannels: user[`${namespace}/marketingChannels`] || '',
        monthlyBudget: Number(user[`${namespace}/monthlyBudget`]) || 0,
        preferredPlatforms: user[`${namespace}/preferredPlatforms`] || '',
        notificationPreferences: Boolean(user[`${namespace}/notificationPreferences`]),
        roiTarget: Number(user[`${namespace}/roiTarget`]) || 0,
        industry: user[`${namespace}/industry`] || '',

        // Profile details
        dateOfBirth: user[`${namespace}/dateOfBirth`] || '',
        gender: user[`${namespace}/gender`] || '',
        bio: user[`${namespace}/bio`] || '',
        company: user[`${namespace}/company`] || '',
        position: user[`${namespace}/position`] || '',
        profilePictureUrl: user[`${namespace}/profilePictureUrl`] || user.picture || '',

        // Complex objects
        marketingBudget: JSON.parse(user[`${namespace}/marketingBudget`] || '{"amount":0,"frequency":"monthly","adCosts":0}'),
        address: JSON.parse(user[`${namespace}/address`] || '{"street":"","city":"","state":"","zipCode":"","country":"","taxId":""}')
      };

      setUserMetadata(metadata);
    }
  }, [isAuthenticated, user, setUserMetadata]);

  if (isLoading) {
    console.log("Loading...");
    return <div>Loading...</div>;
  }

  if (error) {
    console.log("Error:", error.message);
    return <div>Oops... {error.message}</div>;
  }

  return (
    <div className="dark:bg-boxdark-2 dark:text-bodydark">
      <div className="flex h-screen overflow-hidden">
        <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
          <Routes>
          <Route element={<AppLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Home />} />
              <Route path="/profile" element={<UserProfiles />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/avatars" element={<Avatars />} />
              <Route path="/badge" element={<Badges />} />
              <Route path="/buttons" element={<Buttons />} />
              <Route path="/images" element={<Images />} />
              <Route path="/videos" element={<Videos />} />
              <Route path="/line-chart" element={<LineChart />} />
              <Route path="/bar-chart" element={<BarChart />} />
              <Route path="/test-mongodb" element={<TestMongoDB />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
      {/* <MetadataDebugger /> */}
    </div>
   
  
  );
}

export default App;




// import { Routes, Route } from "react-router-dom";
// import { useAuth0 } from '@auth0/auth0-react';
// import AppLayout from "./layout/AppLayout";
// import SignedOut from "./pages/SignedOut";
// import Home from "./pages/Dashboard/Home";
// import UserProfiles from "./pages/UserProfiles";
// import Videos from "./pages/UiElements/Videos";
// import Images from "./pages/UiElements/Images";
// import Alerts from "./pages/UiElements/Alerts";
// import Badges from "./pages/UiElements/Badges";
// import Avatars from "./pages/UiElements/Avatars";
// import Buttons from "./pages/UiElements/Buttons";
// import LineChart from "./pages/Charts/LineChart";
// import BarChart from "./pages/Charts/BarChart";
// import Calendar from "./pages/Calendar";
// // import BasicTables from "./pages/Tables/BasicTables";
// // import FormElements from "./pages/Forms/FormElements";
// // import Blank from "./pages/Blank";

// // import { ScrollToTop } from "./components/common/ScrollToTop";
// import NotFound from "./pages/OtherPage/NotFound";
// import React from "react";

// function App() {
//   const { isLoading, isAuthenticated, error } = useAuth0();

//   if (isLoading) {
//     return <div className="flex h-screen items-center justify-center">Loading...</div>;
//   }

//   if (error) {
//     return <div className="flex h-screen items-center justify-center">Oops... {error.message}</div>;
//   }

//   if (!isAuthenticated) {
//     return <SignedOut />;
//   }

//   return (
//     <div className="dark:bg-boxdark-2 dark:text-bodydark">
//       <div className="flex h-screen overflow-hidden">
//         <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
//           <Routes>
//             <Route element={<AppLayout />}>
//               <Route path="/" element={<Home />} />
//               <Route path="/dashboard" element={<Home />} />
//               <Route path="/profile" element={<UserProfiles />} />
//               <Route path="/calendar" element={<Calendar />} />
//               <Route path="/alerts" element={<Alerts />} />
//               <Route path="/avatars" element={<Avatars />} />
//               <Route path="/badge" element={<Badges />} />
//               <Route path="/buttons" element={<Buttons />} />
//               <Route path="/images" element={<Images />} />
//               <Route path="/videos" element={<Videos />} />
//               <Route path="/line-chart" element={<LineChart />} />
//               <Route path="/bar-chart" element={<BarChart />} />
//             </Route>
//             <Route path="*" element={<NotFound />} />
//           </Routes>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default App;
