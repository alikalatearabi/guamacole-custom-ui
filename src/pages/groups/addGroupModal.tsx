import React, {useEffect, useState} from 'react';
import {InputText} from "primereact/inputtext";
import {Checkbox} from "primereact/checkbox";
import styled from "styled-components";
import {Dialog} from "primereact/dialog";
import {
    addGroupApi,
    addGroupMembers,
    addGroupPermissionsApi,
    fetchSelectedGroupApi,
    fetchSelectedGroupMembers,
    fetchSelectedGroupPermissions,
    fetchUsersApi, updateGroupApi
} from "../../api/api.ts";
import {Button} from "primereact/button";
import {MdCancel} from "react-icons/md";


const CustomDialog = styled(Dialog)`
  width: 800px
`
const AddGroupWrapper = styled('div')`

`
const AddGroupItem = styled('div')`
  display: flex;
  flex-direction: column;

  span {
    margin-bottom: 5px;
  }
`
const AddModalCheckboxWrapper = styled('div')`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
`
const AddGroupItemCheckbox = styled('div')`
  margin-top: 10px;
  width: 40%;
  display: flex;
  align-items: center;
  justify-content: space-between;

  span {
    margin-right: 10px
  }
`
const AddModalMember = styled('div')`
  margin-top: 10px;
  display: flex;
  align-items: start;
  justify-content: space-between;
  flex-direction: column;
  flex-wrap: wrap;
`
const MemberTag = styled('div')`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid grey;
  padding: 5px 10px;
  border-radius: 15px;
`
const AddModalConnections = styled('div')`

`
const AddModalSubmitButton = styled('div')`
  margin-top: 20px;

  button {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px
  }
`
const AddMembersWrapper = styled('div')`
  display: flex;
  align-items: center;
  width: 100%;
  margin-top: 20px;
  flex-wrap: wrap;
  div{
  }
`
const SectionTitle = styled('p')`
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 0;
`
const CustomInputText = styled(InputText)`
  height: 35px;
  border-radius: 5px;
  margin-top: 20px;
`

interface AddGroupModalProp {
    setShowAddGroupModal: (value: boolean) => void,
    showAddGroupModal: boolean,
    addGroupData: {
        [key: string]: string | boolean,
        name: string,
        disable: boolean,
        admin: boolean,
        addUser: boolean,
        addGroup: boolean,
        addConnection: boolean,
        addConnectionGroup: boolean,
        addSharingProfile: boolean
    },
    setAddGroupData: (value: any) => void,
    // @ts-ignore
    selectedGroup: any
}

const checkboxOptions = [
    { key: "disabled", label: "Disable Group" },
    { key: "administer", label: "Administer System" },
    { key: "create_user", label: "Create New Users" },
    { key: "create_user_group", label: "Create New User Groups" },
    { key: "create_connection", label: "Create New Connections" },
    { key: "create_connection_group", label: "Create New Connection groups" },
    { key: "create_sharing_profile", label: "Create New Connection groups" },
];

const createCheckbox = (label: string, checked: boolean, onChange: any) => (
    <AddGroupItemCheckbox key={label}>
        <span>{label}</span>
        <Checkbox checked={checked} onClick={onChange} />
    </AddGroupItemCheckbox>
);

const GroupModal: React.FC<AddGroupModalProp> = ({
                                                     setShowAddGroupModal,
                                                     showAddGroupModal,
                                                     addGroupData,
                                                     setAddGroupData,
                                                     selectedGroup
                                                 }) => {

    const [users, setUsers] = useState<object>({})
    const [checkedUsers, setCheckedUsers] = useState<string[]>([])
    const [groupData, setGroupData] = useState({
        name: '',
        disabled: '',
        create_user: false,
        administer: false,
        create_user_group: false,
        create_connection: false,
        create_connection_group: false,
        create_sharing_profile: false,
        members: []
    })

    const handleCheckUsers = (user: string) => {
        if (checkedUsers.includes(user)) {
            const filteredUsers = checkedUsers.filter(checkUser => checkUser !== user)
            setCheckedUsers(filteredUsers)
        } else {
            setCheckedUsers([...checkedUsers, user])
        }
    }
    const handleAddGroup = async () => {
        try {
            const GroupPermissionsData = []
            const groupMembers: {
                op: string,
                path: string,
                value: string
            }[] = []

            if (addGroupData.admin) {
                GroupPermissionsData.push({
                    op: "add",
                    path: '/systemPermissions',
                    value: 'ADMINISTER'
                })
            }
            if (addGroupData.addUser) {
                GroupPermissionsData.push({
                    op: "add",
                    path: '/systemPermissions',
                    value: 'CREATE_USER'
                })
            }
            if (addGroupData.addGroup) {
                GroupPermissionsData.push({
                    op: "add",
                    path: '/systemPermissions',
                    value: 'CREATE_USER_GROUP'
                })
            }
            if (addGroupData.addConnection) {
                GroupPermissionsData.push({
                    op: "add",
                    path: '/systemPermissions',
                    value: 'CREATE_CONNECTION'
                })
            }
            if (addGroupData.addConnectionGroup) {
                GroupPermissionsData.push({
                    op: "add",
                    path: '/systemPermissions',
                    value: 'CREATE_CONNECTION_GROUP'
                })
            }
            if (addGroupData.addSharingProfile) {
                GroupPermissionsData.push({
                    op: "add",
                    path: '/systemPermissions',
                    value: 'CREATE_SHARING_PROFILE'
                })
            }

            checkedUsers.map(user => groupMembers.push({
                op: 'add',
                path: '/',
                value: user
            }))

            const userGroupData = {
                attributes: {disabled: addGroupData.disable ? `${addGroupData.disable}` : ''},
                identifier: Object.keys(selectedGroup).length > 0 ? selectedGroup.username : addGroupData.name
            }

            let userGroupRes;
            if (Object.keys(selectedGroup).length > 0){
                userGroupRes = await updateGroupApi(userGroupData, selectedGroup.username)
            }else{
                userGroupRes = await addGroupApi(userGroupData)
            }

            if (userGroupRes.status === 200) {
                const addGroupPermissionsRes = await addGroupPermissionsApi(GroupPermissionsData, addGroupData.name)
                if (addGroupPermissionsRes.status === 204) {
                    const addGroupMembersRes = await addGroupMembers(groupMembers, addGroupData.name)
                    if (addGroupMembersRes.status === 204) {
                        setShowAddGroupModal(false)
                    }
                }
            }
        } catch (error: unknown) {
            console.log(error)
        }
    }
    const fetchUsers = async () => {
        const res = await fetchUsersApi()
        if (res.status === 200) {
            setUsers(res.data)
        }
    }
    const fetchGroupsData = async () => {
        const infoRes = await fetchSelectedGroupApi(selectedGroup.username)
        const permissionsRes = await fetchSelectedGroupPermissions(selectedGroup.username)
        const membersRes = await fetchSelectedGroupMembers(selectedGroup.username)

        if (infoRes.status === 200 && permissionsRes.status === 200 && membersRes.status === 200) {
            const permissions = permissionsRes.data.systemPermissions
            setGroupData({
                name: infoRes.data.identifier,
                disabled: infoRes.data.attributes.disabled,
                create_user: !!permissions.includes("CREATE_USER"),
                administer: !!permissions.includes("ADMINISTER"),
                create_user_group: !!permissions.includes("CREATE_USER_GROUP"),
                create_connection: !!permissions.includes("CREATE_CONNECTION"),
                create_connection_group: !!permissions.includes("CREATE_CONNECTION_GROUP"),
                create_sharing_profile: !!permissions.includes("CREATE_SHARING_PROFILE"),
                members: membersRes.data
            })
        }
    }
    const renderCheckboxGroup = (options, data, setData) => options.map((option) =>
            createCheckbox(
                option.label,
                Object.keys(selectedGroup).length > 0 ? data[option.key] : addGroupData[option.key],
                () => {
                    Object.keys(selectedGroup).length > 0
                        ? setData({ ...data, [option.key]: !data[option.key] })
                        : setAddGroupData({ ...addGroupData, [option.key]: !addGroupData[option.key] });
                }
            )
        );

    const membersTag = () => {
        return Object.keys(selectedGroup).length > 0 &&
            groupData.members.map(member => <MemberTag>
                    <MdCancel style={{marginRight: '10px', cursor: 'pointer'}}/>
                    <p style={{margin: '0'}}>{member}</p>
                </MemberTag>
            )
    }
    const addMembersTag = () => {
        return <AddMembersWrapper>
            {Object.keys(users).length > 0 && Object.keys(users).map(user =>
                <div key={user} style={{marginRight: '20px'}}>
                    <Checkbox
                        checked={checkedUsers.includes(user)}
                        onClick={() => handleCheckUsers(user)}
                    />
                    <span style={{marginLeft: '10px'}}>{user}</span>
                </div>
            )}
        </AddMembersWrapper>
    }

    useEffect(() => {
        fetchUsers().then()
        if (Object.keys(selectedGroup).length > 0) {
            fetchGroupsData().then()
        }
    }, [selectedGroup]);
    useEffect(() => {
        if (groupData.members.length > 0){
            setCheckedUsers([...checkedUsers, ...groupData.members])
        }
    }, [groupData.members]);

    return <CustomDialog
        onHide={() => setShowAddGroupModal(false)}
        visible={showAddGroupModal}
        header={Object.keys(selectedGroup).length > 0 ? groupData.name : 'Add Group'}
    >
        <AddGroupWrapper>
            {Object.keys(selectedGroup).length === 0 && <AddGroupItem>
                <CustomInputText
                    value={addGroupData.name}
                    onChange={(e) => setAddGroupData({...addGroupData, name: e.target.value})}
                    placeholder={'Choose Group Name'}
                />
            </AddGroupItem>}
            <SectionTitle>Permissions</SectionTitle>
            <AddModalCheckboxWrapper>
                {renderCheckboxGroup(checkboxOptions, groupData, setGroupData)}
            </AddModalCheckboxWrapper>
            <SectionTitle>Users</SectionTitle>
            <AddModalMember>
                {membersTag()}
                {addMembersTag()}
            </AddModalMember>
            <SectionTitle>Connections</SectionTitle>
            <AddModalConnections></AddModalConnections>
            <AddModalSubmitButton onClick={() => handleAddGroup()}>
                <Button>{Object.keys(selectedGroup).length > 0 ? "Update Group" : "Add Group"}</Button>
            </AddModalSubmitButton>
        </AddGroupWrapper>
    </CustomDialog>
};

export default GroupModal;