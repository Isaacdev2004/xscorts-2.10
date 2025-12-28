/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { createRef, PureComponent } from 'react';
import {
  Layout,
  Avatar,
  Drawer,
  Divider,
  Dropdown,
  Badge,
  Menu,
  Card,
  Modal,
  Button,
  message
} from 'antd';
import { connect } from 'react-redux';
import Link from 'next/link';
import Router, { Router as RouterEvent, withRouter } from 'next/router';
import { logout } from '@redux/auth/actions';
import {
  SearchOutlined,
  HeartOutlined,
  UserOutlined,
  HistoryOutlined,
  LogoutOutlined,
  LoginOutlined,
  TwitterOutlined,
  FacebookOutlined,
  YoutubeOutlined,
  GoogleOutlined,
  CloseCircleOutlined,
  MenuOutlined,
  BellOutlined,
  BookOutlined,
  MessageOutlined,
  ScheduleOutlined,
  BlockOutlined,
  BarChartOutlined,
  CloseOutlined
} from '@ant-design/icons';
import {
  authService,
  messageService,
  scheduleService,
  subscriptionService
} from 'src/services';
import { SocketContext } from 'src/socket';
import {
  setScheduleBooking,
  accessScheduleBooking,
  dismissAllScheduleBooking
} from '@redux/schedule-booking/actions';
import classnames from 'classnames';
import { Booking, IUser } from 'src/interfaces';
import { formatDate } from '@lib/date';
import { ProfileCard } from '@components/user/profile-card';
import { getResponseError } from '@lib/utils';
import { capitalizeFirstLetter, isUrl } from '@lib/string';
import SearchBar from './search-bar';
import LanguageSwitcher from '../language-switcher';
import './header.less';

const EVENT = {
  NOTIFY_CREATED_BOOKING: 'nofify_created_booking',
  NOTIFY_BOOKING_STATUS_CHANGED: 'notify_booking_status_changed',
  NOTIFY_READ_MESSAGE: 'nofify_read_messages_in_conversation'
};

interface IProps {
  currentUser?: IUser;
  loggedIn?: boolean;
  logout?: Function;
  router: any;
  ui?: any;
  cart?: any;
  addCart: Function;
  setScheduleBooking: Function;
  accessScheduleBooking: Function;
  dismissAllScheduleBooking: Function;
  bookings: Booking[];
}

class Header extends PureComponent<IProps> {
  private socket;

  private getPerformerBookingInterval: NodeJS.Timeout;

  private getUserBookingNotificationInterval: NodeJS.Timeout;

  private searchOverlayRef;

  state = {
    openSearch: false,
    openProfile: false,
    openMenu: false,
    openModal: false,
    data: null,
    totalNotReadMessage: 0,
    showUpgradeMembership: false,
    path: null
  };

  componentDidMount() {
    const { loggedIn, currentUser } = this.props;
    if (typeof window !== 'undefined') {
      const { pathname } = window.location;
      this.setState({ path: pathname });
    }

    RouterEvent.events.on('routeChangeStart', async () => this.handleStateChange());
    if (loggedIn) {
      this.initSocketEvent();
      this.countTotalMessage();
      if (currentUser.roles.includes('performer')) {
        this.handleScheduleBooking();
        this.getPerformerBookingInterval = setInterval(() => {
          this.handleScheduleBooking();
        }, 30000);
      }

      if (!currentUser.roles.includes('performer')) {
        this.handleBookingStatusChanged();
        this.getUserBookingNotificationInterval = setInterval(() => {
          this.handleBookingStatusChanged();
        }, 30000);
      }
    }
    this.searchOverlayRef = createRef();
    this.checkMembership();
  }

  componentDidUpdate(prevProps: IProps) {
    const { loggedIn } = this.props;
    if (loggedIn && prevProps.loggedIn !== loggedIn) {
      setTimeout(this.initSocketEvent, 1000);
      this.countTotalMessage();
    }
  }

  componentWillUnmount() {
    RouterEvent.events.off('routeChangeStart', async () => this.handleStateChange());
    if (this.socket) {
      this.socket.off(EVENT.NOTIFY_CREATED_BOOKING);
      this.socket.off(EVENT.NOTIFY_READ_MESSAGE);
      this.socket.off(EVENT.NOTIFY_BOOKING_STATUS_CHANGED);
    }
    if (this.getPerformerBookingInterval) {
      clearInterval(this.getPerformerBookingInterval);
      this.getPerformerBookingInterval = null;
    }

    document.removeEventListener('click', this.handleClickOutside, false);
  }

  handleStateChange = () => {
    this.setState({ openProfile: false, openSearch: false, openMenu: false });
    this.enableClickOutside(false);
  };

  beforeLogout = async () => {
    const { logout: logoutHandler } = this.props;
    const token = authService.getToken();
    const socket = this.context;
    token && socket && (await socket.emit('auth/logout', { token }));
    socket && socket.close();
    logoutHandler();
  };

  checkMembership = async () => {
    const { currentUser } = this.props;
    if (!currentUser?.roles.includes('performer')) return;

    // const checkAlert = localStorage.getItem('checkSubscriptionAlert');
    // if (checkAlert) return;
    // localStorage.setItem('checkSubscriptionAlert', '1');
    const { data } = await subscriptionService.current();
    if (!data) {
      this.setState({
        showUpgradeMembership: true
      });
    }
  };

  checkActiveMenu = (url) => {
    const { path } = this.state;
    if (path === url) return true;
    if (isUrl(url)) {
      const u = new URL(url);
      if (path === u.pathname) return true;
    }

    return false;
  };

  renderIcon = (menu) => {
    switch (menu.icon) {
      case 'twitter':
        return <TwitterOutlined />;
      case 'facebook':
        return <FacebookOutlined />;
      case 'google':
        return <GoogleOutlined />;
      case 'youtube':
        return <YoutubeOutlined />;
      case 'login':
        return <LoginOutlined />;
      case 'profile':
        return <UserOutlined />;
      case 'favorite':
        return <HeartOutlined />;
      default:
        return null;
    }
  };

  renderNotifications = () => {
    const { bookings } = this.props;
    const { showUpgradeMembership } = this.state;

    return (
      <Dropdown
        overlayClassName="booking-notification-overlay default-notification"
        overlay={(
          <Menu style={{ maxHeight: 400, overflow: 'scroll' }}>
            {showUpgradeMembership && (
              <Menu.Item key="upgrademembership">
                No active subscription found. Click
                {' '}
                <a href="/model/profile/upgrade-membership">here</a>
                .
              </Menu.Item>
            )}

            {bookings.length > 0 ? (
              <>
                {bookings.map((data) => (
                  <>
                    <Menu.Item
                      key={data._id}
                      onClick={() => this.accessScheduleBooking(data._id)}
                    >
                      <Card bordered={false} hoverable={false}>
                        <Card.Meta
                          style={{ borderBottom: '0.5px solid #ccc' }}
                          avatar={(
                            <Avatar
                              style={{
                                border: '2px solid #eebd22',
                                width: 40,
                                height: 40,
                                marginTop: 5
                              }}
                              src={data.sourceInfo?.avatar || '/no-avatar.png'}
                            />
                          )}
                          description={(
                            <>
                              <div
                                style={{
                                  float: 'left',
                                  height: 75,
                                  width: 175,
                                  lineHeight: '30px',
                                  padding: '0 5px'
                                }}
                              >
                                <span className="booking-text">Booking: </span>
                                <span className="booking-text username">
                                  {data.sourceInfo?.username}
                                </span>
                                <br />
                                <div className="format-date">
                                  {formatDate(data?.createdAt)}
                                </div>
                              </div>
                              <Button
                                className="primary"
                                size="small"
                                style={{ zIndex: 2 }}
                                onClick={async () => {
                                  try {
                                    await scheduleService.performerFindOneBooking(
                                      data._id
                                    );
                                    Router.push({
                                      pathname: '/messages',
                                      query: {
                                        toSource: 'user',
                                        toId: data.sourceInfo?._id || ''
                                      }
                                    });
                                  } catch (e) {
                                    const error = await Promise.resolve(e);
                                    message.error(getResponseError(error));
                                  }
                                }}
                              >
                                CHAT
                              </Button>
                            </>
                          )}
                        />
                      </Card>
                    </Menu.Item>
                  </>
                ))}
                <Menu.Item>
                  <Button
                    className="primary"
                    id="DismissAllButton"
                    onClick={this.dismissAllcheduleBooking.bind(this)}
                  >
                    Dismiss All
                  </Button>
                </Menu.Item>
              </>
            ) : (
              !showUpgradeMembership && (
                <Menu.Item>There are no new notification.</Menu.Item>
              )
            )}
          </Menu>
        )}
      >
        <span>
          <Badge count={bookings.length}>
            <BellOutlined />
          </Badge>
        </span>
      </Dropdown>
    );
  };

  renderUserNotification = () => {
    const { bookings: dataSource, currentUser } = this.props;

    const notificationMenu = (
      <Menu className="notification" style={{ maxHeight: 400 }}>
        {dataSource.length > 0 ? (
          <>
            {dataSource.map((data) => (
              <Menu.Item
                key={data._id}
                onClick={() => this.accessScheduleBooking(data._id)}
              >
                <Card bordered={false} hoverable={false}>
                  <Card.Meta
                    style={{ borderBottom: '0.5px solid #ccc' }}
                    avatar={(
                      <Avatar
                        style={{
                          border: '2px solid #eebd22',
                          width: 40,
                          height: 40,
                          marginTop: 5
                        }}
                        src={data?.dataInfo?.avatar || '/no-avatar.png'}
                      />
                      )}
                    description={(
                      <>
                        <div>
                          <span className="booking-text">
                            {currentUser?.roles?.includes('performer')
                              ? `Booking notification received from: ${capitalizeFirstLetter(
                                data.sourceInfo?.username
                              )}`
                              : `Booking: ${capitalizeFirstLetter(data?.dataInfo?.username || '')} `}
                          </span>
                          <span className="booking-text username" />
                          <br />
                          <div className="text-ellipsis">
                            <span>
                              {`${capitalizeFirstLetter(
                                data.sourceInfo?.username || ''
                              )} has ${data.status} your booking`}
                            </span>
                          </div>
                          <div className="format-date">
                            Start At:
                            {' '}
                            {formatDate(data?.startAt)}
                          </div>
                        </div>
                        <Button
                          className="primary"
                          size="small"
                          style={{ zIndex: 2 }}
                          onClick={() => {
                            Router.push({
                              pathname: '/messages',
                              query: {
                                toSource: currentUser.roles?.includes('performer') ? 'performer' : 'user',
                                toId: currentUser.roles?.includes('performer') ? data.fromSourceId : data.targetId
                              }
                            });
                          }}
                        >
                          CHAT
                        </Button>
                      </>
                      )}
                  />
                </Card>
              </Menu.Item>
            ))}
            <Menu.Item>
              <Button
                className="primary"
                id="DismissAllButton"
                onClick={this.dismissAllUserBookingNotification.bind(this)}
              >
                Dismiss All
              </Button>
            </Menu.Item>
          </>
        ) : (
          <Menu.Item>There are no new notifications.</Menu.Item>
        )}
      </Menu>
    );

    return (
      <Dropdown
        overlayClassName="booking-notification-overlay default-notification"
        overlay={notificationMenu}
        placement="topRight"
        getPopupContainer={(trigger) => trigger.parentNode as HTMLElement}
      >
        <span>
          <Badge count={dataSource.length}>
            <BellOutlined />
            {/* <span>Notification</span> */}
          </Badge>
        </span>
      </Dropdown>
    );
  };

  renderSearch = () => {
    const { ui, loggedIn } = this.props;
    const { openSearch } = this.state;
    const menus = ui?.menus
      ?.filter((m) => m.section === 'header')
      .filter((m) => !m.hideLoggedIn || (!loggedIn && m.hideLoggedIn));

    return (
      <>
        {menus?.map((menu) => {
          if (menu.icon === 'search') {
            return (
              <span
                key="search"
                className={openSearch ? 'active' : ''}
                aria-hidden
                onClick={() => {
                  const enable = !openSearch;
                  this.setState({ openSearch: enable });
                  this.enableClickOutside(enable);
                }}
              >
                <a className="search-mobile">
                  <SearchOutlined />
                </a>
              </span>
            );
          }
          return null; // Add a return statement for the else case
        })}
      </>
    );
  };

  handleTypeDateClick = (typeDate: string) => {
    // Map typeDate to service parameter (which is supported by search API)
    // This ensures the search works correctly
    Router.push({
      pathname: '/search',
      query: { service: typeDate }
    });
  };


  renderMenus = () => {
    const { ui, loggedIn, currentUser } = this.props;
    const {
      openSearch, openMenu, totalNotReadMessage
    } = this.state;

    const menus = ui?.menus
      ?.filter((m) => m.section === 'header')
      .filter((m) => !m.hideLoggedIn || (!loggedIn && m.hideLoggedIn));

    // Alle categorieën dropdown menu items (matching kinky.nl)
    const categoriesMenuItems = (
      <Menu>
        <Menu.Item key="vrouwen" onClick={() => Router.push('/search?gender=female')}>
          Vrouwen
        </Menu.Item>
        <Menu.Item key="mannen" onClick={() => Router.push('/search?gender=male')}>
          Mannen
        </Menu.Item>
        <Menu.Item key="stellen" onClick={() => Router.push('/search?gender=couple')}>
          Stellen
        </Menu.Item>
        <Menu.Item key="shemales" onClick={() => Router.push('/search?gender=transgender')}>
          Shemales
        </Menu.Item>
        <Menu.Item key="seksbedrijven" onClick={() => Router.push('/search?service=business')}>
          Seksbedrijven
        </Menu.Item>
      </Menu>
    );

    // Type Date dropdown menu items (order matching kinky.nl: Escort, Prive ontvangst, etc.)
    const typeDateMenuItems = (
      <Menu>
        <Menu.Item key="escort" onClick={() => this.handleTypeDateClick('escort')}>
          Escort
        </Menu.Item>
        <Menu.Item key="prive-ontvangst" onClick={() => this.handleTypeDateClick('prive-ontvangst')}>
          Privé ontvangst
        </Menu.Item>
        <Menu.Item key="erotische-massage" onClick={() => this.handleTypeDateClick('erotische-massage')}>
          Erotische massage
        </Menu.Item>
        <Menu.Item key="bdsm" onClick={() => this.handleTypeDateClick('bdsm')}>
          BDSM
        </Menu.Item>
        <Menu.Item key="raamprostitutie" onClick={() => this.handleTypeDateClick('raamprostitutie')}>
          Raamprostitutie
        </Menu.Item>
        <Menu.Item key="virtual-sex" onClick={() => this.handleTypeDateClick('virtual-sex')}>
          Virtual sex
        </Menu.Item>
      </Menu>
    );

    // Overig dropdown menu items (matching kinky.nl)
    const overigMenuItems = (
      <Menu>
        <Menu.Item key="videos" onClick={() => Router.push('/search?service=video')}>
          Video's
        </Menu.Item>
        <Menu.Item key="webcamsex" onClick={() => Router.push('/search?service=webcam')}>
          Webcamsex
        </Menu.Item>
        <Menu.Item key="klantenservice" onClick={() => Router.push('/hulp-en-ondersteuning')}>
          Klantenservice
        </Menu.Item>
      </Menu>
    );

    return (
      <>
        <ul
          className={
            openMenu ? 'nav-links nav-icons m-menu-open' : 'nav-links nav-icons'
          }
        >
          {/* Alle categorieën Dropdown */}
          <li key="alle-categorieen">
            <Dropdown overlay={categoriesMenuItems} placement="bottomLeft">
              <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
                Alle categorieën
              </a>
            </Dropdown>
          </li>
          {/* Type Date Dropdown */}
          <li key="type-date">
            <Dropdown overlay={typeDateMenuItems} placement="bottomLeft">
              <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
                Type Date
              </a>
            </Dropdown>
          </li>
          {/* Overig Dropdown */}
          <li key="overig">
            <Dropdown overlay={overigMenuItems} placement="bottomLeft">
              <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
                Overig
              </a>
            </Dropdown>
          </li>
          {/* Filters Link (matching kinky.nl) */}
          <li key="filters">
            <Link href="/search">
              <a>
                <span className={this.checkActiveMenu('/search') ? 'active' : ''}>
                  Filters
                </span>
              </a>
            </Link>
          </li>
          {menus?.map((menu) => {
            if (menu.icon === 'search') {
              return (
                <li
                  key="search"
                  className={`search ${openSearch ? 'active' : ''}`}
                  aria-hidden
                  onClick={() => {
                    const enable = !openSearch;
                    this.setState({ openSearch: enable });
                    this.enableClickOutside(enable);
                  }}
                />
              );
            }

            if (menu.type === 'title') {
              return (
                <li key={menu.name}>
                  <h2>{menu.title}</h2>
                </li>
              );
            }
            return (
              <li key={menu.path}>
                <a
                  href={menu.path}
                  target={menu.isNewTab ? '_blank' : ''}
                  rel="noreferrer"
                >
                  {this.renderIcon(menu)}
                  <span className={this.checkActiveMenu(menu.path) ? 'active' : ''}>
                    {menu.title}
                  </span>
                </a>
              </li>

            );
          })}
          {openMenu && (
          <li
            key="close"
            aria-hidden
            onClick={() => {
              this.setState({ openMenu: !openMenu });
            }}
          >
            <a className="search-mobile">
              <CloseOutlined className="close-icon" />
            </a>
          </li>
          )}

          {loggedIn && (
          <>
            {!currentUser.roles.includes('performer') && (
            <>
              <li className="nav-mobile">
                <a href="/user/my-favorite">
                  <span className="nav-icon">
                    <HeartOutlined />
                  </span>
                </a>
              </li>
              <li className="nav-mobile">
                <a href="/user/account">
                  <span className="nav-icon">
                    <UserOutlined />
                  </span>
                </a>
              </li>

            </>
            )}
          </>
          )}

        </ul>
        <ul className="right-header">
          {/* Language Switcher - matching kinky.nl position */}
          <li key="language-switcher" className="language-switcher-item">
            <LanguageSwitcher />
          </li>
          {menus?.map((menu) => {
            if (menu.icon === 'search') {
              return (
                <li
                  key="search"
                  className={`search ${openSearch ? 'active' : ''}`}
                  aria-hidden
                  onClick={() => {
                    const enable = !openSearch;
                    this.setState({ openSearch: enable });
                    this.enableClickOutside(enable);
                  }}
                >
                  <a className="search-mobile">
                    <SearchOutlined />
                  </a>
                </li>
              );
            }
          })}
          {loggedIn && (
            <>
              <li className="notification ">{currentUser?.roles.includes('performer') ? this.renderNotifications() : this.renderUserNotification()}</li>
              <Link href="/messages" as="/messages">
                <li className="message">
                  <span>
                    <Badge count={totalNotReadMessage} overflowCount={9}>
                      <MessageOutlined />
                      <span>Message</span>
                    </Badge>
                  </span>
                </li>
              </Link>
              <li
                aria-hidden
                onClick={() => this.setState({ openProfile: true })}
                className="hide-on-mobile"
              >
                <Avatar src={currentUser.avatar || '/no-avatar.png'} />
              </li>

            </>
          )}
        </ul>
      </>

    );
  };

  initSocketEvent = () => {
    this.socket = this.context;
    const { currentUser } = this.props;
    if (this.socket.connected) {
      if (currentUser.roles.includes('performer')) {
        this.socket.on(
          EVENT.NOTIFY_CREATED_BOOKING,
          this.handleScheduleBooking
        );
      }
      if (currentUser.roles.includes('user')) {
        this.socket.on(
          EVENT.NOTIFY_BOOKING_STATUS_CHANGED,
          this.handleBookingStatusChanged
        );
      }
      this.socket.on(EVENT.NOTIFY_READ_MESSAGE, this.handleMessage);
    } else {
      this.socket.on('connect', () => {
        if (currentUser.roles.includes('performer')) {
          this.socket.on(
            EVENT.NOTIFY_CREATED_BOOKING,
            this.handleScheduleBooking
          );
        }
        if (currentUser.roles.includes('user')) {
          this.socket.on(
            EVENT.NOTIFY_BOOKING_STATUS_CHANGED,
            this.handleBookingStatusChanged
          );
        }
        this.socket.on(EVENT.NOTIFY_READ_MESSAGE, this.handleMessage);
      });
    }
  };

  handleScheduleBooking = async () => {
    const { setScheduleBooking: dispatchFetchScheduleBooking } = this.props;
    const resp = await Promise.resolve(
      scheduleService.performerFindBooking({
        status: 'created',
        sortBy: 'createdAt',
        sort: 'desc',
        offset: 0,
        limit: 10
      })
    );
    if (resp.data) {
      dispatchFetchScheduleBooking(resp.data.data);
    }
  };

  handleBookingStatusChanged = async () => {
    const { setScheduleBooking: dispatchFetchScheduleBooking } = this.props;
    const resp = await Promise.resolve(scheduleService.listNotification());
    if (resp.data) {
      dispatchFetchScheduleBooking(resp.data.data);
    }
  };

  handleMessage = (event) => {
    event && this.setState({ totalNotReadMessage: event.total });
  };

  enableClickOutside = (enable = true) => {
    if (enable) {
      document.addEventListener('click', this.handleClickOutside, false);
    } else {
      document.removeEventListener('click', this.handleClickOutside, false);
    }
  };

  handleClickOutside = (event) => {
    if (!this.searchOverlayRef?.current?.contains(event.target)) {
      this.setState({ openSearch: false });
      this.enableClickOutside(false);
    }
  };

  async accessScheduleBooking(id: string) {
    const { accessScheduleBooking: dispatchAccessScheduleBooking } = this.props;
    await Promise.resolve(scheduleService.dismiss(id));
    dispatchAccessScheduleBooking(id);
  }

  async dismissAllcheduleBooking() {
    const { dismissAllScheduleBooking: dispatchDismissAllScheduleBooking } = this.props;
    await Promise.resolve(scheduleService.dismissAll());
    dispatchDismissAllScheduleBooking();
  }

  async dismissAllUserBookingNotification() {
    const { dismissAllScheduleBooking: dispatchDismissAllScheduleBooking } = this.props;
    await Promise.resolve(scheduleService.dismissAllNotification());
    dispatchDismissAllScheduleBooking();
  }

  showUserProfile() {}

  async countTotalMessage() {
    const data = await (await messageService.countTotalNotRead()).data;
    if (data) {
      this.setState({ totalNotReadMessage: data.total });
    }
  }

  render() {
    const {
      currentUser, router, ui, loggedIn
    } = this.props;
    const {
      totalNotReadMessage,
      openSearch,
      openProfile,
      openMenu,
      openModal,
      data
    } = this.state;
    return (
      <div className="main-header">
        <div className="main-container">
          <Layout.Header className="header fixed-top" id="layoutHeader">
            <div className="nav-bar">
              <span className="label-check-box">
                <MenuOutlined
                  className="menu-out-line"
                  onClick={() => this.setState({ openMenu: !openMenu })}
                />
              </span>
              <div className="nav-logo">
                <Link href="/home">
                  <a>
                    {ui?.logo ? (
                      <img alt="logo" src={ui?.logo} height="30" />
                    ) : (
                      <span>{ui?.siteName}</span>
                    )}
                  </a>
                </Link>
              </div>
              {/* <div className="nav-bar-mobile">
                {this.renderSearch()}
                {currentUser && (
                  <>
                    {loggedIn && this.renderUserNotification()}
                    {loggedIn && (
                      <Link href="/messages" as="/messages">
                        <span>
                          <Badge count={totalNotReadMessage} overflowCount={9}>
                            <MessageOutlined />
                          </Badge>
                        </span>
                      </Link>
                    )}
                  </>
                )}
                {loggedIn && (
                <div className="mobile-avatar-container" onClick={() => this.setState({ openProfile: true })}>
                  <Avatar src={currentUser.avatar || '/no-avatar.png'} />
                </div>
                )}
              </div> */}
              {this.renderMenus()}

              {openSearch && (
                <div className="searchOverlay" ref={this.searchOverlayRef}>
                  <div className="searchOverlayContent">
                    <h2 className="searchHeading">What are you looking for?</h2>
                    <div className="search-input-wrapper">
                      <SearchBar
                        onEnter={() => {
                          this.setState({ openSearch: false });
                          this.enableClickOutside(false);
                        }}
                      />
                    </div>
                    <span className="close-btn">
                      <CloseCircleOutlined
                        onClick={() => {
                          this.setState({ openSearch: false });
                          this.enableClickOutside(false);
                        }}
                        style={{ fontSize: '24px' }}
                      />
                    </span>
                  </div>
                </div>
              )}
              <Drawer
                title={(
                  <div className="profile-user">
                    <img
                      src={currentUser.avatar || '/no-avatar.png'}
                      alt="logo"
                    />
                    <a className="profile-name">
                      {currentUser.name || 'N/A'}
                      <span>
                        @
                        {currentUser.username || 'n/a'}
                      </span>
                    </a>
                  </div>
                )}
                closable
                onClose={() => this.setState({ openProfile: false })}
                visible={openProfile}
                key="profile-drawer"
                className="profile-drawer"
                width={280}
              >
                <div className="profile-menu-item">
                  {!currentUser.roles?.includes('performer') && (
                    <Link href="/user/account" as="/user/account">
                      <div
                        className={
                          router.pathname === '/user/account'
                            ? 'menu-item active'
                            : 'menu-item'
                        }
                      >
                        <UserOutlined />
                        {' '}
                        Profile
                      </div>
                    </Link>
                  )}
                  {currentUser.roles?.includes('performer') && (
                    <>
                      <Link
                        href="/model/profile/edit-profile"
                        as="/model/profile/edit-profile"
                      >
                        <div
                          className={
                            router.pathname === '/model/profile/edit-profile'
                              ? 'menu-item active'
                              : 'menu-item'
                          }
                        >
                          <UserOutlined />
                          {' '}
                          Profile
                        </div>
                      </Link>

                      <Link
                        href="/model/profile/upgrade-membership"
                        as="/model/profile/upgrade-membership"
                      >
                        <div
                          className={
                            router.pathname
                            === '/model/profile/upgrade-membership'
                              ? 'menu-item active'
                              : 'menu-item'
                          }
                        >
                          <UserOutlined />
                          {' '}
                          Membership
                        </div>
                      </Link>
                      <Divider />
                      <Link href="/model/black-list" as="/model/black-list">
                        <div
                          className={
                            router.pathname === '/model/black-list'
                              ? 'menu-item active'
                              : 'menu-item'
                          }
                        >
                          <BlockOutlined />
                          {' '}
                          Blacklist
                        </div>
                      </Link>
                      <Divider />
                      <Link href="/model/schedule" as="/model/schedule">
                        <div
                          className={
                            router.pathname === '/model/schedule'
                              ? 'menu-item active'
                              : 'menu-item'
                          }
                        >
                          <ScheduleOutlined />
                          {' '}
                          Schedule
                        </div>
                      </Link>
                      <Link href="/model/bookings">
                        <div
                          className={classnames('menu-item', {
                            active:
                              router.pathname === '/model/bookings'
                              || router.pathname === '/user/bookings'
                          })}
                        >
                          <BookOutlined />
                          {' '}
                          All bookings
                        </div>
                      </Link>

                      <Link href="/model/bookings/monthly">
                        <div
                          className={classnames('menu-item', {
                            active:
                              router.pathname === '/model/bookings/monthly'
                              || router.pathname === '/model/bookings/monthly'
                          })}
                        >
                          <BarChartOutlined />
                          {' '}
                          Monthly bookings
                        </div>
                      </Link>
                      <Divider />
                      <Link
                        href="/model/payment-history"
                        as="/model/payment-history"
                      >
                        <div
                          className={
                            router.pathname === '/model/payment-history'
                              ? 'menu-item active'
                              : 'menu-item'
                          }
                        >
                          <HistoryOutlined />
                          {' '}
                          Payment History
                        </div>
                      </Link>
                    </>
                  )}
                  <Divider />
                  {!currentUser.roles?.includes('performer') && (
                    <Link href="/user/bookings">
                      <div
                        className={classnames('menu-item', {
                          active:
                            router.pathname === '/model/bookings'
                            || router.pathname === '/user/bookings'
                        })}
                      >
                        <BookOutlined />
                        {' '}
                        All Bookings
                      </div>
                    </Link>
                  )}
                  {/* <Link href="/user/my-favourite" as="/user/my-favourite">
                    <div
                      className={
                        router.pathname === '/user/my-favourite'
                          ? 'menu-item active'
                          : 'menu-item'
                      }
                    >
                      <LikeOutlined />
                      {' '}
                      Favourite Vids
                    </div>
                  </Link>
                  <Link href="/user/my-wishlist" as="/user/my-wishlist">
                    <div
                      className={
                        router.pathname === '/user/my-wishlist'
                          ? 'menu-item active'
                          : 'menu-item'
                      }
                    >
                      <HeartOutlined />
                      {' '}
                      Wishlist Vids
                    </div>
                  </Link> */}
                  {!currentUser.roles?.includes('performer') && (
                    <Link href="/user/my-favorite" as="/user/my-favorite">
                      <div
                        className={
                          router.pathname === '/user/my-favorite'
                            ? 'menu-item active'
                            : 'menu-item'
                        }
                      >
                        <HeartOutlined />
                        {' '}
                        My Favorites
                      </div>
                    </Link>
                  )}
                  <Divider />
                  <div
                    className="menu-item"
                    aria-hidden
                    onClick={() => this.beforeLogout()}
                  >
                    <LogoutOutlined />
                    {' '}
                    Sign Out
                  </div>
                </div>
              </Drawer>
            </div>
          </Layout.Header>
        </div>
        <Modal
          visible={openModal}
          onCancel={() => this.setState({ openModal: false })}
          footer={null}
        >
          <ProfileCard dataSource={data} />
        </Modal>
      </div>
    );
  }
}

Header.contextType = SocketContext;
const mapState = (state: any) => ({
  loggedIn: state.auth.loggedIn,
  currentUser: state.user.current,
  ui: { ...state.ui },
  bookings: state.scheduleBooking.data
});
const mapDispatch = {
  logout,
  setScheduleBooking,
  accessScheduleBooking,
  dismissAllScheduleBooking
};
export default withRouter(connect(mapState, mapDispatch)(Header)) as any;
