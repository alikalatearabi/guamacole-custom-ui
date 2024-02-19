import {MenuItem} from "primereact/menuitem";

export const items: MenuItem[] = [
    {label: 'Home', icon: 'pi pi-fw pi-home', url: '/panel/dashboard'},
    {label: 'Active Sessions', icon: 'pi pi-fw pi-globe', url: '/panel/Active'},
    {label: 'History', icon: 'pi pi-fw pi-book', url: '/panel/history'},
    {label: 'Users', icon: 'pi pi-fw pi-user', url: '/panel/users' },
    {label: 'Groups', icon: 'pi pi-fw pi-users', url: '/panel/groups' },
    {label: 'Connections', icon: 'pi pi-fw pi-server', url: '/panel/connections'},
    {label: 'Preferences', icon: 'pi pi-fw pi-cog', url: '/panel/preferences'}
];