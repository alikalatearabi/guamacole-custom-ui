import React, {useEffect, useMemo, useState} from 'react';
import {Dialog} from "primereact/dialog";
import styled from "styled-components";
import {InputText} from "primereact/inputtext";
import {ConnectionData, NewConnectionModalProps} from "./types.ts";
import {Dropdown} from "primereact/dropdown";
import {Button} from "primereact/button";
import {InputNumber} from "primereact/inputnumber";
import {ConnectionPayload} from "./connectionPayload.ts";
import {encryption, protocols, securityMode} from "./const.ts";
import {detailsConnectionParametersApi} from "../../api/connectionsApi.ts";

const ConnectionSpecs = styled('div')`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;

`
const ConnectionSpecsItem = styled('div')`
  margin-top: 10px;
  display: flex;
  align-items: start;
  flex-direction: column;
  width: 32%;

  .p-dropdown {
    width: 100%
  }

  .p-inputtext {
    width: 100%;
  }
`
const CustomDialog = styled(Dialog)`
  width: 1000px
`
const ButtonWrapper = styled('div')`
  margin-top: 20px;
  width: 100%;

  button {
    border-radius: 20px;
    box-shadow: 0 1px 2px #bbbbbb;
    margin: auto;
    width: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
  }
`

const NewConnectionDialog: React.FC<NewConnectionModalProps> = ({setNewConnectionModal, newConnectionModal, data}) => {

    const [connectionData, setConnectionData] = useState<ConnectionData>({
        attributes: {
            "failover-only": '',
            "guacd-encryption": {name: '', code: ''},
            "weight": '',
            "max-connections": '',
            "guacd-hostname": '',
            "guacd-port": '',
            "max-connections-per-user": ''
        },
        // @ts-ignore
        parameters: {
            hostname: '',
            password: '',
        },
        name: '',
        parentIdentifier: 'ROOT',
        protocol: {name: '', code: ''}
    })

    const handleAddConnection = async () => {
        const res = await ConnectionPayload(connectionData, data.length > 0 ? 'EDIT' : 'ADD')
        if (res?.status === 200 || res?.status === 204) {
            setNewConnectionModal(false)
        }
    }

    const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setConnectionData({
            ...connectionData,
            attributes: {...connectionData.attributes, "failover-only": e.target.checked ? 'failOver' : ''}
        })
    };
    const handleDisableAuth = (e: React.ChangeEvent<HTMLInputElement>) => {
        setConnectionData({
            ...connectionData,
            parameters: {...connectionData.parameters, "disable-auth": e.target.checked ? 'disabled' : ''}
        })
    };
    const handleIgnoreCert = (e: React.ChangeEvent<HTMLInputElement>) => {
        setConnectionData({
            ...connectionData,
            parameters: {...connectionData.parameters, "ignore-cert": e.target.checked ? 'ignore' : ''}
        })
    };

    const handleRadioClick = (e: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
        const target = e.target as HTMLInputElement
        if (target.checked && connectionData.attributes["failover-only"] === 'failOver') {
            setConnectionData({...connectionData, attributes: {...connectionData.attributes, "failover-only": ''}})
        }
    }
    const handleDisableAuthClick = (e: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
        const target = e.target as HTMLInputElement
        if (target.checked && connectionData.parameters?.["disable-auth"] === 'disabled') {
            setConnectionData({...connectionData, parameters: {...connectionData.parameters, "disable-auth": ''}})
        }
    }
    const handleIgnoreCertClick = (e: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
        const target = e.target as HTMLInputElement
        if (target.checked && connectionData.parameters?.["ignore-cert"] === 'ignore') {
            setConnectionData({...connectionData, parameters: {...connectionData.parameters, "ignore-cert": ''}})
        }
    }

    useEffect(() => {
        if (data.length > 0) {
            let parameters = {}
            const fetchParameters = async () => {
                if (data[0].identifier){
                    const res = await detailsConnectionParametersApi(data[0].identifier)
                    if (res.status === 200){
                        parameters = res.data
                    }
                }
            }
            fetchParameters().then(() => {
                setConnectionData({
                    ...connectionData,
                    // @ts-ignore
                    protocol: {name: data[0].protocol?.toUpperCase(), code: data[0].protocol?.toUpperCase()},
                    identifier: data[0].identifier,
                    name: data[0].name,
                    attributes: {...data[0].attributes},
                    // @ts-ignore
                    parameters: parameters
                })
            })

        } else{
            setConnectionData({
                attributes: {
                    "failover-only": '',
                    "guacd-encryption": {name: '', code: ''},
                    "weight": '',
                    "max-connections": '',
                    "guacd-hostname": '',
                    "guacd-port": '',
                    "max-connections-per-user": ''
                },
                // @ts-ignore
                parameters: {
                    hostname: '',
                    password: '',
                },
                name: '',
                parentIdentifier: 'ROOT',
                protocol: {name: '', code: ''}
            })
        }
    }, [data]);

    useEffect(() => {
        console.log(connectionData.name)
    }, [connectionData.name]);

    const connectionItems = useMemo(() => {
        if (connectionData.protocol?.name === 'SSH') {
            return <>
                <ConnectionSpecs>
                    <ConnectionSpecsItem>
                        <label htmlFor="hostname">Hostname</label>
                        <InputText
                            id="hostname"
                            value={connectionData.parameters?.hostname}
                            onChange={(e) => setConnectionData({
                                ...connectionData,
                                parameters: {...connectionData.parameters, hostname: e.target.value}
                            })}
                        />
                    </ConnectionSpecsItem>
                    <ConnectionSpecsItem>
                        <label htmlFor="port">Port</label>
                        <InputText
                            id="port"
                            value={connectionData.parameters?.port}
                            onChange={(e) => setConnectionData({
                                ...connectionData,
                                parameters: {...connectionData.parameters, port: e.target.value}
                            })}
                        />
                    </ConnectionSpecsItem>
                    <ConnectionSpecsItem>
                        <label htmlFor="port">Public Host key (Base64)</label>
                        <InputText
                            id="port"
                            value={connectionData.parameters?.["host-key"]}
                            onChange={(e) => setConnectionData({
                                ...connectionData,
                                parameters: {...connectionData.parameters, "host-key": e.target.value}
                            })}
                        />
                    </ConnectionSpecsItem>
                </ConnectionSpecs>
                <ConnectionSpecs>
                    <ConnectionSpecsItem>
                        <label htmlFor="authUsername">Connection Username</label>
                        <InputText
                            id="authUsername"
                            value={connectionData.parameters?.username}
                            onChange={(e) => setConnectionData({
                                ...connectionData,
                                parameters: {...connectionData.parameters, username: e.target.value}
                            })}
                        />
                    </ConnectionSpecsItem>
                    <ConnectionSpecsItem>
                        <label htmlFor="authUsername">Connection Password</label>
                        <InputText
                            id="authUsername"
                            value={connectionData.parameters?.password}
                            onChange={(e) => setConnectionData({
                                ...connectionData,
                                parameters: {...connectionData.parameters, password: e.target.value}
                            })}
                        />
                    </ConnectionSpecsItem>
                    <ConnectionSpecsItem>
                        <label htmlFor="authUsername">Private-Key</label>
                        <InputText
                            id="authUsername"
                            value={connectionData.parameters?.["private-key"]}
                            onChange={(e) => setConnectionData({
                                ...connectionData,
                                parameters: {...connectionData.parameters, "private-key": e.target.value}
                            })}
                        />
                    </ConnectionSpecsItem>
                    <ConnectionSpecsItem>
                        <label htmlFor="authUsername">Passphrase</label>
                        <InputText
                            id="authUsername"
                            value={connectionData.parameters?.passphrase}
                            onChange={(e) => setConnectionData({
                                ...connectionData,
                                parameters: {...connectionData.parameters, passphrase: e.target.value}
                            })}
                        />
                    </ConnectionSpecsItem>
                </ConnectionSpecs>
            </>
        } else if (connectionData.protocol?.name === 'VNC') {
            return <>
                <ConnectionSpecs>
                    <ConnectionSpecsItem>
                        <label htmlFor="hostname">HostName</label>
                        <InputText
                            id="hostname"
                            value={connectionData.parameters?.hostname}
                            onChange={(e) => setConnectionData({
                                ...connectionData,
                                parameters: {...connectionData.parameters, hostname: e.target.value}
                            })}
                        />
                    </ConnectionSpecsItem>
                    <ConnectionSpecsItem>
                        <label htmlFor="port">Port</label>
                        <InputText
                            id="port"
                            value={connectionData.parameters?.port}
                            onChange={(e) => setConnectionData({
                                ...connectionData,
                                parameters: {...connectionData.parameters, port: e.target.value}
                            })}
                        />
                    </ConnectionSpecsItem>
                    <ConnectionSpecsItem>
                        <label htmlFor="authUsername">Connection Username</label>
                        <InputText
                            id="authUsername"
                            value={connectionData.parameters?.username}
                            onChange={(e) => setConnectionData({
                                ...connectionData,
                                parameters: {...connectionData.parameters, username: e.target.value}
                            })}
                        />
                    </ConnectionSpecsItem>
                    <ConnectionSpecsItem>
                        <label htmlFor="authUsername">Connection Password</label>
                        <InputText
                            id="authUsername"
                            value={connectionData.parameters?.password}
                            onChange={(e) => setConnectionData({
                                ...connectionData,
                                parameters: {...connectionData.parameters, password: e.target.value}
                            })}
                        />
                    </ConnectionSpecsItem>
                </ConnectionSpecs>
            </>
        } else if (connectionData.protocol?.name === 'RDP') {
            return <>
                <ConnectionSpecs>
                    <ConnectionSpecsItem>
                        <label htmlFor="hostname">HostName</label>
                        <InputText
                            id="hostname"
                            value={connectionData.parameters?.hostname}
                            onChange={(e) => setConnectionData({
                                ...connectionData,
                                parameters: {...connectionData.parameters, hostname: e.target.value}
                            })}
                        />
                    </ConnectionSpecsItem>
                    <ConnectionSpecsItem>
                        <label htmlFor="port">Port</label>
                        <InputText
                            id="port"
                            value={connectionData.parameters?.port}
                            onChange={(e) => setConnectionData({
                                ...connectionData,
                                parameters: {...connectionData.parameters, port: e.target.value}
                            })}
                        />
                    </ConnectionSpecsItem>
                    <ConnectionSpecsItem>
                        <label htmlFor="authUsername">Connection Username</label>
                        <InputText
                            id="authUsername"
                            value={connectionData.parameters?.username}
                            onChange={(e) => setConnectionData({
                                ...connectionData,
                                parameters: {...connectionData.parameters, username: e.target.value}
                            })}
                        />
                    </ConnectionSpecsItem>
                    <ConnectionSpecsItem>
                        <label htmlFor="authUsername">Connection Password</label>
                        <InputText
                            id="authUsername"
                            value={connectionData.parameters?.password}
                            onChange={(e) => setConnectionData({
                                ...connectionData,
                                parameters: {...connectionData.parameters, password: e.target.value}
                            })}
                        />
                    </ConnectionSpecsItem>
                    <ConnectionSpecsItem>
                        <label htmlFor="domain">Domain</label>
                        <InputText
                            id="domain"
                            value={connectionData.parameters?.domain}
                            onChange={(e) => setConnectionData({
                                ...connectionData,
                                parameters: {...connectionData.parameters, password: e.target.value}
                            })}
                        />
                    </ConnectionSpecsItem>
                    <ConnectionSpecsItem>
                        <label htmlFor="security">Security Mode</label>
                        <Dropdown
                            value={connectionData.parameters?.security}
                            onChange={(e) => setConnectionData({
                                ...connectionData,
                                parameters: {...connectionData.parameters, security: e.value}
                            })}
                            options={securityMode}
                            optionLabel="name"
                            placeholder="Select Security"
                        />
                    </ConnectionSpecsItem>
                    <ConnectionSpecsItem>
                        <label htmlFor="disableAuth">Disable Authentication</label>
                        <input
                            style={{width: '18px', height: '18px'}}
                            type={'radio'}
                            id="disableAuth"
                            name="disableAuth"
                            onChange={handleDisableAuth}
                            onClick={handleDisableAuthClick}
                            checked={connectionData.parameters?.["disable-auth"] == 'disabled'}
                        />
                    </ConnectionSpecsItem>
                    <ConnectionSpecsItem>
                        <label htmlFor="ignoreCert">Ignore Server Certificate</label>
                        <input
                            style={{width: '18px', height: '18px'}}
                            type={'radio'}
                            id="ignoreCert"
                            name="ignoreCert"
                            onChange={handleIgnoreCert}
                            onClick={handleIgnoreCertClick}
                            checked={connectionData.parameters?.["ignore-cert"] === 'ignore'}
                        />
                    </ConnectionSpecsItem>
                    <ConnectionSpecsItem></ConnectionSpecsItem>
                    <ConnectionSpecsItem>
                        <label htmlFor="gatewayhost">Remote Desktop Gateway hostname</label>
                        <InputText
                            id="gatewayhost"
                            value={connectionData.parameters?.["gateway-hostname"]}
                            onChange={(e) => setConnectionData({
                                ...connectionData,
                                parameters: {...connectionData.parameters, "gateway-hostname": e.target.value}
                            })}
                        />
                    </ConnectionSpecsItem>
                    <ConnectionSpecsItem>
                        <label htmlFor="gatewayPort">Remote Desktop Gateway Port</label>
                        <InputNumber
                            style={{width: '100%'}}
                            inputId="gatewayPort"
                            value={connectionData.parameters?.["gateway-port"] ? +connectionData.parameters?.["gateway-port"] : null}
                            onValueChange={(e) => setConnectionData({
                                ...connectionData,
                                parameters: {...connectionData.parameters, "gateway-port": `${e.value}`}
                            })}
                        />
                    </ConnectionSpecsItem>
                    <ConnectionSpecsItem>
                        <label htmlFor="gatewayhost">Remote Desktop Gateway Username</label>
                        <InputNumber
                            style={{width: '100%'}}
                            inputId="gatewayhost"
                            value={connectionData.parameters?.["gateway-username"] ? +connectionData.parameters?.["gateway-username"] : null}
                            onValueChange={(e) => setConnectionData({
                                ...connectionData,
                                parameters: {...connectionData.parameters, "gateway-username": `${e.value}`}
                            })}
                        />
                    </ConnectionSpecsItem>
                    <ConnectionSpecsItem>
                        <label htmlFor="gatewayPass">Remote Desktop Gateway Password</label>
                        <InputNumber
                            style={{width: '100%'}}
                            inputId="gatewayPass"
                            value={connectionData.parameters?.["gateway-password"] ? +connectionData.parameters?.["gateway-password"] : null}
                            onValueChange={(e) => setConnectionData({
                                ...connectionData,
                                parameters: {...connectionData.parameters, "gateway-password": `${e.value}`}
                            })}
                        />
                    </ConnectionSpecsItem>
                    <ConnectionSpecsItem>
                        <label htmlFor="gatewayDomain">Remote Desktop Gateway Domain</label>
                        <InputText
                            id="gatewayDomain"
                            value={connectionData.parameters?.["gateway-domain"]}
                            onChange={(e) => setConnectionData({
                                ...connectionData,
                                parameters: {...connectionData.parameters, "gateway-domain": e.target.value}
                            })}
                        />
                    </ConnectionSpecsItem>
                    <ConnectionSpecsItem></ConnectionSpecsItem>
                </ConnectionSpecs>
            </>
        }
    }, [connectionData.protocol, connectionData.parameters, connectionData.attributes])
    const upperConnectionItems = useMemo(() => {
        return <>
            <ConnectionSpecs>
                <ConnectionSpecsItem>
                    <label htmlFor="name">Username</label>
                    <InputText
                        id="name"
                        value={connectionData.name}
                        onChange={(e) => setConnectionData({...connectionData, name: e.target.value})}
                    />
                </ConnectionSpecsItem>
                <ConnectionSpecsItem>
                    <label htmlFor="location">Location</label>
                    <InputText id="location" value={connectionData.parentIdentifier}/>
                </ConnectionSpecsItem>
                <ConnectionSpecsItem>
                    <label htmlFor="location">Protocol</label>
                    <Dropdown
                        value={connectionData.protocol}
                        onChange={(e) => setConnectionData({...connectionData, protocol: e.value})}
                        options={protocols}
                        optionLabel="name"
                        placeholder="Select a Protocol"
                    />
                </ConnectionSpecsItem>
            </ConnectionSpecs>
            <ConnectionSpecs>
                <ConnectionSpecsItem>
                    <label htmlFor="maxConnection">Max Connection</label>
                    <InputNumber
                        style={{width: '100%'}}
                        inputId="maxConnection"
                        value={connectionData.attributes["max-connections"] ? +connectionData.attributes["max-connections"] : null}
                        onValueChange={(e) => setConnectionData({
                            ...connectionData,
                            attributes: {...connectionData.attributes, "max-connections": `${e.value}`}
                        })}
                    />
                </ConnectionSpecsItem>
                <ConnectionSpecsItem>
                    <label htmlFor="maxConnectionPerUser">Max Connection per user</label>
                    <InputNumber
                        style={{width: '100%'}}
                        inputId="maxConnectionPerUser"
                        value={connectionData.attributes["max-connections-per-user"] ? +connectionData.attributes["max-connections-per-user"] : null}
                        onValueChange={(e) => setConnectionData({
                            ...connectionData,
                            attributes: {...connectionData.attributes, "max-connections-per-user": `${e.value}`}
                        })}
                    />
                </ConnectionSpecsItem>
                <ConnectionSpecsItem></ConnectionSpecsItem>
            </ConnectionSpecs>
            <ConnectionSpecs>
                <ConnectionSpecsItem>
                    <label htmlFor="weight">Connection Weight</label>
                    <InputNumber
                        style={{width: '100%'}}
                        inputId="weight"
                        value={connectionData.attributes.weight ? +connectionData.attributes.weight : null}
                        onValueChange={(e) => setConnectionData({
                            ...connectionData,
                            attributes: {...connectionData.attributes, weight: `${e.value}`}
                        })}
                    />
                </ConnectionSpecsItem>
                <ConnectionSpecsItem>
                    <label htmlFor="failOver">Use for failover only</label>
                    <input
                        style={{width: '18px', height: '18px'}}
                        type={'radio'}
                        id="failOver"
                        name="abc"
                        onChange={handleRadioChange}
                        onClick={handleRadioClick}
                        checked={connectionData.attributes["failover-only"] === 'failOver'}
                    />
                </ConnectionSpecsItem>
                <ConnectionSpecsItem></ConnectionSpecsItem>
            </ConnectionSpecs>
            <ConnectionSpecs>
                <ConnectionSpecsItem>
                    <label htmlFor="proxyHostname">Proxy Hostname</label>
                    <InputText
                        id="proxyHostname"
                        value={connectionData.attributes["guacd-hostname"]}
                        onChange={(e) => setConnectionData({
                            ...connectionData,
                            attributes: {...connectionData.attributes, "guacd-hostname": e.target.value}
                        })}
                    />
                </ConnectionSpecsItem>
                <ConnectionSpecsItem>
                    <label htmlFor="port">Proxy Port</label>
                    <InputNumber
                        style={{width: '100%'}}
                        inputId="port"
                        value={connectionData.attributes["guacd-port"] ? +connectionData.attributes["guacd-port"] : null}
                        onValueChange={(e) => setConnectionData({
                            ...connectionData,
                            attributes: {...connectionData.attributes, "guacd-port": `${e.value}`}
                        })}
                    />
                </ConnectionSpecsItem>
                <ConnectionSpecsItem>
                    <label htmlFor="encryption">Encryption</label>
                    <Dropdown
                        value={connectionData.attributes["guacd-encryption"]}
                        onChange={(e) => setConnectionData({
                            ...connectionData,
                            attributes: {...connectionData.attributes, "guacd-encryption": e.value}
                        })}
                        options={encryption}
                        optionLabel="name"
                        placeholder="Select Encyption"
                    />
                </ConnectionSpecsItem>
            </ConnectionSpecs>
        </>
    }, [data, connectionData])

    return (
        <CustomDialog
            header={data.length > 0 ? 'Edit Connection' : 'New Connection'}
            onHide={() => setNewConnectionModal(false)}
            visible={newConnectionModal}
        >
            {upperConnectionItems}
            {connectionItems}
            <ButtonWrapper>
                <Button onClick={() => handleAddConnection()}>
                    {data.length > 0 ? 'Edit Connection' : 'Add Connection'}
                </Button>
            </ButtonWrapper>
        </CustomDialog>
    );
};

export default NewConnectionDialog;