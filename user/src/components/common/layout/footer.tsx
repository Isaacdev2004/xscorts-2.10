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

  // Quicklinks section (left side)
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

  // Algemeen section links
  const algemeenLinks = [
    { title: 'Veiligheid & Info', path: '/page/veiligheid-info' },
    { title: 'Wie we zijn', path: '/page/wie-we-zijn' },
    { title: 'Advertentieopties', path: '/page/advertentieopties' },
    { title: 'U.S.C. 2257 Naleving (Compliance)', path: '/page/usc-2257-compliance' },
    { title: 'Auteursrechtschending', path: '/page/auteursrechtschending' }
  ];

  // Contact Ons section links
  const contactLinks = [
    { title: 'Support', path: '/hulp-en-ondersteuning' },
    { title: 'Hulp & Ondersteuning', path: '/hulp-en-ondersteuning' },
    { title: 'Misbruik melden', path: '/page/misbruik-melden' },
    { title: 'Cookiebeleid', path: '/page/cookiebeleid' },
    { title: 'Privacyverklaring', path: '/page/privacy-policy' },
    { title: 'Servicevoorwaarden', path: '/page/terms-of-service' },
    { title: 'Terugbetalingsbeleid', path: '/page/terugbetalingsbeleid' }
  ];

  // Socials section links
  const socialLinks = [
    { title: 'X', path: 'https://x.com', icon: 'twitter', external: true },
    { title: 'Reddit', path: 'https://reddit.com', icon: 'default', external: true }
  ];

  return (
    <div className="main-footer">
      <div className="main-container">
        <Row className="content" gutter={[24, 24]}>
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

          {/* Algemeen Section */}
          <Col lg={6} md={8} sm={12} xs={12} key="algemeen">
            <ul>
              <li>
                <h2 className="footer-heading">Algemeen</h2>
              </li>
              {algemeenLinks.map((link) => (
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

          {/* Contact Ons Section */}
          <Col lg={6} md={8} sm={12} xs={12} key="contact">
            <ul>
              <li>
                <h2 className="footer-heading">Contact Ons</h2>
              </li>
              {contactLinks.map((link) => (
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

          {/* Socials Section */}
          <Col lg={6} md={8} sm={12} xs={12} key="socials">
            <ul>
              <li>
                <h2 className="footer-heading">Socials</h2>
              </li>
              {socialLinks.map((link) => (
                <li key={link.path}>
                  <RightOutlined />
                  {' '}
                  {link.external ? (
                    <a href={link.path} target="_blank" rel="noreferrer">{link.title}</a>
                  ) : (
                    <Link href={link.path}>
                      <a>{link.title}</a>
                    </Link>
                  )}
                </li>
              ))}
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
    </div>
  );
};

const mapState = (state: any) => ({
  menus: state.ui?.menus || [],
  loggedIn: state.auth.loggedIn,
  ui: state.ui
});
export default connect(mapState)(Footer) as any;
