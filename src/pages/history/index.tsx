import {ConnectionsHistoryApi} from "../../api/connectionsApi.ts";
import {useEffect, useState} from "react";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import moment from "moment";
import styled from "styled-components";

const CustomDataTable = styled(DataTable)`
  .p-datatable-wrapper{
    border-radius: 10px 10px 0 0;
  }
`


const History = () => {

    const [connectionHistory, setConnectionHistory] = useState([])

    const fetchConnectionsHistory = async () =>{
        const res = await ConnectionsHistoryApi()
        if (res.status === 200) {
            setConnectionHistory(res.data)
        }
    }

    const handleStartDate = (value: {startDate: number}) => {
        return moment.unix(value.startDate / 1000).format("MM/DD/YYYY HH:mm")
    }
    const handleDuration = (value: {startDate: number, endDate: number}) => {
        const differenceInSeconds = Math.abs(value.endDate - value.startDate) / 1000;
        if (differenceInSeconds < 60) return `${differenceInSeconds} Second`
        else return `${Math.floor(differenceInSeconds / 60)} Minutes`


    }

    useEffect(() => {
        fetchConnectionsHistory().then()
    }, []);


    return (
        <div>
            <CustomDataTable value={connectionHistory} tableStyle={{ minWidth: '50rem' }} paginator rows={10}>
                <Column field="username" header="username"></Column>
                <Column field="startDate" header="start time" body={handleStartDate}></Column>
                <Column field="" header="Duration" body={handleDuration}></Column>
                <Column field="connectionName" header="Connection Name"></Column>
            </CustomDataTable>
        </div>
    );
};

export default History;