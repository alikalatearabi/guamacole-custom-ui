import {useState} from 'react';
import {Card} from "primereact/card";
import {InputText} from "primereact/inputtext";
import {Button} from "primereact/button";
import {loginApi} from "../../api/api.ts";
import {useNavigate} from "react-router-dom";
import './login.css'

const Login = () => {

    const navigate = useNavigate()

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const handleLogin = () => {
        try{
            const login = async () => {
                const res = await loginApi(username, password)
                if (res.data.authToken) {
                    localStorage.setItem('token', res.data.authToken)
                    localStorage.setItem('user', username)
                    navigate('/panel/dashboard')
                }
            }
            if (username !== '' && password !== '') login().then()
        } catch (error: any) {
            console.log(error)
        }
    }

    return (
        <div style={{display: 'flex', alignItems: "center", justifyContent: 'space-between', height: '100%'}}>
            <div className={'sidebg'}>
            </div>
            <Card title={"سامانه جامع مدیریت سرور"} style={{width: '300px', margin: 'auto'}}>
                <InputText
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder={"username"}
                    style={{marginBottom: '10px', width: '100%'}}
                />
                <InputText
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type={'password'}
                    placeholder={"password"}
                    style={{width: '100%'}}
                />
                <Button
                    style={{
                        marginTop: '10px',
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                    onClick={() => handleLogin()}
                >
                    Login
                </Button>
            </Card>
        </div>
    );
};

export default Login;