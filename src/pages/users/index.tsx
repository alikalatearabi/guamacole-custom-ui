import React, {useEffect, useState} from 'react';
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import {FaUserAlt} from "react-icons/fa";
import {FaPlus} from "react-icons/fa";
import {InputText} from "primereact/inputtext";
import {fetchUsersApi} from "../../api/api.ts";
import EditUsersModal from "./editUsersModal.tsx";
import AddUserModal from "./addUserModal.tsx";


export interface UsersData {
    username: string,
    lastActive: string,
    attributes: {
        "access-window-end": string,
        "access-window-start": string,
        disabled: string,
        expired: string,
        "guac-email-address": string,
        "guac-full-name": string,
        "guac-organization": string,
        "guac-organizational-role": string,
        timezone: string,
        "valid-from": string,
        "valid-until": string
    }
}

const Users = () => {

    const [filter, setFilter] = useState('')
    const [users, setUsers] = useState<UsersData[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<UsersData[]>([]);
    const [editUserModal, setEditUserModal] = useState<boolean>(false)
    const [addUserModal, setAddEditUserModal] = useState<boolean>(false)
    const [modalId, setModalId] = useState('')

    const unixToUTC = (unix: string) => {
        if (unix) {
            const date = new Date(unix)
            return date.toUTCString()
        } else return '----'

    }

    useEffect(() => {
        const getAllUsers = async () => {
            const res = await fetchUsersApi()
            if (Object.keys(res.data)) {
                setUsers(Object.keys(res.data).map(key => ({
                    username: key,
                    lastActive: unixToUTC(res.data[key].lastActive),
                    attributes: res.data[key].attributes
                })))
            }
        }
        getAllUsers().then()
    }, []);

    useEffect(() => {
        if (filter !== '') {
            const filtered = users.filter(user => user.username.includes(filter))
            setFilteredUsers(filtered)
        } else setFilteredUsers([])
    }, [filter]);

    const userBodyTemplate = (rowData: UsersData) => {
        return (
            <div>
                <div className="flex align-items-center gap-2">
                    <FaUserAlt style={{marginRight: '10px', transform: 'translateY(1.5px)'}}/>
                    <span
                        style={{fontSize: '17px', cursor: 'pointer'}}
                        onClick={() => {
                            setEditUserModal(true);
                            setModalId(rowData.username)
                        }}
                    >{rowData.username}</span>
                </div>
            </div>
        )
    }

    const header = () => {
        return <div style={{display: 'flex', alignItems: "center", justifyContent: 'space-between', width: '100%'}}>
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '10%',
                    background: '#DDF1F8',
                    padding: '5px 20px',
                    borderRadius: '5px',
                    boxShadow: '0 1px 2px #cacaca',
                    cursor: 'pointer'
                }}
                onClick={() => setAddEditUserModal(true)}
            >
                <FaPlus/>
                <p style={{margin: '0'}}>Add User</p>
            </div>
            <div style={{
                width: '90%',
                padding: '10px 30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'right',
            }}>
                <InputText
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    placeholder={"Filter"}
                    style={{width: '40%', height: '37px'}}
                />
            </div>
        </div>
    }


    return (
        <>
            <p style={{
                width: '100%',
                textAlign: 'left',
                padding: '0 30px',
                fontSize: '30px',
                fontWeight: 'bold'
            }}>Users</p>
            <div className="card">
                <DataTable value={filteredUsers.length ? filteredUsers : users} tableStyle={{minWidth: '50rem'}}
                           header={header} style={{padding: '0 30px'}}>
                    <Column
                        field="username"
                        header="username"
                        body={userBodyTemplate}
                    ></Column>
                    <Column field="lastActive" header="last active"></Column>
                </DataTable>
                <EditUsersModal
                    setModal={setEditUserModal}
                    modal={editUserModal}
                    data={users.find(user => user.username === modalId)}
                />
                <AddUserModal modal={addUserModal} setModal={setAddEditUserModal} />
            </div>
        </>
    );
};

export default Users;