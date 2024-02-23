import {MegaMenu} from "primereact/megamenu";
import * as React from "react";
import {ReactNode, useRef} from "react";
import {CiSettings} from "react-icons/ci";
import styled from 'styled-components'
import './style.scss'
import {Link, useLocation, useNavigate, useParams} from "react-router-dom";
import {Button} from "primereact/button";
import {activeConnectionsApi, killConnectionsApi} from "../../api/activeConnections.ts";
import {Menu} from "primereact/menu";
import {LogoutApi} from "../../api/api.ts";
import {MenuItem} from "primereact/menuitem";


const MainDiv = styled('div')`
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: space-between
`
const NavbarSection = styled('div')`
  width: 15%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`
const NavbarSectionItems = styled('div')`
  width: 90%;
  height: 98%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  margin: auto;
  border-radius: 10px
`
const NavbarTitle = styled('p')`
  background: #8C87C0;
  width: 100%;
  height: 8%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin: 0;
  border-radius: 10px 10px 0 0;
`
const CustomMegaMenu = styled('div')`
  width: 100%;
  height: 100%;
  background: #44679C;
  border-radius: 0 0 10px 10px;
  border: 0;

  .active {
    background-color: #a7a5ff;
  }
`
const MenuLink = styled('div')`
  display: flex;
  align-items: center;
  justify-content: start;
  padding: 15px;
  a{
    color: white;
    text-decoration: none;
    font-size: 18px;
  }
`
const BodySection = styled('div')`
  display: flex;
  flex-direction: column;
  width: 85%;
  height: 100%;
`
const HeaderSection = styled('div')`
  height: 8%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  direction: rtl;
  background: rgb(68, 103, 156);
  margin: 10px;
  border-radius: 10px
`
const HeaderInfoSection = styled('div')`
  display: flex;
  align-items: center;
  background: #8C87C0;
  padding: 10px 20px;
  border-radius: 5px;
  color: white;

  span {
    margin-left: 10px;
    font-size: 18px;
  }
`
const HeaderFilterSection = styled('div')`
`

const subMenuItems = [
    {
        label: 'Home',
        url: '/panel/dashboard'
    },
    {
        label: 'Active Connections',
        url: '/panel/active'
    },
    {
        label: 'History',
        url: '/panel/history'
    },
    {
        label: 'Users',
        url: '/panel/users'
    },
    {
        label: 'Groups',
        url: '/panel/groups'
    },
    {
        label: 'Connections',
        url: '/panel/connections'
    },
]

const navbarTitle = 'سامانه جامع مدیریت سرور'

const Layout: React.FC<{ children: ReactNode }> = ({children}) => {

    const {pathname} = useLocation()
    const {id} = useParams()
    const navigate = useNavigate()
    const menuLeft = useRef(null);
    const token = localStorage.getItem("token")
    const username = localStorage.getItem("user")

    const handleLogout = async () => {
        if (token) {
            const res = await LogoutApi(token)
            if (res.status === 204) {
                navigate('/login')
                localStorage.removeItem('token')
                localStorage.removeItem('GUAC_HISTORY')
                localStorage.removeItem('user')
            }
        }
    }

    const menuItems = [
        {
            label: 'Options',
            items: [
                {
                    label: 'Logout',
                    icon: 'pi pi-refresh',
                    template: (item: { icon: string, label: string }) => {
                        return <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                width: '50%',
                                padding: '0 10px',
                                cursor: 'pointer'
                            }}
                            onClick={() => handleLogout()}
                        >
                            <span className={`p-menuitem-icon ${item.icon}`}></span>
                            <span>{item.label}</span>
                        </div>
                    }
                },
            ],
        }
    ];

    const fetchConnectionDetails = async () => {
        return await activeConnectionsApi()
    }
    const killConnection = async (id: string) => {
        return await killConnectionsApi(id)
    }

    const handleKillConnection = async () => {
        fetchConnectionDetails().then(res => {
            const connection = Object.keys(res?.data).find(item => res?.data[item].connectionIdentifier === id)
            if (connection && res?.data[connection]) {
                killConnection(res.data[connection].identifier).then(res => {
                    if (res.status === 204) {
                        navigate('/panel/dashboard')
                    }
                })
            }
        })
    }

    return <MainDiv>
        <NavbarSection>
            <NavbarSectionItems>
                <NavbarTitle>{navbarTitle}</NavbarTitle>
                <CustomMegaMenu>
                    {subMenuItems.map(menu => <MenuLink key={menu.label} className={pathname === menu.url && 'active'}>
                        <Link to={menu.url}>{menu.label}</Link>
                    </MenuLink>)}
                </CustomMegaMenu>
            </NavbarSectionItems>
        </NavbarSection>
        <BodySection>
            <HeaderSection>
                {/* ts-ignore*/}
                <HeaderInfoSection onClick={(event) => menuLeft.current?.toggle(event)}>
                    {/* ts-ignore*/}
                    <Menu model={menuItems} popup ref={menuLeft} id="popup_menu_right"/>
                    <span>{username}</span>
                    <CiSettings style={{marginRight: '10px', fontSize: '26px'}}/>
                </HeaderInfoSection>
                <HeaderFilterSection>
                    {pathname.includes('/panel/terminal') && <div>
                        <Button severity={'danger'} onClick={() => handleKillConnection()}>Kill Connection</Button>
                    </div>}
                </HeaderFilterSection>
            </HeaderSection>
            <div style={{width: '100%', height: `100%`, padding: `10px`}}>
                {children}
            </div>
        </BodySection>
    </MainDiv>
};

export default Layout;