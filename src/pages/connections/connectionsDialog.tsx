import React, {useEffect, useState} from 'react';
import {Card} from "primereact/card";
import {Dialog} from "primereact/dialog";
import {
    detailsConnectionApi,
    detailsConnectionHistoryApi,
    detailsConnectionParametersApi
} from "../../api/connectionsApi.ts";
import styled from 'styled-components'
import moment from 'moment'


const CustomDialog = styled(Dialog)`
  width: 65%
`
const CustomCard = styled(Card)`
  width: 100%;
  box-shadow: unset;
`
const CardItemsWrapper = styled('div')`
  display: flex;
  align-items: start;
  justify-content: flex-start;
  flex-wrap: wrap;
`
const CardItem = styled('div')`
  display: flex;
  align-items: start;
  flex-direction: column;
  width: 20%;
  margin-bottom: 25px;

  p {
    font-size: 15px;
    color: #5b5b5b;
    margin: 0
  }

  span {
    font-size: 17px
  }
`
const LogsButton = styled('div')`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 40px;
  margin: 20px auto 0 auto;
  background: #67BFE0;
  border-radius: 5px;
  color: white;
  cursor: pointer;
`

interface ConnectionsDialogProps {
    setModalVisible: (value: boolean) => void,
    modalVisible: boolean,
    id: string
}

const ConnectionsDialog: React.FC<ConnectionsDialogProps> = ({setModalVisible, modalVisible, id}) => {

    const [connectionDetails, setConnectionDetails] = useState<{
        activeConnections: number,
        lastActive: number,
        name: string,
        protocol: string,
        attributes: {
            weight: string,
            "max-connections": string,
            "max-connections-per-user": string
        }
    }>({
        activeConnections: 0,
        lastActive: 0,
        name: '',
        protocol: '',
        attributes: {
            weight: '0',
            "max-connections": '0',
            "max-connections-per-user": '0'
        }

    })
    const [connectionParameter, setConnectionParameter] = useState<{
        hostname: string,
        password: string,
        port: string,
        username: string
    }>({
        hostname: '',
        password: '',
        port: '',
        username: ''
    })
    const [connectionHistory, setConnectionHistory] = useState([])

    const fetchConnectionDetails = async () => {
        const res = await detailsConnectionApi(id)
        if (res.status === 200) setConnectionDetails(res.data)
    }

    const fetchConnectionParameters = async () => {
        const res = await detailsConnectionParametersApi(id)
        if (res.status === 200) {
            setConnectionParameter(res.data)
        }
    }

    const fetchConnectionHistory = async () =>{
        const res = await detailsConnectionHistoryApi(id)
        if (res.status === 200){
            setConnectionHistory(res.data)
            console.log(connectionHistory)
        }
    }



    useEffect(() => {
        fetchConnectionDetails().then()
        fetchConnectionParameters().then()
        fetchConnectionHistory().then()
    }, []);


    return (
        <CustomDialog
            onHide={() => setModalVisible(false)}
            visible={modalVisible}
            header={"Details"}
        >
            <CustomCard>
                <CardItemsWrapper>
                    <CardItem>
                        <p>Host</p>
                        <span>{connectionParameter.hostname}</span>
                    </CardItem>
                    <CardItem>
                        <p>Port</p>
                        <span>{connectionParameter.port}</span>
                    </CardItem>
                    <CardItem>
                        <p>Username</p>
                        <span>{connectionParameter.username}</span>
                    </CardItem>
                    <CardItem>
                        <p>Connection Name</p>
                        <span>{connectionDetails.name}</span>
                    </CardItem>
                    <CardItem>
                        <p>Active Connections</p>
                        <span>{connectionDetails.activeConnections}</span>
                    </CardItem>
                    <CardItem>
                        <p>Last Active</p>
                        <span>{moment.unix(connectionDetails.lastActive / 1000).format("MM/DD/YYYY HH:mm")}</span>
                    </CardItem>
                    <CardItem>
                        <p>Protocol</p>
                        <span>{connectionDetails.protocol}</span>
                    </CardItem>
                    <CardItem>
                        <p>Connection Weight</p>
                        <span>{connectionDetails.attributes.weight}</span>
                    </CardItem>
                    <CardItem>
                        <p>Max Connection</p>
                        <span>{connectionDetails.attributes["max-connections"]}</span>
                    </CardItem>
                    <CardItem>
                        <p>Max Connection Per User</p>
                        <span>{connectionDetails.attributes["max-connections-per-user"]}</span>
                    </CardItem>
                </CardItemsWrapper>
                <LogsButton>
                    <p>Logs</p>
                </LogsButton>
            </CustomCard>
        </CustomDialog>
    );
};

export default ConnectionsDialog;