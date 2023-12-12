import React, {useState} from 'react';
import {InputText} from "primereact/inputtext";
import {CiFilter} from "react-icons/ci";
import {FaPlus} from "react-icons/fa";
import {Card} from "primereact/card";
import {Dialog} from "primereact/dialog";

const Connections = () => {

    const [filter, setFilter] = useState('')
    const [modalVisible, setModalVisible] = useState(false)


    return (
        <>
            <p style={{
                width: '100%',
                textAlign: 'left',
                padding: '0 30px',
                fontSize: '30px',
                fontWeight: 'bold'
            }}>Connections</p>
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
                    <FaPlus style={{fontSize: '20px', marginRight: '5px'}}/>
                    <p>New Connection</p>
                </div>
            </div>
            <div style={{padding: '10px 30px'}}>
                <Card title={"Ubuntu"} style={{width: '20%', marginRight: '10px'}}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: "center",
                        width: '90%',
                        height: '30px',
                        margin: '0px auto 0 auto',
                        background: '#67BFE0',
                        borderRadius: '5px',
                        color: 'white',
                        cursor: 'pointer'
                    }}
                         onClick={() => setModalVisible(true)}
                    >
                        <p>Details</p>
                    </div>
                </Card>
                <Dialog
                    onHide={() => setModalVisible(false)}
                    visible={modalVisible}
                    style={{width: '450px'}}
                    header={"Ubuntu"}
                >
                    <Card style={{width: '100%', boxShadow: 'unset'}}>
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
                </Dialog>
            </div>
        </>
    );
};

export default Connections;