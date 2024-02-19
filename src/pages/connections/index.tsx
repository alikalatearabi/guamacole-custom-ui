import {useEffect, useState} from 'react';
import {FaPlus} from "react-icons/fa";
import styled from 'styled-components'
import {deleteConnectionApi, listConnectionsApi} from "../../api/connectionsApi.ts";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import moment from "moment";
import NewConnectionDialog from "./newConnectionDialog.tsx";

import {FaTrash} from "react-icons/fa";
import {MdEdit} from "react-icons/md";
import {Dialog} from "primereact/dialog";
import {Button} from "primereact/button";
import {useNavigate} from "react-router-dom";

const Title = styled('p')`
  width: 100%;
  text-align: left;
  padding: 0 30px;
  font-size: 30px;
  font-weight: bold;
`
const HeaderWrapper = styled('div')`
  width: 100%;
  padding: 10px 30px;
  display: flex;
  align-items: center;
  justify-content: left;
`
const NewConnectionButton = styled('div')`
  width: 25%;
  height: 40px;
  border-radius: 10px;
  box-shadow: 0 1px 2px #d3d3d3;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 10px;
  cursor: pointer;
  background: white;
  font-size: 16px;

  svg {
    font-size: 17px;
    margin-right: 5px;
  }
`
const ActionWrapperDiv = styled('div')`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 60%;

  svg {
    cursor: pointer;
  }
`
const ConnectButton = styled(Button)`
  height: 25px;
  box-shadow: 0 1px 2px #cccccc
`


const Connections = () => {

    const navigate = useNavigate()

    const [deleteConfirm, setDeleteConfirm] = useState(false)
    const [connections, setConnections] = useState<{
        [key: string]: {
            name: string,
            protocol: string,
            identifier: string,
            lastActive: number,
            activeConnections: number
        }
    }[]>([])
    const [identifier, setIdentifier] = useState('')
    const [newConnectionModal, setNewConnectionModal] = useState(false)

    const fetchConnectionsList = async () => {
        const res = await listConnectionsApi()
        if (res.status === 200) {
            setConnections(res.data.childConnections)
        }
    }

    const handleLastActive = (value: { lastActive: number }) => {
        if (!value.lastActive) return '----'
        else return moment.unix(value.lastActive / 1000).format('YYYY/MM/DD HH:mm')
    }

    const handleDeleteConnection = async (id: string) => {
        const res = await deleteConnectionApi(id)
        if (res.status === 204) {
            fetchConnectionsList().then()
            setDeleteConfirm(false)
        }
    }

    const handleActions = (value: { identifier: string, name: string }) => {
        return <ActionWrapperDiv>
            <div onClick={() => {
                setIdentifier(value.identifier)
                setDeleteConfirm(true)
            }}>
                <FaTrash style={{color: '#FE4A49'}}/>
            </div>
            <MdEdit
                onClick={() => {
                    setNewConnectionModal(true)
                    setIdentifier(value.identifier)
                }}
                style={{fontSize: '20px', color: '#40798C'}}
            />
            <ConnectButton onClick={() => {
                navigate(`/panel/terminal/${value.name}/${value.identifier}`)
            }}>Connect</ConnectButton>
        </ActionWrapperDiv>
    }

    const tableHeader = () => {
        return <NewConnectionButton onClick={() => {
            setIdentifier('')
            setNewConnectionModal(true)
        }}>
            <FaPlus/>
            <p>New Connection</p>
        </NewConnectionButton>
    }


    useEffect(() => {
        if (!newConnectionModal) {
            fetchConnectionsList().then()
        }
    }, [newConnectionModal]);

    const Header = () => {
        return <HeaderWrapper>
        </HeaderWrapper>
    }

    return (
        <>
            <Title>Connections</Title>
            <Header/>
            <div style={{padding: '10px 30px', position: 'relative'}}>
                <DataTable value={connections} header={tableHeader} tableStyle={{minWidth: '50rem'}}>
                    <Column field="name" header="name"></Column>
                    <Column field="protocol" header="protocol"></Column>
                    <Column field="activeConnections" header="activeConnections"></Column>
                    <Column field="lastActive" header="lastActive" body={handleLastActive}></Column>
                    <Column field="actions" header="actions" body={handleActions}></Column>
                </DataTable>
                <Dialog onHide={() => setDeleteConfirm(false)} visible={deleteConfirm} header={'Delete Connection'}>
                    <div>Are you sure About Deleting this connection?</div>
                    <div
                        style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '20px'}}>
                        <Button onClick={() => handleDeleteConnection(identifier)}>Confirm</Button>
                        <Button severity="danger" onClick={() => setDeleteConfirm(false)}>Cancel</Button>
                    </div>
                </Dialog>
            </div>
            <NewConnectionDialog
                newConnectionModal={newConnectionModal}
                setNewConnectionModal={setNewConnectionModal}
                //@ts-ignore
                data={connections ? connections.filter(connection => connection.identifier === identifier) : []}
            />
        </>
    );
};

export default Connections;