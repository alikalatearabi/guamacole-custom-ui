import React, {useEffect, useState} from 'react';
import styled from "styled-components";
import Guacamole from "guacamole-common-js";
import {useParams} from "react-router-dom";
import {serverConnectionUrl} from "./const.ts";
import {MouseEventType} from "./types.ts";
import { ProgressSpinner } from 'primereact/progressspinner';

const TerminalDiv = styled('div')`
  width: 100%;
  height: 100%
`
const LoadingWrapper = styled('div')`
  width: 100%; 
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  span{
    margin-top: 10px;
    font-size: 20px;
  }
`

const guacaMouseConnection = (guaca: Guacamole.Client) => {
    const mouse = new Guacamole.Mouse(guaca.getDisplay().getElement()) as MouseEventType;
    mouse.onmousedown = function (mouseState: Guacamole.Mouse.State) {
        guaca.sendMouseState(mouseState);
    };
    mouse.onmouseup = function (mouseState: Guacamole.Mouse.State) {
        guaca.sendMouseState(mouseState);
    };
    mouse.onmousemove = function (mouseState: Guacamole.Mouse.State) {
        guaca.sendMouseState(mouseState);
    };
}
const guacaKeyboardConnection = (guaca: Guacamole.Client) => {
    const keyboard = new Guacamole.Keyboard(document);
    keyboard.onkeydown = function (keysym: number) {
        guaca.sendKeyEvent(1, keysym);
    };
    keyboard.onkeyup = function (keysym: number) {
        guaca.sendKeyEvent(0, keysym);
    };
}


const Terminal = () => {

    const {id, name} = useParams()
    const token = localStorage.getItem('token')

    const [loading, setLoading] = useState(true)

    const handleWebSocketConnection = (id: string, name: string, width: number, height: number) => {
        const webSocket = new Guacamole.WebSocketTunnel(serverConnectionUrl(id, token, width, height))
        const guaca = new Guacamole.Client(webSocket);
        guaca.onerror = function (error) {
            alert(error);
        };
        guaca.connect('');
        guaca.onstatechange = function (state) {
            if (guaca.getDisplay().getElement()) {
                setLoading(false)
            }
            if (state === Guacamole.Client.State.CONNECTED) {
                setTimeout(() => {
                    guaca.exportState(function (exportedState) {
                        const connectionObj = {
                            name: name,
                            id: id,
                            thumbnail: exportedState.layers[1].url
                        }
                        localStorage.setItem('GUAC_HISTORY', JSON.stringify([connectionObj]));
                    });
                }, 1000);
            }
        };
        guacaMouseConnection(guaca)
        guacaKeyboardConnection(guaca)

        const display = document.getElementById("display");
        display?.appendChild(guaca.getDisplay().getElement());
    }

    useEffect(() => {
        const divElement = document.getElementById('display');
        const divWidth = divElement?.offsetWidth || 0;
        const divHeight = divElement?.offsetHeight || 0;
        if (id && name){
            handleWebSocketConnection(id, name, divWidth, divHeight)
        }
    }, [id, name]);

    return <>
        {loading && <LoadingWrapper style={{}}>
            <ProgressSpinner />
            <span>Connecting to server...</span>
        </LoadingWrapper>}
        <TerminalDiv id={'display'}></TerminalDiv>
    </>;
};

export default Terminal;