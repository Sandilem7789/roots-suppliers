import React from 'react';
import { useAuth0 } from "@auth0/auth0-react"; 
import JSONpretty from "react-json-pretty";

const Profile = () => {
    const { user } = useAuth0();
    return (
            
        <div className="json">
            <JSONpretty data={user} />

            {/*{JSON.stringify(user, null, 2)}*/}
        </div>
    )
}

export default Profile
