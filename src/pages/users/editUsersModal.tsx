import React, {useEffect, useState} from 'react';
import {Dialog} from "primereact/dialog";
import {InputText} from "primereact/inputtext";
import {UsersData} from "./index.tsx";
import {Accordion, AccordionTab} from "primereact/accordion";
import {Checkbox} from 'primereact/checkbox';
import {Calendar} from "primereact/calendar";
import DatePicker, {DateObject} from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian"
import persian_fa from "react-date-object/locales/persian_fa"
import {Button} from "primereact/button";
import {GrPowerReset} from "react-icons/gr";
import {fetchUsersAttributesAPI} from "../../api/api.ts";


interface EditUserModalProps {
    setModal: (value: boolean) => void,
    modal: boolean,
    data: UsersData | undefined
}

const EditUsersModal: React.FC<EditUserModalProps> = ({setModal, modal, data}) => {

    const [permissions, setPermissions] = useState<{
        enableAfter?: DateObject | DateObject[] | null,
        disableAfter?: DateObject | DateObject[] | null,
        allowAccessAfter?: Date | null,
        disableAccessAfter?: Date | null
        disabled?: boolean
        expired?: boolean
        administrator?: boolean,
        createNewUser?: boolean,
        createNewGroup?: boolean,
        createNewConnection?: boolean,
        createNewConnectionGroup?: boolean,
        createNewSharingProfile?: boolean,
        changePassword?: boolean
    }>({})

    useEffect(() => {
        if (data?.attributes.disabled === "true") setPermissions({...permissions, disabled: true})
        if (data?.attributes.expired === "true") setPermissions({...permissions, expired: true})
        if (data?.attributes["access-window-start"]) {
            const timeString = data?.attributes["access-window-start"];
            const currentDateEnable = new Date();
            const timeParts = timeString?.split(":");
            if (timeParts) {
                const hours = parseInt(timeParts[0], 10);
                const minutes = parseInt(timeParts[1], 10);
                const seconds = parseInt(timeParts[2], 10);
                currentDateEnable.setHours(hours);
                currentDateEnable.setMinutes(minutes);
                currentDateEnable.setSeconds(seconds);
                setPermissions({...permissions, allowAccessAfter: currentDateEnable})
            }
        }
        if (data?.attributes["access-window-end"]) {
            const timeString = data?.attributes["access-window-end"];
            const currentDateDisable = new Date();
            const timeParts = timeString?.split(":");
            if (timeParts) {
                const hours = parseInt(timeParts[0], 10);
                const minutes = parseInt(timeParts[1], 10);
                const seconds = parseInt(timeParts[2], 10);
                currentDateDisable.setHours(hours);
                currentDateDisable.setMinutes(minutes);
                currentDateDisable.setSeconds(seconds);
                setPermissions({...permissions, disableAccessAfter: currentDateDisable})
            }
        }
        if (data?.attributes["valid-from"]) {
            const dateString = data?.attributes["valid-from"]
            const dateObject =  new Date(dateString)
            setPermissions({...permissions, enableAfter: dateObject as unknown as DateObject})
        }
        console.log(data)
    }, [data]);


    return (
        <Dialog
            onHide={() => setModal(false)}
            visible={modal}
            header={"Edit User"}
            style={{width: '1000px'}}
        >
            <Accordion multiple activeIndex={[0, 1]}>
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
                                       value={data?.attributes["guac-full-name"] || ''}/>
                        </div>
                        <div style={{display: 'flex', flexDirection: 'column', width: '22%'}}>
                            <span
                                style={{marginBottom: '10px', color: '#6b6b6b', fontWeight: '500'}}>Email Address</span>
                            <InputText placeholder={"Email Address"} style={{width: '100%'}}
                                       value={data?.attributes["guac-email-address"] || ''}/>
                        </div>
                        <div style={{display: 'flex', flexDirection: 'column', width: '22%'}}>
                            <span
                                style={{marginBottom: '10px', color: '#6b6b6b', fontWeight: '500'}}>Organizations</span>
                            <InputText placeholder={"Organizations"} style={{width: '100%'}}
                                       value={data?.attributes["guac-organization"] || ''}/>
                        </div>
                        <div style={{display: 'flex', flexDirection: 'column', width: '22%'}}>
                            <span
                                style={{marginBottom: '10px', color: '#6b6b6b', fontWeight: '500'}}>Organizations</span>
                            <InputText placeholder={"Role"} style={{width: '100%'}}
                                       value={data?.attributes["guac-organizational-role"] || ''}/>
                        </div>
                    </div>
                </AccordionTab>
                <AccordionTab header={"Permissions"}>
                    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '50%'}}>
                        <div>
                            <Checkbox
                                onChange={e => setPermissions({...permissions, disabled: e.checked})}
                                checked={permissions.disabled ? permissions.disabled : false}
                            ></Checkbox>
                            <span style={{marginLeft: '10px'}}>Login Disabled</span>
                        </div>
                        <div>
                            <Checkbox
                                onChange={e => setPermissions({...permissions, expired: e.checked})}
                                checked={!!permissions.expired}
                            ></Checkbox>
                            <span style={{marginLeft: '10px'}}>Password Expired</span>
                        </div>
                    </div>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: "space-between",
                        marginTop: '30px'
                    }}>
                        <div style={{width: '24%'}}>
                            <span style={{
                                marginBottom: '10px',
                                fontSize: '15px',
                                color: '#808080'
                            }}>Allow Access After</span>
                            <div style={{display: 'flex', alignItems: "center"}}>
                                <Calendar
                                    value={permissions.allowAccessAfter}
                                    onChange={(e) => setPermissions({
                                        ...permissions,
                                        allowAccessAfter: e.value
                                    })}
                                    timeOnly
                                    style={{height: '35px'}}
                                />
                                <div
                                    style={{transform: 'translateX(-25px)', cursor: 'pointer'}}
                                    onClick={() => setPermissions({...permissions, allowAccessAfter: null})}
                                >
                                    <GrPowerReset/>
                                </div>
                            </div>
                        </div>
                        <div style={{width: '24%'}}>
                            <span style={{marginBottom: '10px', fontSize: '15px', color: '#808080'}}>Do Not Allow Access After</span>
                            <div style={{display: 'flex', alignItems: "center"}}>
                                <Calendar
                                    value={permissions.disableAccessAfter}
                                    onChange={(e) => setPermissions({
                                        ...permissions,
                                        disableAccessAfter: e.value
                                    })}
                                    timeOnly
                                    style={{height: '35px'}}
                                />
                                <div
                                    style={{transform: 'translateX(-25px)', cursor: 'pointer'}}
                                    onClick={() => setPermissions({...permissions, disableAccessAfter: null})}
                                >
                                    <GrPowerReset/>
                                </div>
                            </div>
                        </div>
                        <div style={{width: '24%'}}>
                            <span style={{marginBottom: '10px', fontSize: '15px', color: '#808080'}}>Enable Account After</span>
                            <div style={{display: 'flex', alignItems: "center"}}>
                                <DatePicker
                                    value={permissions.enableAfter}
                                    onChange={(value) => setPermissions({...permissions, enableAfter: value})}
                                    style={{height: '35px', width: '100%', fontFamily: 'vazir'}}
                                    containerStyle={{display: 'block', fontSize: '15px', fontFamily: 'vazir'}}
                                    calendar={persian}
                                    locale={persian_fa}
                                ></DatePicker>
                                <div
                                    style={{transform: 'translateX(-25px)', cursor: 'pointer'}}
                                    onClick={() => setPermissions({...permissions, enableAfter: undefined})}
                                >
                                    <GrPowerReset/>
                                </div>
                            </div>
                        </div>
                        <div style={{width: '24%'}}>
                            <span style={{marginBottom: '10px', fontSize: '15px', color: '#808080'}}>Disable Account After</span>
                            <div style={{display: 'flex', alignItems: "center"}}>
                                <DatePicker
                                    value={permissions.disableAfter}
                                    onChange={(value) => setPermissions({...permissions, disableAfter: value})}
                                    style={{height: '35px', width: '100%', fontFamily: 'vazir'}}
                                    containerStyle={{display: 'block', fontSize: '15px', fontFamily: 'vazir'}}
                                    calendar={persian}
                                    locale={persian_fa}
                                ></DatePicker>
                                <div
                                    style={{transform: 'translateX(-25px)', cursor: 'pointer'}}
                                    onClick={() => setPermissions({...permissions, disableAfter: undefined})}
                                >
                                    <GrPowerReset/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: '100%',
                        marginTop: '30px'
                    }}>
                        <div>
                            <Checkbox
                                onChange={e => setPermissions({...permissions, administrator: e.checked})}
                                checked={!!permissions.administrator}
                            ></Checkbox>
                            <span style={{marginLeft: '10px'}}>Administrator System</span>
                        </div>
                        <div>
                            <Checkbox
                                onChange={e => setPermissions({...permissions, createNewUser: e.checked})}
                                checked={!!permissions.createNewUser}
                            ></Checkbox>
                            <span style={{marginLeft: '10px'}}>Create New Users</span>
                        </div>
                        <div>
                            <Checkbox
                                onChange={e => setPermissions({...permissions, createNewGroup: e.checked})}
                                checked={!!permissions.createNewGroup}
                            ></Checkbox>
                            <span style={{marginLeft: '10px'}}>Create New Group</span>
                        </div>
                        <div>
                            <Checkbox
                                onChange={e => setPermissions({...permissions, createNewConnection: e.checked})}
                                checked={!!permissions.createNewConnection}
                            ></Checkbox>
                            <span style={{marginLeft: '10px'}}>Create New Connection</span>
                        </div>
                    </div>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: '100%',
                        marginTop: '30px'
                    }}>
                        <div>
                            <Checkbox
                                onChange={e => setPermissions({...permissions, createNewConnectionGroup: e.checked})}
                                checked={!!permissions.createNewConnectionGroup}
                            ></Checkbox>
                            <span style={{marginLeft: '10px'}}>Create New Connection Group</span>
                        </div>
                        <div>
                            <Checkbox
                                onChange={e => setPermissions({...permissions, createNewSharingProfile: e.checked})}
                                checked={!!permissions.createNewSharingProfile}
                            ></Checkbox>
                            <span style={{marginLeft: '10px'}}>Create New Sharing Profile</span>
                        </div>
                        <div>
                            <Checkbox
                                onChange={e => setPermissions({...permissions, changePassword: e.checked})}
                                checked={!!permissions.changePassword}
                            ></Checkbox>
                            <span style={{marginLeft: '10px'}}>Change Password</span>
                        </div>
                    </div>
                </AccordionTab>
            </Accordion>
            <div>

            </div>
        </Dialog>

    );
};

export default EditUsersModal;