import React, {useEffect, useRef, useState} from 'react';
import {Dialog} from "primereact/dialog";
import {InputText} from "primereact/inputtext";
import {UsersData} from "./index.tsx";
import {Accordion, AccordionTab} from "primereact/accordion";
import {Checkbox} from 'primereact/checkbox';
import {Calendar} from "primereact/calendar";
import DatePicker, {DateObject} from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian"
import persian_fa from "react-date-object/locales/persian_fa"
import {GrPowerReset} from "react-icons/gr";
import {fetchUsersPermissionsAPI, patchUserPermissions, postUsersEditAttributes} from "../../api/api.ts";
import {Button} from "primereact/button";
import {Toast} from 'primereact/toast';

interface EditUserModalProps {
    setModal: (value: boolean) => void,
    modal: boolean,
    data: UsersData | undefined,
}

interface PermissionsType {
    username?: string,
    password?: string,
    "valid-from"?: DateObject | DateObject[] | null,
    "valid-until"?: DateObject | DateObject[] | null,
    "access-window-start"?: Date | null,
    "access-window-end"?: Date | null,
    "guac-full-name"?: string,
    "guac-email-address"?: string,
    "guac-organization"?: string,
    "guac-organizational-role"?: string,
    disabled?: boolean
    expired?: boolean
    "ADMINISTER"?: boolean,
    "CREATE_USER"?: boolean,
    "CREATE_USER_GROUP"?: boolean,
    "CREATE_CONNECTION"?: boolean,
    "CREATE_CONNECTION_GROUP"?: boolean,
    "CREATE_SHARING_PROFILE"?: boolean,
    changePassword?: boolean
}

const strToDate = (dateString: string) => {
    const timeString = dateString;
    const currentDate = new Date();
    const timeParts = timeString?.split(":");
    if (timeParts) {
        const hours = parseInt(timeParts[0], 10);
        const minutes = parseInt(timeParts[1], 10);
        const seconds = parseInt(timeParts[2], 10);
        currentDate.setHours(hours);
        currentDate.setMinutes(minutes);
        currentDate.setSeconds(seconds);
        return currentDate.toTimeString().split(' ')[0]
    }
}

const EditUsersModal: React.FC<EditUserModalProps> = ({setModal, modal, data}) => {

    const toast = useRef<Toast>(null);

    const [permissions, setPermissions] = useState<PermissionsType>({})
    const [initialPermissionArr, setInitialPermissionArr] = useState<string[]>([])

    const showSuccess = () => {
        toast.current?.show({severity: 'success', summary: 'Success', detail: 'Successful', life: 1500});
    }
    const fetchUsersAccessPermissions = async (): Promise<string[]> => {
        const res = await fetchUsersPermissionsAPI(data?.username)
        if (res.status === 200) {
            setInitialPermissionArr(res.data.systemPermissions)
            return res.data.systemPermissions
        } else return []
    }

    useEffect(() => {
        const permissionObj: PermissionsType = {}
        if (data) {
            fetchUsersAccessPermissions().then(res => {
                if (data.username) {
                    permissionObj.username = data.username
                }
                if (res.includes("ADMINISTER")) {
                    permissionObj.ADMINISTER = true
                }
                if (res.includes("CREATE_USER")) {
                    permissionObj.CREATE_USER = true
                }
                if (res.includes("CREATE_USER_GROUP")) {
                    permissionObj.CREATE_USER_GROUP = true
                }
                if (res.includes("CREATE_CONNECTION")) {
                    permissionObj.CREATE_CONNECTION = true
                }
                if (res.includes("CREATE_CONNECTION_GROUP")) {
                    permissionObj.CREATE_CONNECTION_GROUP = true
                }
                if (res.includes("CREATE_SHARING_PROFILE")) {
                    permissionObj.CREATE_SHARING_PROFILE = true
                }
                if (data.attributes["access-window-start"]) {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-expect-error
                    permissionObj["access-window-start"] = strToDate(data.attributes["access-window-start"])
                }
                if (data.attributes["access-window-end"]) {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-expect-error
                    permissionObj["access-window-end"] = strToDate(data.attributes["access-window-end"])
                }
                if (data.attributes["valid-from"]) {
                    permissionObj["valid-from"] = new Date(data.attributes["valid-from"]).toISOString().split('T')[0] as unknown as DateObject
                }
                if (data.attributes["valid-until"]) {
                    permissionObj["valid-until"] = new Date(data.attributes["valid-until"]).toISOString().split('T')[0] as unknown as DateObject
                }
                if (data.attributes["guac-full-name"]) {
                    permissionObj["guac-full-name"] = data.attributes["guac-full-name"]
                }
                if (data.attributes["guac-email-address"]) {
                    permissionObj["guac-email-address"] = data.attributes["guac-email-address"]
                }
                if (data.attributes.disabled === "true") {
                    permissionObj.disabled = true
                }
                setPermissions(permissionObj)
            })

        }
    }, [data]);

    const handleEditUser = async () => {
        const permArr: { op: string, path: string, value: string }[] = []
        const attrData = {
            attributes: {
                "access-window-end": permissions["access-window-end"] || null,
                "access-window-start": permissions["access-window-start"] || null,
                "guac-full-name": permissions["guac-full-name"] || null,
                "guac-email-address": permissions["guac-email-address"] || null,
                "guac-organization": permissions["guac-organization"] || null,
                "guac-organizational-role": permissions["guac-organizational-role"] || null,
                "valid-from": permissions["valid-from"] || null,
                "valid-until": permissions["valid-until"] || null,
                "disabled": permissions.disabled || "",
                "expired": permissions.expired || "",
                "timezone": null
            },
            // @ts-ignore
            lastActive: new Date(data?.lastActive).valueOf(),
            password: permissions.password,
            username: permissions.username || data?.username
        }
        const res = await postUsersEditAttributes(data?.username, attrData)

        if (!permissions.ADMINISTER && initialPermissionArr.includes("ADMINISTER")) {
            permArr.push({op: "remove", path: '/systemPermissions', value: "ADMINISTER"})
        } else if (permissions.ADMINISTER && !initialPermissionArr.includes("ADMINISTER")) {
            permArr.push({op: "add", path: '/systemPermissions', value: "ADMINISTER"})
        }
        if (!permissions.CREATE_USER && initialPermissionArr.includes("CREATE_USER")) {
            permArr.push({op: "remove", path: '/systemPermissions', value: "CREATE_USER"})
        } else if (permissions.CREATE_USER && !initialPermissionArr.includes("CREATE_USER")) {
            permArr.push({op: "add", path: '/systemPermissions', value: "CREATE_USER"})
        }
        if (!permissions.CREATE_USER_GROUP && initialPermissionArr.includes("CREATE_USER_GROUP")) {
            permArr.push({op: "remove", path: '/systemPermissions', value: "CREATE_USER_GROUP"})
        } else if (permissions.CREATE_USER_GROUP && !initialPermissionArr.includes("CREATE_USER_GROUP")) {
            permArr.push({op: "add", path: '/systemPermissions', value: "CREATE_USER_GROUP"})
        }
        if (!permissions.CREATE_CONNECTION_GROUP && initialPermissionArr.includes("CREATE_CONNECTION_GROUP")) {
            permArr.push({op: "remove", path: '/systemPermissions', value: "CREATE_CONNECTION_GROUP"})
        } else if (permissions.CREATE_CONNECTION_GROUP && !initialPermissionArr.includes("CREATE_CONNECTION_GROUP")) {
            permArr.push({op: "add", path: '/systemPermissions', value: "CREATE_CONNECTION_GROUP"})
        }
        if (!permissions.CREATE_SHARING_PROFILE && initialPermissionArr.includes("CREATE_SHARING_PROFILE")) {
            permArr.push({op: "remove", path: '/systemPermissions', value: "CREATE_SHARING_PROFILE"})
        } else if (permissions.CREATE_SHARING_PROFILE && !initialPermissionArr.includes("CREATE_SHARING_PROFILE")) {
            permArr.push({op: "add", path: '/systemPermissions', value: "CREATE_SHARING_PROFILE"})
        }
        if (!permissions.CREATE_CONNECTION && initialPermissionArr.includes("CREATE_CONNECTION")) {
            permArr.push({op: "remove", path: '/systemPermissions', value: "CREATE_CONNECTION"})
        } else if (permissions.CREATE_CONNECTION && !initialPermissionArr.includes("CREATE_CONNECTION")) {
            permArr.push({op: "add", path: '/systemPermissions', value: "CREATE_CONNECTION"})
        }
        const permRes = await patchUserPermissions(data?.username, permArr)

        if (res.status === 204 && permRes.status === 204) showSuccess()
    }


    return (
        <Dialog
            onHide={() => setModal(false)}
            visible={modal}
            header={"Edit User"}
            style={{width: '1000px'}}
        >
            <Toast ref={toast}/>
            <Accordion multiple activeIndex={[0, 1]}>
                <AccordionTab header={"Profile"}>
                    <div
                        style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}>
                        <div style={{display: 'flex', flexDirection: 'column'}}>
                                <span style={{marginBottom: '10px', color: '#6b6b6b', fontWeight: '500'}}>
                                    Username
                                </span>
                            <InputText
                                placeholder={"Username"}
                                style={{width: '100%', height: '40px'}}
                                onChange={(e) => setPermissions({...permissions, username: e.target.value})}
                                value={permissions.username ? permissions.username : ''}
                            />
                        </div>
                        <div style={{display: 'flex', flexDirection: 'column'}}>
                                <span style={{marginBottom: '10px', color: '#6b6b6b', fontWeight: '500'}}>
                                    Password
                                </span>
                            <InputText
                                placeholder={"Password"}
                                type={"password"}
                                style={{width: '100%'}}
                                onChange={(e) => setPermissions({...permissions, password: e.target.value})}
                            />
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
                                <span style={{marginBottom: '10px', color: '#6b6b6b', fontWeight: '500'}}>
                                    Full Name
                                </span>
                            <InputText
                                placeholder={"Full name"}
                                style={{width: '100%'}}
                                value={permissions["guac-full-name"]}
                                onChange={(e) => setPermissions({...permissions, "guac-full-name": e.target.value})}
                            />
                        </div>
                        <div style={{display: 'flex', flexDirection: 'column', width: '22%'}}>
                            <span style={{marginBottom: '10px', color: '#6b6b6b', fontWeight: '500'}}>
                                Email Address
                            </span>
                            <InputText
                                placeholder={"Email Address"}
                                style={{width: '100%'}}
                                value={permissions["guac-email-address"]}
                                onChange={(e) => setPermissions({...permissions, "guac-email-address": e.target.value})}
                            />
                        </div>
                        <div style={{display: 'flex', flexDirection: 'column', width: '22%'}}>
                            <span style={{marginBottom: '10px', color: '#6b6b6b', fontWeight: '500'}}>
                                Organizations
                            </span>
                            <InputText
                                placeholder={"Organizations"}
                                style={{width: '100%'}}
                                value={permissions["guac-organization"]}
                                onChange={(e) => setPermissions({...permissions, "guac-organization": e.target.value})}
                            />
                        </div>
                        <div style={{display: 'flex', flexDirection: 'column', width: '22%'}}>
                            <span style={{marginBottom: '10px', color: '#6b6b6b', fontWeight: '500'}}>
                                Organizations Role
                            </span>
                            <InputText
                                placeholder={"Role"}
                                style={{width: '100%'}}
                                value={permissions["guac-organizational-role"]}
                                onChange={(e) => setPermissions({...permissions, "guac-organizational-role": e.target.value})}
                            />
                        </div>
                    </div>
                </AccordionTab>
                <AccordionTab header={"Permissions"}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: '50%'
                    }}>
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
                                    value={permissions["access-window-start"]}
                                    onChange={(e) => setPermissions({
                                        ...permissions,
                                        "access-window-start": e.value
                                    })}
                                    timeOnly
                                    style={{height: '35px'}}
                                />
                                <div
                                    style={{transform: 'translateX(-25px)', cursor: 'pointer'}}
                                    onClick={() => setPermissions({...permissions, "access-window-start": null})}
                                >
                                    <GrPowerReset/>
                                </div>
                            </div>
                        </div>
                        <div style={{width: '24%'}}>
                            <span style={{marginBottom: '10px', fontSize: '15px', color: '#808080'}}>Do Not Allow Access After</span>
                            <div style={{display: 'flex', alignItems: "center"}}>
                                <Calendar
                                    value={permissions["access-window-end"]}
                                    onChange={(e) => setPermissions({
                                        ...permissions,
                                        "access-window-end": e.value
                                    })}
                                    timeOnly
                                    style={{height: '35px'}}
                                />
                                <div
                                    style={{transform: 'translateX(-25px)', cursor: 'pointer'}}
                                    onClick={() => setPermissions({...permissions, "access-window-end": null})}
                                >
                                    <GrPowerReset/>
                                </div>
                            </div>
                        </div>
                        <div style={{width: '24%'}}>
                            <span style={{marginBottom: '10px', fontSize: '15px', color: '#808080'}}>Enable Account After</span>
                            <div style={{display: 'flex', alignItems: "center"}}>
                                <DatePicker
                                    value={permissions["valid-from"]}
                                    onChange={(value) => setPermissions({...permissions, "valid-from": value})}
                                    style={{height: '35px', width: '100%', fontFamily: 'vazir'}}
                                    containerStyle={{display: 'block', fontSize: '15px', fontFamily: 'vazir'}}
                                    calendar={persian}
                                    locale={persian_fa}
                                ></DatePicker>
                                <div
                                    style={{transform: 'translateX(-25px)', cursor: 'pointer'}}
                                    onClick={() => setPermissions({...permissions, "valid-from": undefined})}
                                >
                                    <GrPowerReset/>
                                </div>
                            </div>
                        </div>
                        <div style={{width: '24%'}}>
                            <span style={{marginBottom: '10px', fontSize: '15px', color: '#808080'}}>Disable Account After</span>
                            <div style={{display: 'flex', alignItems: "center"}}>
                                <DatePicker
                                    value={permissions["valid-until"]}
                                    onChange={(value) => setPermissions({...permissions, "valid-until": value})}
                                    style={{height: '35px', width: '100%', fontFamily: 'vazir'}}
                                    containerStyle={{display: 'block', fontSize: '15px', fontFamily: 'vazir'}}
                                    calendar={persian}
                                    locale={persian_fa}
                                ></DatePicker>
                                <div
                                    style={{transform: 'translateX(-25px)', cursor: 'pointer'}}
                                    onClick={() => setPermissions({...permissions, "valid-until": undefined})}
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
                                onChange={e => setPermissions({...permissions, ADMINISTER: e.checked})}
                                checked={!!permissions.ADMINISTER}
                            ></Checkbox>
                            <span style={{marginLeft: '10px'}}>Administrator</span>
                        </div>
                        <div>
                            <Checkbox
                                onChange={e => setPermissions({...permissions, "CREATE_USER": e.checked})}
                                checked={!!permissions["CREATE_USER"]}
                            ></Checkbox>
                            <span style={{marginLeft: '10px'}}>Create New Users</span>
                        </div>
                        <div>
                            <Checkbox
                                onChange={e => setPermissions({...permissions, "CREATE_USER_GROUP": e.checked})}
                                checked={!!permissions["CREATE_USER_GROUP"]}
                            ></Checkbox>
                            <span style={{marginLeft: '10px'}}>Create New Group</span>
                        </div>
                        <div>
                            <Checkbox
                                onChange={e => setPermissions({...permissions, "CREATE_CONNECTION": e.checked})}
                                checked={!!permissions.CREATE_CONNECTION}
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
                                onChange={e => setPermissions({
                                    ...permissions,
                                    "CREATE_CONNECTION_GROUP": e.checked
                                })}
                                checked={!!permissions.CREATE_CONNECTION_GROUP}
                            ></Checkbox>
                            <span style={{marginLeft: '10px'}}>Create New Connection Group</span>
                        </div>
                        <div>
                            <Checkbox
                                onChange={e => setPermissions({...permissions, "CREATE_SHARING_PROFILE": e.checked})}
                                checked={!!permissions.CREATE_SHARING_PROFILE}
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
            <div
                style={{display: 'flex', alignItems: "center", justifyContent: "center", marginTop: '20px'}}
                onClick={() => handleEditUser()}
            >
                <Button style={{
                    fontFamily: 'vazir',
                    margin: 'auto',
                    width: '20%',
                    display: 'flex',
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: '18px'
                }}>ثبت تغییرات</Button>
            </div>
        </Dialog>

    );
};

export default EditUsersModal;