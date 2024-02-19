import {ConnectionData} from "./types.ts";
import {addConnectionApi, updateConnectionApi} from "../../api/connectionsApi.ts";

export const ConnectionPayload = async (data: ConnectionData, type: string) => {
    let payload = {}
    if (data.protocol?.name === 'SSH'){
        payload = {
            parameters: {
                "port": data.parameters?.port || '',
                "read-only": "",
                "swap-red-blue": "",
                "cursor": "",
                "color-depth": "",
                "force-lossless": "",
                "clipboard-encoding": "",
                "disable-copy": "",
                "disable-paste": "",
                "dest-port": "",
                "recording-exclude-output": "",
                "recording-exclude-mouse": "",
                "recording-include-keys": "",
                "create-recording-path": "",
                "enable-sftp": "",
                "sftp-port": "",
                "sftp-server-alive-interval": "",
                "sftp-disable-download": "",
                "sftp-disable-upload": "",
                "enable-audio": "",
                "wol-send-packet": "",
                "wol-udp-port": "",
                "wol-wait-time": "",
                "username": data.parameters?.username || '',
                "password": data.parameters?.password || '',
                "color-scheme": "",
                "font-size": "",
                "scrollback": "",
                "timezone": null,
                "server-alive-interval": "",
                "backspace": "",
                "terminal-type": "",
                "create-typescript-path": "",
                "host-key": data.parameters?.["host-key"] || '',
                "passphrase": data.parameters?.passphrase || '',
                "private-key": data.parameters?.["private-key"] || '',
                "hostname" : data.parameters?.hostname || ''
            },
            attributes: {
                "max-connections": data.attributes["max-connections"],
                "max-connections-per-user": data.attributes["max-connections-per-user"],
                "weight": data.attributes.weight,
                "failover-only": data.attributes["failover-only"],
                "guacd-port": data.attributes["guacd-port"],
                "guacd-encryption": data.attributes["guacd-encryption"].name,
                "guacd-hostname": data.attributes["guacd-hostname"]
            },
            name: data.name,
            parentIdentifier: data.parentIdentifier,
            protocol: data.protocol.code.toLowerCase()
        }
    } else if (data.protocol?.name === 'RDP'){
        payload = {
            parameters: {
                "port": data.parameters?.port,
                "read-only": "",
                "swap-red-blue": "",
                "cursor": "",
                "color-depth": "",
                "force-lossless": "",
                "clipboard-encoding": "",
                "disable-copy": "",
                "disable-paste": "",
                "dest-port": "",
                "recording-exclude-output": "",
                "recording-exclude-mouse": "",
                "recording-include-keys": "",
                "create-recording-path": "",
                "enable-sftp": "",
                "sftp-port": "",
                "sftp-server-alive-interval": "",
                "sftp-disable-download": "",
                "sftp-disable-upload": "",
                "enable-audio": "",
                "wol-send-packet": "",
                "wol-udp-port": "",
                "wol-wait-time": "",
                "username": data.parameters?.username || '',
                "password": data.parameters?.password || '',
                "security": data.parameters?.security || '',
                "disable-auth": data.parameters?.["disable-auth"] || '',
                "ignore-cert": data.parameters?.["ignore-cert"] || '',
                "gateway-port": data.parameters?.["gateway-port"] || '',
                "server-layout": "",
                "timezone": null,
                "enable-touch": "",
                "console": "",
                "width": "",
                "height": "",
                "hostname": data.parameters?.hostname || "",
                "dpi": "",
                "resize-method": "",
                "normalize-clipboard": "",
                "console-audio": "",
                "disable-audio": "",
                "enable-audio-input": "",
                "enable-printing": "",
                "enable-drive": "",
                "disable-download": "",
                "disable-upload": "",
                "create-drive-path": "",
                "enable-wallpaper": "",
                "enable-theming": "",
                "enable-font-smoothing": "",
                "enable-full-window-drag": "",
                "enable-desktop-composition": "",
                "enable-menu-animations": "",
                "disable-bitmap-caching": "",
                "disable-offscreen-caching": "",
                "disable-glyph-caching": "",
                "preconnection-id": "",
                "recording-exclude-touch": "",
                "gateway-hostname": data.parameters?.["gateway-hostname"] || '',
                "gateway-username": data.parameters?.["gateway-username"] || '',
                "gateway-password": data.parameters?.["gateway-password"] || '',
                "gateway-domain": data.parameters?.["gateway-domain"] || ''
            },
            attributes: {
                "max-connections": data.attributes["max-connections"] || '',
                "max-connections-per-user": data.attributes["max-connections-per-user"] || '',
                "weight": data.attributes.weight || '',
                "failover-only": data.attributes["failover-only"] || '',
                "guacd-port": data.attributes["guacd-port"] || '',
                "guacd-encryption": data.attributes["guacd-encryption"] ? data.attributes["guacd-encryption"].name : ""
            },
            name: data.name,
            parentIdentifier: data.parentIdentifier,
            protocol: data.protocol.code.toLowerCase()
        }
    } else if (data.protocol?.name === 'VNC') {
        payload = {
            parameters: {
                "port": data.parameters?.port || '',
                "read-only": "",
                "swap-red-blue": "",
                "cursor": "",
                "color-depth": "",
                "force-lossless": "",
                "clipboard-encoding": "",
                "disable-copy": "",
                "disable-paste": "",
                "dest-port": "",
                "recording-exclude-output": "",
                "recording-exclude-mouse": "",
                "recording-include-keys": "",
                "create-recording-path": "",
                "enable-sftp": "",
                "sftp-port": "",
                "sftp-server-alive-interval": "",
                "sftp-disable-download": "",
                "sftp-disable-upload": "",
                "enable-audio": "",
                "wol-send-packet": "",
                "wol-udp-port": "",
                "wol-wait-time": "",
                "username": data.parameters?.username || '',
                "password": data.parameters?.password || '',
                "hostname": data.parameters?.hostname || ''
            },
            attributes: {
                "max-connections": data.attributes["max-connections"] || '',
                "max-connections-per-user": data.attributes["max-connections-per-user"] || '',
                "weight": data.attributes.weight || '',
                "failover-only": data.attributes["failover-only"] || '',
                "guacd-port": data.attributes["guacd-port"] || '',
                "guacd-encryption": data.attributes["guacd-encryption"] || ''
            },
            name: data.name,
            parentIdentifier: data.parentIdentifier,
            protocol: data.protocol.code.toLowerCase()
        }
    }
    if (type === "ADD"){
        const res = await addConnectionApi(payload)
        if (res.status === 200){
            return res
        }
    } else if (type === 'EDIT' && data.identifier) {
        const res = await updateConnectionApi(payload, data.identifier)
        if (res.status === 204){
            return res
        }
    }
}