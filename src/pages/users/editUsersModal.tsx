import React, {useEffect, useRef, useState} from 'react';
import {Dialog} from "primereact/dialog";
import {InputText} from "primereact/inputtext";
import {Accordion, AccordionTab} from "primereact/accordion";
import {Checkbox} from 'primereact/checkbox';
import {Calendar} from "primereact/calendar";
import DatePicker, {DateObject} from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian"
import persian_fa from "react-date-object/locales/persian_fa"
import {GrPowerReset} from "react-icons/gr";
import {deleteUserApi, fetchUsersPermissionsAPI, patchUserPermissions, postUsersEditAttributes} from "../../api/api.ts";
import {Button} from "primereact/button";
import {Toast} from 'primereact/toast';
import {EditUserModalProps, FetchUserPermissionResponse, PermissionsType} from "./types.ts";
import {strToDate} from "./utils.ts";
import styled from "styled-components";

const ProfileSection = styled('div')`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`
const ProfileSectionItem = styled('div')`
  display: flex;
  flex-direction: column;

  span {
    margin-bottom: 10px;
    color: #6b6b6b;
    font-weight: 500;
  }
`

const permissionChecks = [
    {key: "ADMINISTER", value: "ADMINISTER"},
    {key: "CREATE_USER", value: "CREATE_USER"},
    {key: "CREATE_USER_GROUP", value: "CREATE_USER_GROUP"},
    {key: "CREATE_CONNECTION_GROUP", value: "CREATE_CONNECTION_GROUP"},
    {key: "CREATE_SHARING_PROFILE", value: "CREATE_SHARING_PROFILE"},
    {key: "CREATE_CONNECTION", value: "CREATE_CONNECTION"}
];

const permissionsInitial = {
    username: '',
    "access-window-start": null,
    "access-window-end": null,
    "valid-from": null,
    "valid-until": null,
    "guac-full-name": null,
    disabled: null
}

const EditUsersModal: React.FC<EditUserModalProps> = ({setModal, modal, data}) => {

    const toast = useRef<Toast>(null);

    const [permissions, setPermissions] = useState<PermissionsType>(permissionsInitial)
    const [initialPermissionArr, setInitialPermissionArr] = useState<string[]>([])

    const showSuccess = () => {
        toast.current?.show({severity: 'success', summary: 'Success', detail: 'Successful', life: 1500});
    }
    const fetchUsersAccessPermissions = async (): Promise<FetchUserPermissionResponse> => {
        const res = await fetchUsersPermissionsAPI(data?.username)
        if (res.status === 200) {
            setInitialPermissionArr(res.data.systemPermissions)
            return res.data
        } else return undefined
    }

    useEffect(() => {
        if (!data) return;

        const processPermissions = async () => {
            const res = await fetchUsersAccessPermissions();
            const permissionObj: PermissionsType = {
                username: data.username,
                ADMINISTER: res.systemPermissions.includes("ADMINISTER"),
                CREATE_USER: res.systemPermissions.includes("CREATE_USER"),
                CREATE_USER_GROUP: res.systemPermissions.includes("CREATE_USER_GROUP"),
                CREATE_CONNECTION: res.systemPermissions.includes("CREATE_CONNECTION"),
                CREATE_CONNECTION_GROUP: res.systemPermissions.includes("CREATE_CONNECTION_GROUP"),
                CREATE_SHARING_PROFILE: res.systemPermissions.includes("CREATE_SHARING_PROFILE"),
                changePassword: res.userPermissions[data.username].includes('UPDATE'),
                "access-window-start": data.attributes["access-window-start"] ? strToDate(data.attributes["access-window-start"]) : undefined,
                "access-window-end": data.attributes["access-window-end"] ? strToDate(data.attributes["access-window-end"]) : undefined,
                "valid-from": data.attributes["valid-from"] ? new Date(data.attributes["valid-from"]).toISOString().split('T')[0] as unknown as DateObject : undefined,
                "valid-until": data.attributes["valid-until"] ? new Date(data.attributes["valid-until"]).toISOString().split('T')[0] as unknown as DateObject : undefined,
                "guac-full-name": data.attributes["guac-full-name"],
                "guac-email-address": data.attributes["guac-email-address"],
                disabled: data.attributes.disabled === "true"
            };
            setPermissions(permissionObj);
        };

        processPermissions().then();
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
            lastActive: new Date(data?.lastActive).valueOf(),
            password: permissions.password,
            username: permissions.username || data?.username
        }
        const res = await postUsersEditAttributes(data?.username, attrData)

        for (const {key, value} of permissionChecks) {
            const shouldAdd = permissions[key] && !initialPermissionArr.includes(value);
            const shouldRemove = !permissions[key] && initialPermissionArr.includes(value);
            if (shouldAdd) {
                permArr.push({op: "add", path: "/systemPermissions", value});
            } else if (shouldRemove) {
                permArr.push({op: "remove", path: "/systemPermissions", value});
            }
        }
        const permRes = await patchUserPermissions(data?.username, permArr)

        if (res.status === 204 && permRes.status === 204) {
            showSuccess()
            setTimeout(() => {
                setModal(false)
            }, 500)
        }
    }

    const handleDeleteUser = async () =>{
        const res = await deleteUserApi(data.username)
        if (res.status === 204){
            toast.current?.show({severity: 'success', summary: 'User Deleted', life: 1000});
            setTimeout(() => {
                setModal(false)
            }, 500)
        }
    }

    const dialogProps = {
        onHide: () => setModal(false),
        visible: modal,
        header: "Edit User",
        style: {width: '1000px'}
    }


    return (
        <Dialog {...dialogProps}>
            <Toast ref={toast}/>
            <Accordion multiple activeIndex={[0, 1]}>
                <AccordionTab header={"Profile"}>
                    <ProfileSection>
                        <ProfileSectionItem>
                            <span>Username</span>
                            <InputText
                                placeholder={"Username"}
                                style={{width: '100%', height: '40px'}}
                                onChange={(e) => setPermissions({...permissions, username: e.target.value})}
                                value={permissions.username ? permissions.username : ''}
                                disabled={true}
                            />
                        </ProfileSectionItem>
                        <ProfileSectionItem>
                            <span>Password</span>
                            <InputText
                                placeholder={"Password"}
                                type={"password"}
                                style={{width: '100%'}}
                                onChange={(e) => setPermissions({...permissions, password: e.target.value})}
                            />
                        </ProfileSectionItem>
                        <ProfileSectionItem>
                            <span>Re-Enter Password</span>
                            <InputText placeholder={"Re-Enter password"} type={"password"} style={{width: '100%'}}/>
                        </ProfileSectionItem>
                    </ProfileSection>
                    <ProfileSection style={{marginTop: '30px'}}>
                        <ProfileSectionItem style={{width: '22%'}}>
                            <span>Full Name</span>
                            <InputText
                                placeholder={"Full name"}
                                style={{width: '100%'}}
                                value={permissions["guac-full-name"]}
                                onChange={(e) => setPermissions({...permissions, "guac-full-name": e.target.value})}
                            />
                        </ProfileSectionItem>
                        <ProfileSectionItem style={{width: '22%'}}>
                            <span>Email Address</span>
                            <InputText
                                placeholder={"Email Address"}
                                style={{width: '100%'}}
                                value={permissions["guac-email-address"]}
                                onChange={(e) => setPermissions({...permissions, "guac-email-address": e.target.value})}
                            />
                        </ProfileSectionItem>
                        <ProfileSectionItem style={{width: '22%'}}>
                            <span>Organizations</span>
                            <InputText
                                placeholder={"Organizations"}
                                style={{width: '100%'}}
                                value={permissions["guac-organization"]}
                                onChange={(e) => setPermissions({...permissions, "guac-organization": e.target.value})}
                            />
                        </ProfileSectionItem>
                        <ProfileSectionItem style={{width: '22%'}}>
                            <span>Organizations Role</span>
                            <InputText
                                placeholder={"Role"}
                                style={{width: '100%'}}
                                value={permissions["guac-organizational-role"]}
                                onChange={(e) => setPermissions({...permissions, "guac-organizational-role": e.target.value})}
                            />
                        </ProfileSectionItem>
                    </ProfileSection>
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
            <div style={{display: 'flex', alignItems: "center", justifyContent: "space-between", marginTop: '20px', width: '100%'}}>
                <Button severity={'danger'} onClick={() => handleDeleteUser()}>
                    Delete User
                </Button>
                <Button
                    onClick={() => handleEditUser()}
                    style={{
                    fontFamily: 'vazir',
                    display: 'flex',
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: '18px'
                }}>Edit User</Button>
            </div>
        </Dialog>

    );
};

export default EditUsersModal;