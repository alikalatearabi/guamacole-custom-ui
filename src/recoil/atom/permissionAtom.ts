import { atom } from "recoil";

export const permissionAtom = atom<{
    systemPermissions: string[],
    userPermissions: {
        [key: string] : string[]
    }
}>({
    key: "permissions",
    default: {
        systemPermissions: [],
        userPermissions: {}
    },
});