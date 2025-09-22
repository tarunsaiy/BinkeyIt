import React from 'react'
import { useSelector } from 'react-redux'
import isAdmin from '../utils/isAdmin.js'

const AdminPermission = ({ children }) => {
    const user = useSelector(state => state.user)
    return (
        <>
            {
                isAdmin(user.role) ? children : <p>Access Denied</p>
            }
        </>
    )
}

export default AdminPermission;
