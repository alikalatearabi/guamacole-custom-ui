import React, {useEffect, useState} from 'react';
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import {usersData} from "./userMockData.ts";
import {FaUserAlt} from "react-icons/fa";
import {FaPlus} from "react-icons/fa";
import {InputText} from "primereact/inputtext";


interface Users {
    username: string,
    last_active: string
}

const Users = () => {

    const [filter, setFilter] = useState('')
    const [users, setUsers] = useState<{
        username: string,
        last_active: string
    }[]>([]);

    useEffect(() => {
        setUsers(usersData)
    }, []);

    const userBodyTemplate = (rowData: Users) => {
        return (
            <div>
                <div className="flex align-items-center gap-2">
                    <FaUserAlt style={{marginRight: '10px', transform: 'translateY(1.5px)'}}/>
                    <span style={{fontSize: '17px'}}>{rowData.username}</span>
                </div>
            </div>
        )
    }

    const header = () => {
        return <div style={{display: 'flex', alignItems: "center", justifyContent: 'space-between', width: '100%'}}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '10%',
                background: '#DDF1F8',
                padding: '5px 20px',
                borderRadius: '5px',
                boxShadow: '0 1px 2px #cacaca',
                cursor: 'pointer'
            }}>
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
                <DataTable value={users} tableStyle={{minWidth: '50rem'}} header={header} style={{padding: '0 30px'}}>
                    <Column field="username" header="username" body={userBodyTemplate}></Column>
                    <Column field="last_active" header="last_active"></Column>
                </DataTable>
            </div>
        </>
    );
};

export default Users;