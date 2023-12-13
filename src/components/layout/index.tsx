import {MegaMenu} from "primereact/megamenu";
import {items} from "../../pages/dashboard/menuItems.ts";
import * as React from "react";
import {ReactNode} from "react";
import {SplitButton} from "primereact/splitbutton";
import {settingItems} from "./settingItems.ts";
import {useLocation} from "react-router-dom";

const Layout: React.FC<{ children: ReactNode }> = ({children}) => {

    const {pathname} = useLocation()

    return (
        <div style={{width: '100%', height: '100vh', display: 'flex', alignItems: 'center'}}>
            {pathname !== '/Login' && <div
                style={{
                    width: '20%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: '#DDF1F8'
                }}
            >
                <MegaMenu
                    model={items}
                    orientation="vertical"
                    breakpoint="767px"
                    style={{width: '100%', height: '100%', borderRadius: '0'}}
                />
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    padding: '0 20px',
                    margin: '5px auto',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0',
                    background: 'white',
                    position: 'relative'

                }}>
                    <SplitButton
                        label=""
                        icon="pi pi-cog"
                        model={settingItems}
                        style={{background: '#DDF1F8', height: '40px'}}
                    >
                    </SplitButton>
                    <p>Bakhshande</p>
                </div>
            </div>}
            <div style={{width: `${pathname === "/Login" ? '100%' : '80%'} `, height: '100%', background: '#DDF1F8', padding: '10px'}}>
                {children}
            </div>
        </div>
    );
};

export default Layout;