import {MenuItem} from "primereact/menuitem";

export const items: MenuItem[] = [
    {label: 'Active Sessions', icon: 'pi pi-fw pi-globe', url: '/Active'},
    {label: 'History', icon: 'pi pi-fw pi-book', url: '/history'},
    {label: 'Users', icon: 'pi pi-fw pi-user', url: '/users' },
    {label: 'Groups', icon: 'pi pi-fw pi-users', url: '/groups' },
    {label: 'Connections', icon: 'pi pi-fw pi-server', url: '/connections'},
    {label: 'Preferences', icon: 'pi pi-fw pi-cog', url: '/preferences'}
];