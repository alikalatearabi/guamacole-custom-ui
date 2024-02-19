import {useEffect, useState} from 'react';
import {Card} from "primereact/card";
import {CiMonitor} from "react-icons/ci";
import {activeConnectionsApi, killConnectionsApi} from "../../api/activeConnections.ts";
import styled from 'styled-components'
import moment from "moment/moment";
import {CiFileOff} from "react-icons/ci";


const PageTitle = styled('p')`
  width: 100%;
  text-align: left;
  padding: 0 30px;
  font-size: 30px;
  font-weight: bold;
  height: 5%
`
const CardsWrapper = styled('div')`
  display: flex;
  align-items: start;
  margin-top: 20px;
  padding: 20px 30px;
  flex-wrap: wrap;
  height: 95%
`
const CustomCard = styled(Card)`
  height: 220px;
  width: 25%;
  margin-right: 10px;
  position: relative;

  .p-card-content {
    padding: 0
  }
`
const CardHeader = styled('div')`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 50px;

  div {
    font-size: 22px;
  }

  svg {
    font-size: 32px;
  }
`
const CardBody = styled('div')`
  height: 100px;
`
const CardFooter = styled('div')`
  background: #ffe1e1;
  position: absolute;
  height: 40px;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: red;
  border-radius: 0 0 5px 5px;
  cursor: pointer;
`
const CardItem = styled('div')`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 50px;
`
const Empty = styled('div')`
  background: rgba(255, 255, 255, 0.63);
  border-radius: 10px;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 30px;
  svg{
    font-size: 120px
  }
`
const Active = () => {

    const [activeConnections, setActiveConnections] = useState<{
        [key: string]: {
            username: string,
            connectionIdentifier: string,
            remoteHost: string,
            startDate: number,
            identifier: string
        }
    }>({})

    const fetchActiveConnections = async () => {
        const res = await activeConnectionsApi()
        if (res.status === 200) {
            setActiveConnections(res.data)
        }
    }

    const handleKillConnection = async (id: string) => {
        try {
            const res = await killConnectionsApi(id);
            if (res.status === 204) {
                setActiveConnections(prevState => {
                    const newState = {...prevState};
                    delete newState[id];
                    console.log(newState);
                    return newState;
                });
            }
        } catch (error) {
            // Handle errors appropriately
            console.error("Error killing connection:", error);
        }
    };


    useEffect(() => {
        fetchActiveConnections().then()
    }, []);

    return (
        <div style={{width: '100%', height: '90%'}}>
            <PageTitle>Active Sessions</PageTitle>
            <CardsWrapper>
                {Object.keys(activeConnections).length > 0 ? Object.keys(activeConnections).map(connection =>
                    <CustomCard key={connection}>
                        <CardHeader>
                            <CiMonitor/>
                            <div>{activeConnections[connection].remoteHost}</div>
                        </CardHeader>
                        <CardBody>
                            <CardItem>
                                <p>Username</p>
                                <span>{activeConnections[connection].username}</span>
                            </CardItem>
                            <CardItem>
                                <p>Active Since</p>
                                <span>{moment.unix(activeConnections[connection].startDate / 1000).format("MM/DD/YYYY HH:mm")}</span>
                            </CardItem>
                        </CardBody>
                        <CardFooter
                            onClick={() => handleKillConnection(activeConnections[connection].identifier)}>Kill
                            Connection</CardFooter>
                    </CustomCard>) : <Empty>
                    <CiFileOff/>
                    <div>No Active Connection</div>
                </Empty>}
            </CardsWrapper>
        </div>
    );
};

export default Active;