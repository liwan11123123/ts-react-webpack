import * as React from 'react'
import { observer, inject } from 'mobx-react'
import { observable, action } from 'mobx'
import { Layout, Menu, Icon } from 'antd'
import { checkPermissions } from 'react-authorized/lib'

import menu from './../menu'

import * as styles from './index.scss'

interface IStoreProps {
    sideBarCollapsed?: boolean
    sideBarTheme?: IGlobalStore.SideBarTheme
    userInfo?: IUserStore.UserInfo
    routerStore?: RouterStore
}

@inject(
    (store: IStore): IStoreProps => {
        const { routerStore, globalStore, userStore } = store
        const { userInfo } = userStore
        const { sideBarCollapsed, sideBarTheme } = globalStore
        return {
            routerStore,
            sideBarCollapsed,
            sideBarTheme,
            userInfo
        }
    }
)
@observer
class Sider extends React.Component<IStoreProps> {
    @observable
    private menuKeys: string[] = [menu[0].title]

    constructor(props) {
        super(props)
        this.setMenuKeys()
    }

    goto = ({ key }) => {
        const { history, location } = this.props.routerStore
        if (location.pathname === key) {
            return
        }
        history.push(key)
    }

    @action
    setMenuKeys() {
        const { location } = this.props.routerStore
        this.menuKeys = [location.pathname]
    }

    render() {
        const { userInfo, sideBarCollapsed, sideBarTheme } = this.props
        return (
            <Layout.Sider trigger={null} theme={sideBarTheme} collapsible collapsed={sideBarCollapsed}>
                <div className={styles.logoBox}>
                    <Icon type="ant-design" />
                </div>
                <Menu
                    theme={sideBarTheme}
                    mode="inline"
                    defaultSelectedKeys={this.menuKeys.slice()}
                    onClick={this.goto}
                >
                    {menu.map(m => {
                        if (!checkPermissions(userInfo.category, m.permissions)) {
                            return null
                        }
                        return (
                            <Menu.Item key={m.path}>
                                <Icon type={m.icon} />
                                <span>{m.title}</span>
                            </Menu.Item>
                        )
                    })}
                </Menu>
            </Layout.Sider>
        )
    }
}

export default Sider
