import React from 'react';
import Link from 'next/link';
import './quick-links-sidebar.less';

interface QuickLink {
  label: string;
  path: string;
  query?: any;
}

const quickLinks: QuickLink[] = [
  { label: 'Home', path: '/home', query: {} },
  { label: 'Alle categorieën', path: '/search', query: {} },
  { label: 'Vrouwen', path: '/search', query: { gender: 'female' } },
  { label: 'Mannen', path: '/search', query: { gender: 'male' } },
  { label: 'Stellen', path: '/search', query: { gender: 'couple' } },
  { label: 'Shemales', path: '/search', query: { gender: 'transgender' } },
  { label: 'Seksbedrijven', path: '/search', query: { service: 'business' } },
  { label: 'Type Date', path: '/search', query: {} },
  { label: 'Login', path: '/auth/login', query: {} },
  { label: 'Registreren', path: '/auth/user-register', query: {} },
  { label: 'Support', path: '/hulp-en-ondersteuning', query: {} }
];

const QuickLinksSidebar: React.FC = () => {
  return (
    <div className="quick-links-sidebar">
      <div className="quick-links-header">
        <h3>Quick links</h3>
      </div>
      <ul className="quick-links-list">
        {quickLinks.map((link, index) => (
          <li key={index} className="quick-link-item">
            <Link
              href={{
                pathname: link.path,
                query: link.query
              }}
            >
              <a>{link.label}</a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default QuickLinksSidebar;

