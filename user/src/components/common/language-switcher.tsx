import { PureComponent } from 'react';
import { Dropdown, Menu } from 'antd';
import { GlobalOutlined } from '@ant-design/icons';
import { getCurrentLanguage } from '@contexts/language-context';
import './language-switcher.less';

interface IProps {
  currentLanguage?: string;
  onLanguageChange?: (lang: string) => void;
}

interface ILanguage {
  code: string;
  name: string;
  flag: string;
}

// Supported languages matching kinky.nl structure
const SUPPORTED_LANGUAGES: ILanguage[] = [
  { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' }
];

export class LanguageSwitcher extends PureComponent<IProps> {
  state = {
    currentLanguage: this.props.currentLanguage || getCurrentLanguage()
  };

  handleLanguageSelect = (langCode: string) => {
    this.setState({ currentLanguage: langCode });
    if (this.props.onLanguageChange) {
      this.props.onLanguageChange(langCode);
    }
    // Store in localStorage for persistence (also handled by context)
    if (process.browser) {
      localStorage.setItem('preferred_language', langCode);
      // Dispatch event for context listeners
      window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: langCode } }));
    }
  };

  componentDidMount() {
    // Load saved language preference
    const savedLang = getCurrentLanguage();
    if (savedLang && SUPPORTED_LANGUAGES.find(l => l.code === savedLang)) {
      this.setState({ currentLanguage: savedLang });
    }
    
    // Listen for language changes from context
    if (process.browser) {
      window.addEventListener('languageChanged', this.handleLanguageChange);
    }
  }

  componentWillUnmount() {
    if (process.browser) {
      window.removeEventListener('languageChanged', this.handleLanguageChange);
    }
  }

  handleLanguageChange = (event: CustomEvent) => {
    if (event.detail?.language) {
      this.setState({ currentLanguage: event.detail.language });
    }
  }

  render() {
    const { currentLanguage } = this.state;
    const currentLang = SUPPORTED_LANGUAGES.find(l => l.code === currentLanguage) || SUPPORTED_LANGUAGES[0];

    const languageMenu = (
      <Menu>
        {SUPPORTED_LANGUAGES.map((lang) => (
          <Menu.Item
            key={lang.code}
            onClick={() => this.handleLanguageSelect(lang.code)}
            className={currentLanguage === lang.code ? 'active' : ''}
          >
            <span className="language-flag">{lang.flag}</span>
            <span className="language-name">{lang.name}</span>
          </Menu.Item>
        ))}
      </Menu>
    );

    return (
      <Dropdown overlay={languageMenu} placement="bottomRight">
        <a className="language-switcher" onClick={(e) => e.preventDefault()}>
          <span className="language-flag">{currentLang.flag}</span>
          <span className="language-code">{currentLang.code.toUpperCase()}</span>
        </a>
      </Dropdown>
    );
  }
}

export default LanguageSwitcher;

