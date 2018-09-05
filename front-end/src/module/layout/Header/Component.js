import React from 'react'
import BaseComponent from '@/model/BaseComponent'
import {Affix, Layout, Menu, Icon, Badge, Avatar, Modal, Dropdown, Popover} from 'antd'
import _ from 'lodash'
import I18N from '@/I18N'
import MediaQuery from 'react-responsive'
import Flyout from './Flyout';
import {MAX_WIDTH_MOBILE, MIN_WIDTH_PC} from '@/config/constant'
import {USER_ROLE} from '@/constant'

const {Header} = Layout
const SubMenu = Menu.SubMenu
const MenuItemGroup = Menu.ItemGroup

export default class extends BaseComponent {
    constructor() {
        super();
        this.state = {
            affixed: false,
            popover: false
        }
    }
    /*
    buildOverviewDropdown() {
        return (
            <Menu onClick={this.clickItem.bind(this)}>
                <Menu.Item key="developer">
                    {I18N.get('0100')}
                </Menu.Item>
                <Menu.Item key="social">
                    {I18N.get('0101')}
                </Menu.Item>
                <Menu.Item key="leader">
                    {I18N.get('0102')}
                </Menu.Item>
            </Menu>
        )
    }
    */

    buildAcctDropdown() {

        const isLogin = this.props.isLogin
        const hasAdminAccess = [USER_ROLE.ADMIN, USER_ROLE.COUNCIL].includes(this.props.role)

        return (
            <Menu onClick={this.clickItem.bind(this)}>
                {isLogin ?
                    <Menu.Item key="profile/info">
                        {I18N.get('0200')}
                    </Menu.Item> :
                    <Menu.Item key="login">
                        {I18N.get('0201')}
                    </Menu.Item>
                }
                {!isLogin &&
                    <Menu.Item key="register">
                        {I18N.get('0202')}
                    </Menu.Item>
                }
                {isLogin && hasAdminAccess &&
                    <Menu.Item key="admin/tasks">
                        {I18N.get('0203')}
                    </Menu.Item>
                }
                {isLogin &&
                    <Menu.Item key="logout">
                        {I18N.get('0204')}
                    </Menu.Item>
                }
            </Menu>
        )
    }

    buildLanguageDropdown() {
        return (
            <Menu onClick={this.clickItem.bind(this)}>
                <Menu.Item key="en">
                    {I18N.get('0301')}
                    {/* english  */}
                </Menu.Item>
                <Menu.Item key="zh">
                    {I18N.get('0302')}
                    {/* chinese */}
                </Menu.Item>
            </Menu>
        )
    }

    buildHelpDropdown() {
        const langDropdown = this.buildLanguageDropdown()
        const hasAdminAccess = [USER_ROLE.ADMIN, USER_ROLE.COUNCIL].includes(this.props.role)

        const fullName = `${this.props.user.firstName} ${this.props.user.lastName}`;
        return (
            <Menu onClick={this.clickItem.bind(this)} className="help-menu">
                {this.props.isLogin && <Menu.Item style={{borderBottom:'1px solid #ccc'}} key="no_click">
                    {fullName}
                </Menu.Item>}
                
                <Menu.Item key="help">
                    {I18N.get('0007')}
                </Menu.Item>
                <Menu.Item key="about">
                    {I18N.get('0008')}
                </Menu.Item>
                <Menu.Item key="faq">
                    {I18N.get('0009')}
                </Menu.Item>

                <Menu.Item key="slack">
                    {I18N.get('0011')}
                </Menu.Item>

                {/*
                <Menu.Item key="language">
                    <Dropdown overlay={langDropdown} style="margin-top: 24px;">
                        <a className="ant-dropdown-link" href="#">
                            {I18N.get('0300')} <Icon type="down" />
                        </a>
                    </Dropdown>
                </Menu.Item>
                */}

                {this.props.isLogin && hasAdminAccess &&
                    <Menu.Item key="admin/tasks">
                        {I18N.get('0203')}
                    </Menu.Item>
                }

                {this.props.isLogin &&
                    <Menu.Item key="user/reset-password">
                        Change password
                    </Menu.Item>
                }

                {this.props.isLogin &&
                    <Menu.Item key="logout">
                        {I18N.get('0204')}
                    </Menu.Item>
                }
            </Menu>
        )
    }

    getSelectedKeys() {
        const keys = _.map(['cr100', 'empower35', 'evangelist-training', 'profile', 'developer', 'social', 'community'], (key) => {
            return ((this.props.pathname || '').indexOf(`/${key}`) === 0) ? key : ''
        })

        return keys
    }

    ord_render() {
        const isLogin = this.props.isLogin

        // const overviewDropdown = this.buildOverviewDropdown()
        const acctDropdown = this.buildAcctDropdown()
        const helpDropdown = this.buildHelpDropdown()
        return (
            <Header className="c_Header">
                <Menu onClick={this.clickItem.bind(this)} className="c_Header_Menu pull-left"
                    selectedKeys={this.getSelectedKeys()} mode="horizontal">
                    <Menu.Item className="c_MenuItem logo" key="landing">
                        <img src="/assets/images/logo.svg" alt="Cyber Republic" className="dsk"/>
                        <img src="/assets/images/logo-mark.svg" className="mob"/>
                        <div className="alpha-tag">ALPHA</div>
                    </Menu.Item>
                </Menu>

                <Menu className="c_Header_Menu c_Side_Menu pull-right">
                    <MediaQuery minWidth={MIN_WIDTH_PC}>
                        <Menu.Item className="c_MenuItem help pull-right no-margin" key="help">
                            <Dropdown overlay={helpDropdown} style="margin-top: 24px;">
                                <a className="ant-dropdown-link">
                                    <Icon className="no-margin" type="question-circle-o" />
                                </a>
                            </Dropdown>
                        </Menu.Item>
                    </MediaQuery>
                    <Menu.Item className="c_MenuItem mobile" key="mobileMenu" onClick={this.props.toggleMobileMenu}>
                        <Icon type="menu-fold"/>
                    </Menu.Item>
                </Menu>

                {/*
                <Menu.Item className="c_MenuItem overview">
                    <Dropdown overlay={overviewDropdown} style="margin-top: 24px;">
                        <a className="ant-dropdown-link" href="#">
                            {I18N.get('0001')} <Icon type="down" />
                        </a>
                    </Dropdown>
                </Menu.Item>
                */}
                <Menu onClick={this.clickItem.bind(this)} className="c_Header_Menu pull-right"
                      selectedKeys={this.getSelectedKeys()} mode="horizontal">
                    {/*this.props.isLogin &&
                        <Menu.Item className="c_MenuItem link right" key="profile">
                            {I18N.get('0104')}
                        </Menu.Item>
                    */}

                    <Menu.Item className="c_MenuItem link" key="cr100">
                        {I18N.get('0105')}
                    </Menu.Item>

                    <Menu.Item className="c_MenuItem link" key="empower35">
                        {I18N.get('0106')}
                    </Menu.Item>

                    <Menu.Item className="c_MenuItem link" key="evangelist-training">
                        {I18N.get('0107')}
                    </Menu.Item>

                    <Menu.Item className="c_MenuItem link" key="developer">
                        {I18N.get('0102')}
                    </Menu.Item>

                    {/* { this.props.isLogin ?
                        <Menu.Item className="c_MenuItem link" key="profile">
                            {I18N.get('0104')}
                        </Menu.Item>
                        : <Menu.Item className="c_MenuItem link" key="login">
                            {I18N.get('0201')}
                        </Menu.Item>
                    } */}

                    {/*
                    <Menu.Item className="c_MenuItem" key="directory">
                        {I18N.get('0003')}
                    </Menu.Item>
                    */}

                    {/*
                    <Menu.Item className="c_MenuItem right-side" key="tasks">
                        {I18N.get('0006')}
                    </Menu.Item>

                    <Menu.Item className="c_MenuItem right-side" key="teams">
                        {I18N.get('0005')}
                    </Menu.Item>
                    */}
                </Menu>
            </Header>
        )
    }

    clickItem(e) {

        const key = e.key
        if (_.includes([
            'landing',
            'home',
            'developer',
            'cr100',
            'empower35',
            'evangelist-training',
            'social',
            'leader',
            'community',
            'directory',
            'account',
            'teams',
            'tasks',
            'login',
            'register',
            'signup',
            'profile/info',
            'admin/tasks',
            'how-to-earn',
            'help',
            'about',
            'faq',
            'contact',
            'slack',
            'user/reset-password'
        ], key)) {

            if (key === 'landing') {
                this.props.history.push('/')
                window.location.reload()
            } else {
                this.props.history.push('/' + e.key)
            }
        }
        else if (key === 'logout') {
            Modal.confirm({
                title: 'Are you sure you want to logout?',
                content: '',
                okText: 'Yes',
                okType: 'danger',
                cancelText: 'No',
                onOk: () => {
                    this.props.logout()
                },
                onCancel() {
                }
            })
        } else if (key === 'profile') {
            this.props.history.push('/profile/teams')
        }
        else if (_.includes([
            'en',
            'zh'
        ], key)) {
            this.props.changeLanguage(e.key);
        }
    }
}
