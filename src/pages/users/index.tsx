import {useEffect, useState} from 'react';
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import {FaUserAlt} from "react-icons/fa";
import {FaPlus} from "react-icons/fa";
import {fetchUsersApi} from "../../api/api.ts";
import EditUsersModal from "./editUsersModal.tsx";
import AddUserModal from "./addUserModal.tsx";
import styled from "styled-components";
import {unixToUTC} from "./utils.ts";
import {UsersData} from "./types.ts";

const CustomDataTable = styled(DataTable)`
  .p-datatable-wrapper {
    border-radius: 0 0 10px 10px;
  }

  .p-datatable-header {
    border-radius: 10px 10px 0 0;
  }
`
const HeaderWrapper = styled('div')`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`
const AddUserButton = styled('div')`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 10%;
  background: #DDF1F8;
  padding: 5px 20px;
  border-radius: 5px;
  box-shadow: 0 1px 2px #cacaca;
  cursor: pointer;

  p {
    margin: 0
  }
`
const HeaderTitle = styled('p')`
  width: 100%;
  text-align: left;
  padding: 0 30px;
  font-size: 30px;
  font-weight: bold
`

const Users = () => {

    const [users, setUsers] = useState<UsersData[]>([]);
    const [editUserModal, setEditUserModal] = useState<boolean>(false)
    const [addUserModal, setAddUserModal] = useState<boolean>(false)
    const [modalId, setModalId] = useState('')

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
        if (!addUserModal && !editUserModal) getAllUsers().then()
    }, [addUserModal, editUserModal]);

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
        return <HeaderWrapper>
            <AddUserButton onClick={() => setAddUserModal(true)}>
                <FaPlus/>
                <p>Add User</p>
            </AddUserButton>
        </HeaderWrapper>
    }

    const dataTableProps = {
        value: users,
        tableStyle: { minWidth: '50rem' },
        header: header,
        style: { padding: '0 30px' }
    };

    const editUserModalProps = {
        setModal: setEditUserModal,
        modal: editUserModal,
        data : users.find(user => user.username === modalId)
    }

    return (
        <>
            <HeaderTitle>Users</HeaderTitle>
            <div className="card">
                <CustomDataTable {...dataTableProps}>
                    <Column field="username" header="username" body={userBodyTemplate}></Column>
                    <Column field="lastActive" header="last active"></Column>
                </CustomDataTable>
                <EditUsersModal {...editUserModalProps}/>
                <AddUserModal modal={addUserModal} setModal={setAddUserModal}/>
            </div>
        </>
    );
};

export default Users;