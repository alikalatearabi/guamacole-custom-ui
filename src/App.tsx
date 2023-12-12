import './App.css'
import Dashboard from "./pages/dashboard";
import {Route, Routes} from "react-router-dom";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import Layout from "./components/layout";
import Active from "./pages/active";


function App() {

    return (
        <div style={{width: '100%', height: '100%'}}>
            <Layout>
                <Routes>
                    <Route path={'/'}  element={<Dashboard />} />
                    <Route path={'/active'}  element={<Active />} />
                </Routes>
            </Layout>
        </div>
    )
}

export default App
