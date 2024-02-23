import React, {useRef, useState} from 'react';
import {Dialog} from "primereact/dialog";
import {InputText} from "primereact/inputtext";
import {Accordion, AccordionTab} from "primereact/accordion";
import {Checkbox} from 'primereact/checkbox';
import {Calendar} from "primereact/calendar";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian"
import persian_fa from "react-date-object/locales/persian_fa"
import {GrPowerReset} from "react-icons/gr";
import {Button} from "primereact/button";
import {Toast} from 'primereact/toast';
import {AddUserModalProps, PermissionsType} from "./types.ts";
import styled from "styled-components";
import moment from "moment";
import {addUserApi, addUserPermissionsApi} from "../../api/api.ts";

const CustomDialog = styled(Dialog)`
  width: 1000px
`
const UpperProfileWrapperDiv = styled('div')`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`
const ProfileItem = styled('div')`
  display: flex;
  flex-direction: column;

  span {
    margin-bottom: 10px;
    color: #6b6b6b;
    font-weight: 500;
  }
`
const LowerProfileWrapperDiv = styled('div')`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 30px
`
const UpperPermissionWrapperDiv = styled('div')`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 50%;
`
const AllowAccessWrapperDiv = styled('div')`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 30px;
`
const AllowAccessItem = styled('div')`
  width: 24%
`
const AllowAccessHeader = styled('span')`
  margin-bottom: 10px;
  font-size: 15px;
  color: #808080
`
const AllowAccessInput = styled('div')`
  display: flex;
  align-items: center;
`
const CustomDatePicker = styled(DatePicker)`
`
const AllowAccessIcon = styled('div')`
  transform: translateX(-25px);
  cursor: pointer;
`
const CustomCalendar = styled(Calendar)`
  height: 35px
`
const AddUserButtonWrapper = styled('div')`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
`
const CustomButton = styled(Button)`
  font-family: vazir, serif;
  margin: auto;
  width: 20%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px
`

const AddUsersModal: React.FC<AddUserModalProps> = ({setModal, modal}) => {

    const toast = useRef<Toast>(null);
    const [permissions, setPermissions] = useState<PermissionsType>({
        username: '',
        password: '',
        "guac-full-name": '',
        "guac-email-address": '',
        "guac-organization": '',
        "guac-organizational-role": ''
    })

    const handleAddUser = async () => {
        const data = {
            username: permissions.username,
            password: permissions.password,
            "attributes": {
                "disabled": permissions.disabled ? `${permissions.disabled}` : "",
                "expired": permissions.expired ? `${permissions.expired}` : "",
                "access-window-start": permissions["access-window-start"] ? moment(permissions["access-window-start"]).startOf('minutes').format('HH:mm:ss') : "",
                "access-window-end": permissions["access-window-end"] ? moment(permissions["access-window-end"]).startOf('minutes').format('HH:mm:ss') : "",
                // @ts-ignore
                "valid-from": permissions["valid-from"] ? moment.unix(permissions["valid-from"] / 1000).format("YYYY-MM-DD") : "",
                // @ts-ignore
                "valid-until": permissions["valid-until"] ? moment.unix(permissions["valid-until"] / 1000).format("YYYY-MM-DD") : "",
                "timezone": null,
                "guac-full-name": permissions["guac-full-name"],
                "guac-organization": permissions["guac-organization"],
                "guac-organizational-role": permissions["guac-organizational-role"],
                "guac-email-address": permissions["guac-email-address"]
            }
        }
        const res = await addUserApi(data)
0
        const permissionsData = []
        if (permissions.ADMINISTER) permissionsData.push({
            op: 'add',
            path: '/systemPermissions',
            value: 'ADMINISTER'
        })
        if (permissions.CREATE_USER) permissionsData.push({
            op: 'add',
            path: '/systemPermissions',
            value: 'CREATE_USER'
        })
        if (permissions.CREATE_USER_GROUP) permissionsData.push({
            op: 'add',
            path: '/systemPermissions',
            value: 'CREATE_USER_GROUP'
        })
        if (permissions.CREATE_CONNECTION) permissionsData.push({
            op: 'add',
            path: '/systemPermissions',
            value: 'CREATE_CONNECTION'
        })
        if (permissions.CREATE_CONNECTION_GROUP) permissionsData.push({
            op: 'add',
            path: '/systemPermissions',
            value: 'CREATE_CONNECTION_GROUP'
        })
        if (permissions.CREATE_SHARING_PROFILE) permissionsData.push({
            op: 'add',
            path: '/systemPermissions',
            value: 'CREATE_SHARING_PROFILE'
        })
        if (permissions.changePassword) permissionsData.push({
            op: 'add',
            path: `/userPermissions/${permissions.username}`,
            value: 'UPDATE'
        })
        const permissionRes = await addUserPermissionsApi(permissionsData, permissions.username)

        if (res.status === 200 && permissionRes.status === 204){
            setModal(false)
        }
    }
    const profileSection = () => {
        return <>
            <UpperProfileWrapperDiv>
                <ProfileItem>
                    <span>Username</span>
                    <InputText
                        placeholder={"Username"}
                        style={{width: '100%', height: '40px'}}
                        onChange={(e) => setPermissions({...permissions, username: e.target.value})}
                        value={permissions.username ? permissions.username : ''}
                    />
                </ProfileItem>
                <ProfileItem>
                    <span>Password</span>
                    <InputText
                        placeholder={"Password"}
                        type={"password"}
                        style={{width: '100%'}}
                        onChange={(e) => setPermissions({...permissions, password: e.target.value})}
                    />
                </ProfileItem>
                <ProfileItem>
                    <span>Re-Enter Password</span>
                    <InputText placeholder={"Re-Enter password"} type={"password"} style={{width: '100%'}}/>
                </ProfileItem>
            </UpperProfileWrapperDiv>
            <LowerProfileWrapperDiv>
                <ProfileItem style={{width: '22%'}}>
                    <span>Full Name</span>
                    <InputText
                        placeholder={"Full name"}
                        style={{width: '100%'}}
                        value={permissions["guac-full-name"]}
                        onChange={(e) => setPermissions({...permissions, "guac-full-name": e.target.value})}
                    />
                </ProfileItem>
                <ProfileItem style={{width: '22%'}}>
                    <span>Email Address</span>
                    <InputText
                        placeholder={"Email Address"}
                        style={{width: '100%'}}
                        value={permissions["guac-email-address"]}
                        onChange={(e) => setPermissions({...permissions, "guac-email-address": e.target.value})}
                    />
                </ProfileItem>
                <div style={{width: '22%'}}>
                    <span>Organizations</span>
                    <InputText
                        placeholder={"Organizations"}
                        style={{width: '100%'}}
                        value={permissions["guac-organization"]}
                        onChange={(e) => setPermissions({...permissions, "guac-organization": e.target.value})}
                    />
                </div>
                <div style={{width: '22%'}}>
                    <span>Organizations Role</span>
                    <InputText
                        placeholder={"Role"}
                        style={{width: '100%'}}
                        value={permissions["guac-organizational-role"]}
                        onChange={(e) => setPermissions({
                            ...permissions,
                            "guac-organizational-role": e.target.value
                        })}
                    />
                </div>
            </LowerProfileWrapperDiv>
        </>
    }
    const permissionSection = () => {
        return <>
            <UpperPermissionWrapperDiv>
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
            </UpperPermissionWrapperDiv>
            <AllowAccessWrapperDiv>
                <AllowAccessItem>
                    <AllowAccessHeader>Allow Access After</AllowAccessHeader>
                    <AllowAccessInput>
                        <CustomCalendar
                            value={permissions["access-window-start"]}
                            onChange={(e) => setPermissions({...permissions, "access-window-start": e.value})}
                            timeOnly
                        />
                        <AllowAccessIcon
                            onClick={() => setPermissions({...permissions, "access-window-start": null})}
                        >
                            <GrPowerReset/>
                        </AllowAccessIcon>
                    </AllowAccessInput>
                </AllowAccessItem>
                <AllowAccessItem>
                    <AllowAccessHeader>Do Not Allow Access After</AllowAccessHeader>
                    <AllowAccessInput>
                        <CustomCalendar
                            value={permissions["access-window-end"]}
                            onChange={(e) => setPermissions({...permissions, "access-window-end": e.value})}
                            timeOnly
                        />
                        <AllowAccessIcon
                            onClick={() => setPermissions({...permissions, "access-window-end": null})}
                        >
                            <GrPowerReset/>
                        </AllowAccessIcon>
                    </AllowAccessInput>
                </AllowAccessItem>
                <AllowAccessItem>
                    <AllowAccessHeader>Enable Account After</AllowAccessHeader>
                    <AllowAccessInput>
                        <CustomDatePicker
                            value={permissions["valid-from"]}
                            onChange={(value) => setPermissions({...permissions, "valid-from": value})}
                            containerStyle={{display: 'block', fontSize: '15px', fontFamily: 'vazir'}}
                            style={{height: '35px', width: '100%', fontFamily: 'vazir'}}
                            calendar={persian}
                            locale={persian_fa}
                            format="YYYY/MM/DD"
                        ></CustomDatePicker>
                        <AllowAccessIcon
                            onClick={() => setPermissions({...permissions, "valid-from": undefined})}
                        >
                            <GrPowerReset/>
                        </AllowAccessIcon>
                    </AllowAccessInput>
                </AllowAccessItem>
                <AllowAccessItem>
                    <AllowAccessHeader>Disable Account After</AllowAccessHeader>
                    <AllowAccessInput>
                        <CustomDatePicker
                            value={permissions["valid-until"]}
                            onChange={(value) => setPermissions({...permissions, "valid-until": value})}
                            containerStyle={{display: 'block', fontSize: '15px', fontFamily: 'vazir'}}
                            style={{height: '35px', width: '100%', fontFamily: 'vazir'}}
                            calendar={persian}
                            locale={persian_fa}
                            format="YYYY/MM/DD"
                        ></CustomDatePicker>
                        <AllowAccessIcon
                            style={{transform: 'translateX(-25px)', cursor: 'pointer'}}
                            onClick={() => setPermissions({...permissions, "valid-until": undefined})}
                        >
                            <GrPowerReset/>
                        </AllowAccessIcon>
                    </AllowAccessInput>
                </AllowAccessItem>
            </AllowAccessWrapperDiv>
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
        </>
    }

    return (
        <CustomDialog onHide={() => setModal(false)} visible={modal} header={"Add User"}>
            <Toast ref={toast}/>
            <Accordion multiple activeIndex={[0, 1]}>
                <AccordionTab header={"Profile"}>
                    {profileSection()}
                </AccordionTab>
                <AccordionTab header={"Permissions"}>
                    {permissionSection()}
                </AccordionTab>
            </Accordion>
            <AddUserButtonWrapper>
                <CustomButton onClick={() => handleAddUser()}>Add User</CustomButton>
            </AddUserButtonWrapper>
        </CustomDialog>

    );
};

export default AddUsersModal;