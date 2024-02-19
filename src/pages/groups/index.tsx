import {useEffect, useState} from 'react';
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import {FaUserAlt} from "react-icons/fa";
import {FaPlus} from "react-icons/fa";
import {InputText} from "primereact/inputtext";
import styled from 'styled-components'
import {fetchGroupApi} from "../../api/api.ts";
import GroupModal from "./addGroupModal.tsx";

const HeaderWrapper = styled('div')`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%
`
const AddDiv = styled('div')`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 12%;
  background: #DDF1F8;
  padding: 5px 20px;
  border-radius: 5px;
  box-shadow: 0 1px 2px #cacaca;
  cursor: pointer;

  p {
    margin: 0
  }
`
const PageHeaderParagraph = styled('p')`
  width: 100%;
  text-align: left;
  padding: 0 30px;
  font-size: 30px;
  font-weight: bold
`

interface Group {
    username: string,
}

const Groups = () => {

    const [detailedModal, setDetailedModal] = useState<string>('')
    // const [filter, setFilter] = useState('')
    const [groups, setGroups] = useState<Group[]>([]);
    const [showAddGroupModal, setShowAddGroupModal] = useState(false)
    const [addGroupData, setAddGroupData] = useState({
        name: '',
        disable: false,
        admin: false,
        addUser: false,
        addGroup: false,
        addConnection: false,
        addConnectionGroup: false,
        addSharingProfile: false
    })

    const getGroupsApi = async () => {
        const res = await fetchGroupApi()
        if (res.status === 200) {
            const data = Object.keys(res.data).map(item => ({username: item}))
            setGroups(data)
        }
    }

    const handleClickUsername =  (rowData: {username: string}) =>{
        setDetailedModal(rowData.username)
        setShowAddGroupModal(true)
    }

    const userBodyTemplate = (rowData: Group) => {
        return (
            <div onClick={() => {handleClickUsername(rowData)}}>
                <div style={{cursor: 'pointer'}}>
                    <FaUserAlt style={{marginRight: '10px', transform: 'translateY(1.5px)'}}/>
                    <span style={{fontSize: '17px'}}>{rowData.username}</span>
                </div>
            </div>
        )
    }
    const header = () => {
        return <HeaderWrapper>
            <AddDiv onClick={() => {
                setDetailedModal('')
                setShowAddGroupModal(true)
            }}>
                <FaPlus/>
                <p>Add Group</p>
            </AddDiv>
            {/*<FilterDiv>*/}
            {/*    <CustomInputText value={filter} onChange={(e) => setFilter(e.target.value)} placeholder={"Filter"}/>*/}
            {/*</FilterDiv>*/}
        </HeaderWrapper>
    }

    useEffect(() => {
        if (!showAddGroupModal) getGroupsApi().then()
    }, [showAddGroupModal]);

    return (
        <>
            <PageHeaderParagraph>Groups</PageHeaderParagraph>
            <div className="card">
                <DataTable value={groups} tableStyle={{minWidth: '50rem'}} header={header} style={{padding: '0 30px'}}>
                    <Column field="username" header="username" body={userBodyTemplate}></Column>
                </DataTable>
            </div>
            <GroupModal
                setShowAddGroupModal={setShowAddGroupModal}
                showAddGroupModal={showAddGroupModal}
                addGroupData={addGroupData} setAddGroupData={setAddGroupData}
                selectedGroup={detailedModal !== '' ? groups.find(group => group.username === detailedModal) : {}}
            />
        </>
    );
};

export default Groups;