/* eslint-disable react/no-danger */
import { useEffect, useState } from 'react';
import { Row, Col, message } from 'antd';
import {
  RightOutlined, TwitterOutlined, FacebookOutlined, YoutubeOutlined, GoogleOutlined
} from '@ant-design/icons';
import { connect } from 'react-redux';
import Link from 'next/link';
import { settingService } from '@services/setting.service';

interface IProps {
  menus: any[];
  loggedIn: boolean;
  ui: any;
}

const Footer = ({ menus = [], loggedIn = false, ui = {} }: IProps) => {
  const [footerContent, setFooterContent] = useState<string>('');

  const fetchFooterContent = async () => {
    try {
      const response = await settingService.valueByKeys(['footerContent']);
      setFooterContent(response.footerContent);
    } catch (error) {
      message.error('Error occurred, please try again!');
    }
  };

  useEffect(() => {
    fetchFooterContent();
  }, [menus, loggedIn, ui]);

  const getMenus = (section) => menus
    .filter((m) => m.section === section)
    .filter((m) => !m.hideLoggedIn || (!loggedIn && m.hideLoggedIn));

  const renderIcon = (menu) => {
    switch (menu.icon) {
      case 'twitter':
        return <TwitterOutlined />;
      case 'facebook':
        return <FacebookOutlined />;
      case 'google':
        return <GoogleOutlined />;
      case 'youtube':
        return <YoutubeOutlined />;
      default:
        return <RightOutlined />;
    }
  };

  const renderSubMenus = (subMenus) => {
    if (!subMenus.length) return null;
    return (
      <ul>
        {subMenus.map((m) => {
          if (m.type === 'title') {
            return (
              <li key={m.title}>
                <h2 className="footer-heading">{m.title}</h2>
              </li>
            );
          }
          return (
            <li key={m.title}>
              {renderIcon(m)}
              {' '}
              <a
                rel="noreferrer"
                href={m.path}
                target={m.isNewTab ? '_blank' : ''}
              >
                {m.title}
              </a>
            </li>
          );
        })}
      </ul>
    );
  };

  const footerMenus = [
    getMenus('footer1'),
    getMenus('footer2'),
    getMenus('footer3')
  ].filter((m) => !!m.length);

  // Quicklinks section (left side) - matching kinky.nl exact order and items
  // Using correct gender values: female, male, transgender
  // typeDate parameters will be passed to search (backend can handle them)
  const quickLinks = [
    { title: 'Vrouwen', path: '/search?gender=female' },
    { title: 'Mannen', path: '/search?gender=male' },
    { title: 'Stellen', path: '/search?gender=couple' },
    { title: 'Shemales', path: '/search?gender=transgender' },
    { title: 'Gay', path: '/search?orientation=gay' },
    { title: 'BDSM', path: '/search?service=bdsm' },
    { title: 'Virtual sex', path: '/search?service=virtual-sex' },
    { title: 'Club', path: '/search?service=club' },
    { title: 'Privehuis', path: '/search?service=privehuis' },
    { title: 'Escortbureau', path: '/search?service=escortbureau' },
    { title: 'SM studio\'s', path: '/search?service=bdsm-studio' },
    { title: 'Massagesalon', path: '/search?service=massagesalon' }
  ];

  return (
    <div className="main-footer">
      <div className="main-container">
        <Row className="content">
          {/* Quicklinks Section (Left) */}
          <Col lg={6} md={8} sm={12} xs={12} key="quicklinks">
            <ul>
              <li>
                <h2 className="footer-heading">Quick links</h2>
              </li>
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <RightOutlined />
                  {' '}
                  <Link href={link.path}>
                    <a>{link.title}</a>
                  </Link>
                </li>
              ))}
            </ul>
          </Col>
          {footerMenus.map((subMenus) => (
            <Col lg={6} md={8} sm={12} xs={12} key={Math.random()}>
              {renderSubMenus(subMenus)}
            </Col>
          ))}
          {/* Hulp en Ondersteuning Section */}
          <Col lg={6} md={8} sm={12} xs={12} key="support">
            <ul>
              <li>
                <h2 className="footer-heading">Hulp en Ondersteuning</h2>
              </li>
              <li>
                <RightOutlined />
                {' '}
                <Link href="/hulp-en-ondersteuning">
                  <a>Hulp en Ondersteuning</a>
                </Link>
              </li>
            </ul>
          </Col>
        </Row>
      </div>
      {footerContent ? (
        <div className="footer-content" dangerouslySetInnerHTML={{ __html: footerContent }} />
      ) : (
        <div className="copyright-text">
          <span>
            <Link href="/home">
              <a>{ui?.siteName}</a>
            </Link>
            {' '}
            © Copyright
            {' '}
            {new Date().getFullYear()}
          </span>
        </div>
      )}
      {/* Privacy and Support buttons at bottom */}
      <div className="footer-bottom-buttons">
        <div className="main-container">
          <Row justify="center" gutter={[16, 16]}>
            <Col>
              <Link href="/page/privacy-policy">
                <a className="footer-bottom-link">Privacy</a>
              </Link>
            </Col>
            <Col>
              <Link href="/hulp-en-ondersteuning">
                <a className="footer-bottom-link">Support</a>
              </Link>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
};

const mapState = (state: any) => ({
  menus: state.ui?.menus || [],
  loggedIn: state.auth.loggedIn,
  ui: state.ui
});
export default connect(mapState)(Footer) as any;
