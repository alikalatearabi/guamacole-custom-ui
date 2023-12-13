import React, {useState} from 'react';
import {Dialog} from "primereact/dialog";
import {InputText} from "primereact/inputtext";
import {UsersData} from "./index.tsx";
import {Accordion, AccordionTab} from "primereact/accordion";
import {Checkbox} from 'primereact/checkbox';


interface EditUserModalProps {
    setModal: (value: boolean) => void,
    modal: boolean,
    data: UsersData | undefined
}

const EditUsersModal: React.FC<EditUserModalProps> = ({setModal, modal, data}) => {

    const [permissionsChecked, setPermissionsChecked] = useState<{
        login: boolean | undefined
    }>({
        login: false
    })


    return (
        <Dialog
            onHide={() => setModal(false)}
            visible={modal}
            header={"Edit User"}
            style={{width: '900px'}}
        >
            <Accordion multiple>
                <AccordionTab header={"Profile"}>
                    <div
                        style={{width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                        <div style={{display: 'flex', flexDirection: 'column'}}>
                            <span style={{marginBottom: '10px', color: '#6b6b6b', fontWeight: '500'}}>Username</span>
                            <InputText placeholder={"Username"} style={{width: '100%', height: '40px'}}/>
                        </div>
                        <div style={{display: 'flex', flexDirection: 'column'}}>
                            <span style={{marginBottom: '10px', color: '#6b6b6b', fontWeight: '500'}}>Password</span>
                            <InputText placeholder={"Password"} type={"password"} style={{width: '100%'}}/>
                        </div>
                        <div style={{display: 'flex', flexDirection: 'column'}}>
                            <span style={{
                                marginBottom: '10px',
                                color: '#6b6b6b',
                                fontWeight: '500'
                            }}>Re-Enter Password</span>
                            <InputText placeholder={"Re-Enter password"} type={"password"} style={{width: '100%'}}/>
                        </div>
                    </div>
                    <div style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginTop: '30px'
                    }}>
                        <div style={{display: 'flex', flexDirection: 'column', width: '22%'}}>
                            <span style={{marginBottom: '10px', color: '#6b6b6b', fontWeight: '500'}}>Full Name</span>
                            <InputText placeholder={"Full name"} style={{width: '100%'}}
                                       value={data?.attributes["guac-full-name"]}/>
                        </div>
                        <div style={{display: 'flex', flexDirection: 'column', width: '22%'}}>
                            <span
                                style={{marginBottom: '10px', color: '#6b6b6b', fontWeight: '500'}}>Email Address</span>
                            <InputText placeholder={"Email Address"} style={{width: '100%'}}
                                       value={data?.attributes["guac-email-address"]}/>
                        </div>
                        <div style={{display: 'flex', flexDirection: 'column', width: '22%'}}>
                            <span
                                style={{marginBottom: '10px', color: '#6b6b6b', fontWeight: '500'}}>Organizations</span>
                            <InputText placeholder={"Organizations"} style={{width: '100%'}}
                                       value={data?.attributes["guac-organization"]}/>
                        </div>
                        <div style={{display: 'flex', flexDirection: 'column', width: '22%'}}>
                            <span
                                style={{marginBottom: '10px', color: '#6b6b6b', fontWeight: '500'}}>Organizations</span>
                            <InputText placeholder={"Role"} style={{width: '100%'}}
                                       value={data?.attributes["guac-organizational-role"]}/>
                        </div>
                    </div>
                </AccordionTab>
                <AccordionTab header={"Permissions"}>
                    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '50%'}}>
                        <div>
                            <Checkbox
                                onChange={e => setPermissionsChecked({...permissionsChecked, login: e.checked})}
                                checked={!!permissionsChecked.login}
                            ></Checkbox>
                            <span style={{marginLeft: '10px'}}>Login Disabled</span>
                        </div>
                        <div>
                            <Checkbox
                                onChange={e => setPermissionsChecked({...permissionsChecked, login: e.checked})}
                                checked={!!permissionsChecked.login}
                            ></Checkbox>
                            <span style={{marginLeft: '10px'}}>Password Expired</span>
                        </div>
                    </div>
                </AccordionTab>
            </Accordion>
        </Dialog>

    );
};

export default EditUsersModal;