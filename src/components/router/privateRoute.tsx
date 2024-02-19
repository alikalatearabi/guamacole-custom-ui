import React, {ReactElement, Suspense} from 'react';
import {Navigate, Outlet} from 'react-router-dom';
import Layout from "../layout";

const PrivateRoute: React.FC<{ children: ReactElement | undefined }> = ({children}) => {

    const token = localStorage.getItem('token')
    let hasPermission: boolean = false
    hasPermission = !!token;

    const renderContent = () => {
        if (hasPermission) return children || <Outlet/>
    }

    if (!hasPermission) return (<Navigate to="/login" replace/>)

    return (
        <Layout>
            <Suspense>{renderContent()}</Suspense>
        </Layout>
    );
}

export default PrivateRoute;