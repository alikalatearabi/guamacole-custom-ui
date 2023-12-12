import React, {useState} from 'react';
import {InputText} from "primereact/inputtext";
import {CiFilter} from "react-icons/ci";
import {Card} from "primereact/card";
import { FaDownload } from "react-icons/fa";


const History = () => {

    const [filter, setFilter] = useState('')
    const [activeConnections, setActiveConnections] = useState('')

    return (
        <div>
            <p style={{
                width: '100%',
                textAlign: 'left',
                padding: '0 30px',
                fontSize: '30px',
                fontWeight: 'bold'
            }}>History</p>
            <div style={{
                width: '100%',
                padding: '10px 30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'left'
            }}>
                <InputText
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    placeholder={"Filter"}
                    style={{width: '40%', height: '40px'}}
                />
                <div style={{
                    width: '15%',
                    height: '40px',
                    border: '1px solid #d1d5db',
                    borderRadius: '5px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginLeft: '10px',
                    cursor: 'pointer',
                    background: 'white'
                }}>
                    <CiFilter style={{fontSize: '25px'}}/>
                    <p>Filter</p>
                </div>
                <div style={{
                    width: '15%',
                    height: '40px',
                    border: '1px solid #d1d5db',
                    borderRadius: '5px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginLeft: '10px',
                    cursor: 'pointer',
                    background: 'white'
                }}>
                    <FaDownload style={{fontSize: '20px', marginRight: '5px'}}/>
                    <p>Download</p>
                </div>
            </div>
            <div style={{display: 'flex', alignItems: "center", marginTop: '20px', padding: '20px 30px'}}>
                <Card title="Username" style={{width: '20%', marginRight: '10px'}}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: '90%',
                        margin: 'auto'
                    }}>
                        <p>Start Time</p>
                        <span>14-2-2022</span>
                    </div>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: '90%',
                        margin: 'auto'
                    }}>
                        <p>Duration</p>
                        <span>5 min</span>
                    </div>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: '90%',
                        margin: 'auto'
                    }}>
                        <p>Remote Host</p>
                        <span>1.1.1.1</span>
                    </div>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: '90%',
                        margin: 'auto'
                    }}>
                        <p>Connection Name</p>
                        <span>Ubuntu</span>
                    </div>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: "center",
                        width: '90%',
                        height: '40px',
                        margin: '20px auto 0 auto',
                        background: '#67BFE0',
                        borderRadius: '5px',
                        color: 'white'

                    }}>
                        <p>Logs</p>
                    </div>
                </Card>
                <Card title="Username" style={{width: '20%', marginRight: '10px'}}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: '90%',
                        margin: 'auto'
                    }}>
                        <p>Start Time</p>
                        <span>12-3-2022</span>
                    </div>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: '90%',
                        margin: 'auto'
                    }}>
                        <p>Duration</p>
                        <span>1 min</span>
                    </div>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: '90%',
                        margin: 'auto'
                    }}>
                        <p>Remote Host</p>
                        <span>98.207.219.41</span>
                    </div>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: '90%',
                        margin: 'auto'
                    }}>
                        <p>Connection Name</p>
                        <span>Fedora</span>
                    </div>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: "center",
                        width: '90%',
                        height: '40px',
                        margin: '20px auto 0 auto',
                        background: '#67BFE0',
                        borderRadius: '5px',
                        color: 'white'

                    }}>
                        <p>Logs</p>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default History;