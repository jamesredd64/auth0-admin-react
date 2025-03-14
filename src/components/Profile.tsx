// import { useAuth0 } from '@auth0/auth0-react';
// import { useEffect, useState } from 'react';
// import { auth0M2MService } from '../services/auth0M2M';

// interface UserMetadata {
//   user_id: string;
//   email: string;
//   roles: Array<{
//     id: string;
//     name: string;
//     description?: string;
//   }>;
//   user_metadata: Record<string, any>;
//   app_metadata: Record<string, any>;
//   [key: string]: any;
// }

// export const Profile = () => {
//   const { user, getIdTokenClaims } = useAuth0();
//   const [userMetadata, setUserMetadata] = useState<UserMetadata | null>(null);
//   const [tokenRoles, setTokenRoles] = useState<string[]>([]);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const getUserMetadata = async () => {
//       try {
//         if (!user?.sub) {
//           console.log('No user ID available');
//           return;
//         }

//         // Get roles from token claims
//         const claims = await getIdTokenClaims();
//         const rolesFromToken = claims?.['https://dev-uizu7j8qzflxzjpy.us.auth0.com/roles'] || [];
//         setTokenRoles(rolesFromToken);

//         // Get user metadata and roles from Management API
//         console.log('Fetching metadata for user:', user.sub);
//         const metadata = await auth0M2MService.getUserMetadata(user.sub);
//         console.log('Metadata received:', metadata);
//         setUserMetadata(metadata);
//         setError(null);
//       } catch (error) {
//         const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
//         console.error('Error fetching user metadata:', errorMessage);
//         setError(errorMessage);
//       }
//     };

//     getUserMetadata();
//   }, [user?.sub, getIdTokenClaims]);

//   if (error) {
//     return <div>Error: {error}</div>;
//   }

//   return (
//     <div>
//       <h2>Profile Information</h2>
//       <pre>{JSON.stringify(user, null, 2)}</pre>
      
//       <h2>Roles from Token</h2>
//       <pre>{JSON.stringify(tokenRoles, null, 2)}</pre>
      
//       <h2>User Metadata and Roles (via M2M)</h2>
//       {userMetadata ? (
//         <div>
//           <h3>Basic Info</h3>
//           <pre>{JSON.stringify({
//             email: userMetadata.email,
//             name: userMetadata.name,
//             nickname: userMetadata.nickname
//           }, null, 2)}</pre>
          
//           <h3>Roles</h3>
//           <ul>
//             {userMetadata.roles?.map(role => (
//               <li key={role.id}>
//                 {role.name} {role.description && `- ${role.description}`}
//               </li>
//             ))}
//           </ul>
          
//           <h3>Full Metadata</h3>
//           <pre>{JSON.stringify(userMetadata, null, 2)}</pre>
//         </div>
//       ) : (
//         <p>Loading metadata...</p>
//       )}
//     </div>
//   );
// };

// export default Profile;