import React from 'react';
import { useAuth0 } from "@auth0/auth0-react"; 
import JSONpretty from "react-json-pretty";

const Profile = () => {
    const { user, isAuthenticated } = useAuth0();
    return (
        isAuthenticated && (

            <div className="json">
                <img src={user.picture} alt={user.name} />
                <h2>{user.name}</h2>
                <p>{user.email}</p>
                <JSONpretty data={user} />

                {/*{JSON.stringify(user, null, 2)}*/}
            </div>
        )
    )
}

export default Profile
