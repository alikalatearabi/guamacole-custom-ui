import './App.css'
import Dashboard from "./pages/dashboard";
import {Navigate, Route, Routes, useLocation} from "react-router-dom";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import Active from "./pages/active";
import History from "./pages/history";
import Users from "./pages/users";
import Groups from "./pages/groups";
import Connections from "./pages/connections";
import Login from "./pages/login";
import Terminal from "./pages/terminal";
import PrivateRoute from "./components/router/privateRoute.tsx";
import 'primeicons/primeicons.css';


function App() {

    function NoMatch() {
        const location = useLocation();
        return (
            <div>
                <h3>
                    No match for <code>{location.pathname}</code>
                </h3>
            </div>
        );
    }

    return (
        <div style={{width: '100%', height: '100%'}}>
            <Routes>
                <Route path={'/Login'} element={<Login/>}/>
                <Route path={'/panel'} element={<PrivateRoute children={undefined}/>}>
                    <Route path={'/panel/dashboard'} element={<Dashboard/>}/>
                    <Route path={'/panel/active'} element={<Active/>}/>
                    <Route path={'/panel/history'} element={<History/>}/>
                    <Route path={'/panel/users'} element={<Users/>}/>
                    <Route path={'/panel/groups'} element={<Groups/>}/>
                    <Route path={'/panel/connections'} element={<Connections/>}/>
                    <Route path={'/panel/terminal/:name/:id'} element={<Terminal/>}/>
                </Route>
                <Route path="/" element={<Navigate to="/panel/dashboard"/>}/>
                <Route path="*" element={<NoMatch />} />
            </Routes>
        </div>
    )
}

export default App
