import React from 'react';
import { useAuth0 } from "@auth0/auth0-react";          //hook from auth0

const LogoutButton = () => {
    const { logout, isAuthenticated } = useAuth0();
    return (
        isAuthenticated && (
            <button onClick={() => logout()}>
                Logout
            </button>
        )
    )
}

export default LogoutButton
