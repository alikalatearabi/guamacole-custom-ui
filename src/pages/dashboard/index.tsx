import {Accordion, AccordionTab} from 'primereact/accordion';
import {useEffect, useState} from "react";
import Empty from "../../components/empty";
import {fetchRecentConnections} from "../../api/api.ts";

const Dashboard = () => {
    const [recentConnections, setRecentConnections] = useState('')

    useEffect(() => {
        const apiCallRecentConnections = async () => {
            // const res = await fetchRecentConnections()
            // if (res) setRecentConnections(res)
        }
        apiCallRecentConnections().then()
    }, []);

    return (
        <>
            <Accordion activeIndex={[0, 1]} multiple style={{height: '100%'}}>
                <AccordionTab header="Recent Connections">
                    {recentConnections.length ? <div></div> : <Empty/>}
                </AccordionTab>
                <AccordionTab header="All Connections" >
                    {recentConnections.length ? <div></div> : <Empty/>}
                </AccordionTab>
            </Accordion>
        </>
    );
};

export default Dashboard;