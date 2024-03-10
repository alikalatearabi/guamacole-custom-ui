import React, {ReactElement, Suspense} from 'react';
import {Navigate, Outlet, useLocation} from 'react-router-dom';
import Layout from "../layout";
import {useRecoilValue} from "recoil";
import {permissionAtom} from "../../recoil/atom/permissionAtom.ts";

const PrivateRoute: React.FC<{ children: ReactElement | undefined }> = ({children}) => {

    const permissions = useRecoilValue(permissionAtom)
    const username = localStorage.getItem('user')
    const {pathname} = useLocation()

    const token = localStorage.getItem('token')
    let hasPermission: boolean = false
    hasPermission = !!token;

    const permissionToRoute = () => {
        if (pathname === '/panel/users' && Object.keys(permissions.userPermissions).length > 0) {
            return permissions.userPermissions[username].includes('ADMINISTER')
        } else return true
    }

    const renderContent = () => {
        if (hasPermission && permissionToRoute()) return children || <Outlet/>
        else if (!permissionToRoute())
            return (<Navigate to={'/panel/accessdenied'} replace/>)
    }

    if (!hasPermission) return (<Navigate to="/login" replace/>)

    return (
        <Layout>
            <Suspense>{renderContent()}</Suspense>
        </Layout>
    );
}

export default PrivateRoute;