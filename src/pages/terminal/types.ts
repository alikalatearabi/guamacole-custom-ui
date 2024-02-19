import Guacamole from "guacamole-common-js";

export interface MouseEventType extends Guacamole.Mouse {
    onmousedown: (mouseState: Guacamole.Mouse.State) => void;
    onmouseup: (mouseState: Guacamole.Mouse.State) => void;
    onmousemove: (mouseState: Guacamole.Mouse.State) => void;
}