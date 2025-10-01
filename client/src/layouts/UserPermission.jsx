import React from 'react'
import { useSelector } from'react-redux'
const UserPermission = ({ children }) => {
    const user = useSelector(state => state.user)
    return (
        <>
            {
                user._id ? children : <p>Login to view this page.</p>
            }
        </>
    )
}

export default UserPermission
