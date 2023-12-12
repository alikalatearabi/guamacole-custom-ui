import React, {useState} from 'react';
import {InputText} from "primereact/inputtext";
import {CiFilter} from "react-icons/ci";
import {Card} from "primereact/card";


const Active = () => {

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
            }}>Active Sessions</p>
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
                    cursor: 'pointer'
                }}>
                    <CiFilter style={{fontSize: '25px'}}/>
                    <p>Filter</p>
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
                        <p>Connection Time</p>
                        <span>20 min</span>
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
                        <p>Connection Time</p>
                        <span>20 min</span>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Active;