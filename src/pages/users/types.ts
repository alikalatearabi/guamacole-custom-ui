import {DateObject} from "react-multi-date-picker";

export interface AddUserModalProps {
    setModal: (value: boolean) => void,
    modal: boolean,
}

export interface PermissionsType {
    username: string,
    password: string,
    "valid-from"?: DateObject | DateObject[] | null,
    "valid-until"?: DateObject | DateObject[] | null,
    "access-window-start"?: Date | null,
    "access-window-end"?: Date | null,
    "guac-full-name"?: string,
    "guac-email-address"?: string,
    "guac-organization"?: string,
    "guac-organizational-role"?: string,
    disabled?: boolean
    expired?: boolean
    "ADMINISTER"?: boolean,
    "CREATE_USER"?: boolean,
    "CREATE_USER_GROUP"?: boolean,
    "CREATE_CONNECTION"?: boolean,
    "CREATE_CONNECTION_GROUP"?: boolean,
    "CREATE_SHARING_PROFILE"?: boolean,
    changePassword?: boolean
}


export interface ProfileInputProps {
    label: string;
    name: keyof Permissions;
    value: string;
    onChange: (newValue: Permissions) => void;
    type?: string;
}