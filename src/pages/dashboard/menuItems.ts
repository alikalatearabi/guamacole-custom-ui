import {MenuItem} from "primereact/menuitem";

export const items: MenuItem[] = [
    {label: 'Active Sessions', icon: 'pi pi-fw pi-video', url: '/Active'},
    {label: 'History', icon: 'pi pi-fw pi-users', url: '/history'},
    {label: 'Users', icon: 'pi pi-fw pi-calendar', url: '/users' },
    {label: 'Connections', icon: 'pi pi-fw pi-cog', url: '/connections'},
    {label: 'Preferences', icon: 'pi pi-fw pi-cog', url: '/preferences'}
];