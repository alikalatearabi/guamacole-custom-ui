import './App.css'
import Dashboard from "./pages/dashboard";
import {Route, Routes} from "react-router-dom";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import Layout from "./components/layout";
import Active from "./pages/active";
import History from "./pages/history";
import Users from "./pages/users";
import Groups from "./pages/groups";
import Connections from "./pages/connections";
import 'primeicons/primeicons.css';
import Login from "./pages/login";


function App() {

    return (
        <div style={{width: '100%', height: '100%'}}>
            <Layout>
                <Routes>
                    <Route path={'/'}  element={<Dashboard />} />
                    <Route path={'/login'}  element={<Login />} />
                    <Route path={'/active'}  element={<Active />} />
                    <Route path={'/history'}  element={<History />} />
                    <Route path={'/users'}  element={<Users />} />
                    <Route path={'/groups'}  element={<Groups />} />
                    <Route path={'/connections'}  element={<Connections />} />
                </Routes>
            </Layout>
        </div>
    )
}

export default App
