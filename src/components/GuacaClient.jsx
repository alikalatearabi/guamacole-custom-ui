// GuacamoleClient.js
import React, { useEffect } from 'react';
import Guacamole from 'guacamole-common-js';

const GuacamoleClient = () => {
    const tunnel_url = 'http://localhost:80/guacamole'

    useEffect(() => {
        const tunnel_url = 'http://localhost/guacamole/'
        const guac = new Guacamole.Client(new Guacamole.HTTPTunnel(tunnel_url))

        display.appendChild(guac.getDisplay().getElement());

        guac.onerror = function (error) {
            console.error('Guacamole error:', error);
        };

        guac.connect();

        const mouse = new Guacamole.Mouse(guac.getDisplay().getElement());
        mouse.onmousedown =
            mouse.onmouseup =
                mouse.onmousemove = function (mouseState) {
                    guac.sendMouseState(mouseState);
                };

        const keyboard = new Guacamole.Keyboard(document);
        keyboard.onkeydown = function (keysym) {
            guac.sendKeyEvent(1, keysym);
        };
        keyboard.onkeyup = function (keysym) {
            guac.sendKeyEvent(0, keysym);
        };

        return () => {
            guac.disconnect();
        };
    }, []);

    return (
        <div id="display"></div>
    );
};

export default GuacamoleClient;
