import React from 'react';
import Link from 'next/link';
import './quick-links-sidebar.less';

interface QuickLink {
  label: string;
  path: string;
  query?: any;
}

const quickLinks: QuickLink[] = [
  { label: 'Vrouwen', path: '/search', query: { gender: 'female' } },
  { label: 'Mannen', path: '/search', query: { gender: 'male' } },
  { label: 'Stellen', path: '/search', query: { gender: 'couple' } },
  { label: 'Shemales', path: '/search', query: { gender: 'transgender' } },
  { label: 'Gay', path: '/search', query: { category: 'gay' } },
  { label: 'BDSM Sex', path: '/search', query: { category: 'bdsm' } },
  { label: 'Virtual Sex', path: '/search', query: { category: 'virtual' } },
  { label: 'Club', path: '/search', query: { category: 'club' } },
  { label: 'Privehuis', path: '/search', query: { category: 'privehuis' } },
  { label: 'Escortbureau', path: '/search', query: { category: 'escortbureau' } },
  { label: 'SM Studio\'s', path: '/search', query: { category: 'sm-studio' } },
  { label: 'Massage Salon', path: '/search', query: { category: 'massage' } }
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

