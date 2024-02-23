import {Accordion, AccordionTab} from 'primereact/accordion';
import {useEffect, useState} from "react";
import Empty from "../../components/empty";
import {listConnectionsApi} from "../../api/connectionsApi.ts";
import styled from 'styled-components'
import {IoMdArrowDropright} from "react-icons/io";
import {Link} from "react-router-dom";
import {fetchEffectivePermissionsApi} from "../../api/api.ts";
import {useRecoilState, useSetRecoilState} from "recoil";
import {permissionAtom} from "../../recoil/atom/permissionAtom.ts";

const ConnectionItem = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  cursor: pointer;
`
const RecentConnectionImage = styled('img')`
  width: 200px;
  cursor: pointer;
`

const Dashboard = () => {

    const [permissionsAtom ,setPermissionsAtom] = useRecoilState(permissionAtom)

    const recent = JSON.parse(localStorage.getItem('GUAC_HISTORY'))
    const [recentImageUrl, setRecentImageUrl] = useState('');
    const [recentConnectionName, setRecentConnectionName] = useState('')
    const [listConnections, setListConnections] = useState<{
        [key: string]: {
            name: string,
            identifier: string
        }
    }>({})

    const fetchListConnections = async () => {
        const res = await listConnectionsApi()
        if (res.status === 200) {
            setListConnections(res.data.childConnections)
        }
    }
    const fetchRecentConnection = () => {
        if (recent) {
            setRecentConnectionName(recent[0].name)
            const binaryString = atob(recent[0].thumbnail.split(',')[1]);
            const byteArray = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
                byteArray[i] = binaryString.charCodeAt(i);
            }
            const blob = new Blob([byteArray], {type: 'image/png'});
            const url = URL.createObjectURL(blob);
            setRecentImageUrl(url);
        }
    }
    const fetchEffectivePermissions = async () => {
        const res = await fetchEffectivePermissionsApi()
        if (res.status === 200) {
            setPermissionsAtom(()=> ({
                systemPermissions: res.data.systemPermissions,
                userPermissions: res.data.userPermissions
            }))
        }
    }

    useEffect(() => {
        fetchListConnections().then()
        fetchRecentConnection()
        fetchEffectivePermissions().then()
    }, []);


    return (
        <div style={{width: '100%', height: '100%'}} id={'connection_body'}>
            <Accordion multiple activeIndex={[0, 1]} style={{height: '45%'}}>
                <AccordionTab header="Recent Connection">
                    {recentImageUrl && <Link to={`/panel/terminal/${recent[0].name}/${recent[0].id}`}>
                        <RecentConnectionImage src={recentImageUrl} alt="Base64 Image"/>
                        <div>{recentConnectionName}</div>
                    </Link>}
                </AccordionTab>
                <AccordionTab header="All Connections">
                    {listConnections && Object.keys(listConnections).length > 0 ? Object.keys(listConnections).map(connection =>
                        <ConnectionItem
                            key={connection}
                            to={`/panel/terminal/${listConnections[connection].name}/${listConnections[connection].identifier}`}
                        >
                            <IoMdArrowDropright/>
                            {listConnections[connection].name}
                        </ConnectionItem>) : <Empty/>}
                </AccordionTab>
            </Accordion>
        </div>
    );
};

export default Dashboard;