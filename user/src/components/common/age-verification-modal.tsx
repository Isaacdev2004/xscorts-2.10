import React, { PureComponent } from 'react';
import { Modal, Checkbox, Button } from 'antd';
import { cookieService } from '@services/index';
import './age-verification-modal.less';

interface IProps {
  visible: boolean;
  onConfirm: () => void;
}

interface IState {
  ageConfirmed: boolean;
  termsConfirmed: boolean;
  cookieConfirmed: boolean;
  canProceed: boolean;
  language: string;
}

// Translation object - can be expanded later
const translations: any = {
  nl: {
    title: 'Belangrijk – lees dit voordat je verdergaat',
    intro1: 'Justlust.nl is uitsluitend toegankelijk voor bezoekers van 18 jaar en ouder. Door deze website te betreden bevestig je dat je de wettelijke minimumleeftijd hebt bereikt en dat je vrijwillig kennisneemt van expliciete content.',
    intro2: 'Bij gebruik van deze website ga je akkoord met onze algemene voorwaarden en privacyverklaring. Wij maken gebruik van cookies om de website goed te laten functioneren, inzicht te krijgen in het gebruik en relevante advertenties te tonen. Je kunt je cookievoorkeuren op ieder moment aanpassen via Mijn instellingen.',
    consentIntro: 'Om toegang te krijgen tot de website vragen wij je te bevestigen dat:',
    ageLabel: 'Je 18 jaar of ouder bent',
    termsLabel: 'Je akkoord gaat met de algemene voorwaarden en de privacyverklaring',
    cookieLabel: 'Je kennis hebt genomen van het cookiebeleid en je cookievoorkeuren accepteert of aanpast',
    warning: 'Indien je niet akkoord gaat of jonger bent dan 18 jaar, dien je deze website te verlaten.',
    buttonText: 'Naar website'
  },
  en: {
    title: 'Important – read this before you continue',
    intro1: 'Justlust.nl is only accessible to visitors aged 18 and over. By entering this website, you confirm that you have reached the legal minimum age and that you voluntarily view explicit content.',
    intro2: 'By using this website, you agree to our terms and conditions and privacy statement. We use cookies to make the website function properly, gain insight into usage and show relevant advertisements. You can adjust your cookie preferences at any time via My settings.',
    consentIntro: 'To gain access to the website, we ask you to confirm that:',
    ageLabel: 'You are 18 years or older',
    termsLabel: 'You agree to the terms and conditions and the privacy statement',
    cookieLabel: 'You have read the cookie policy and accept or adjust your cookie preferences',
    warning: 'If you do not agree or are under 18 years of age, you must leave this website.',
    buttonText: 'To website'
  }
};

class AgeVerificationModal extends PureComponent<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    // Get saved language preference or default to Dutch
    const savedLang = cookieService.getCookie('preferred_language') || 'nl';
    this.state = {
      ageConfirmed: false,
      termsConfirmed: false,
      cookieConfirmed: false,
      canProceed: false,
      language: savedLang
    };
  }

  handleAgeChange = (e: any) => {
    this.setState({ ageConfirmed: e.target.checked }, this.checkCanProceed);
  };

  handleTermsChange = (e: any) => {
    this.setState({ termsConfirmed: e.target.checked }, this.checkCanProceed);
  };

  handleCookieChange = (e: any) => {
    this.setState({ cookieConfirmed: e.target.checked }, this.checkCanProceed);
  };

  handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value;
    this.setState({ language: newLang });
    // Save language preference
    cookieService.setCookie('preferred_language', newLang, 30 * 24 * 60);
  };

  checkCanProceed = () => {
    const { ageConfirmed, termsConfirmed, cookieConfirmed } = this.state;
    const canProceed = ageConfirmed && termsConfirmed && cookieConfirmed;
    this.setState({ canProceed });
  };

  handleConfirm = () => {
    const { ageConfirmed, termsConfirmed, cookieConfirmed } = this.state;
    
    if (ageConfirmed && termsConfirmed && cookieConfirmed) {
      // Set cookies for 30 days (30 * 24 * 60 minutes)
      cookieService.setCookie('confirm_adult', 'true', 30 * 24 * 60);
      cookieService.setCookie('confirm_privacy', 'true', 30 * 24 * 60);
      cookieService.setCookie('confirm_terms', 'true', 30 * 24 * 60);
      cookieService.setCookie('confirm_cookies', 'true', 30 * 24 * 60);
      
      // Call the parent's confirm handler
      this.props.onConfirm();
    }
  };

  render() {
    const { visible } = this.props;
    const { ageConfirmed, termsConfirmed, cookieConfirmed, canProceed, language } = this.state;
    const t = translations[language] || translations.nl; // Default to Dutch if translation not found

    return (
      <Modal
        visible={visible}
        closable={false}
        maskClosable={false}
        footer={null}
        width={700}
        className="age-verification-modal"
        centered
      >
        <div className="age-verification-content">
          <div className="modal-header">
            <h2>{t.title}</h2>
            <div className="language-selector">
              <select 
                className="lang-dropdown" 
                value={language}
                onChange={this.handleLanguageChange}
              >
                <option value="nl">🇳🇱 Nederlands</option>
                <option value="en">🇬🇧 English</option>
                <option value="de">🇩🇪 Deutsch</option>
                <option value="fr">🇫🇷 Français</option>
              </select>
            </div>
          </div>

          <div className="modal-body">
            <div className="info-text">
              <p>{t.intro1}</p>
              <p>{t.intro2}</p>
            </div>

            <div className="consent-section">
              <p className="consent-intro">{t.consentIntro}</p>

              <div className="consent-item">
                <Checkbox
                  checked={ageConfirmed}
                  onChange={this.handleAgeChange}
                  className="consent-checkbox"
                >
                  <span className="consent-label-text">{t.ageLabel}</span>
                </Checkbox>
              </div>

              <div className="consent-item">
                <Checkbox
                  checked={termsConfirmed}
                  onChange={this.handleTermsChange}
                  className="consent-checkbox"
                >
                  <span className="consent-label-text">{t.termsLabel}</span>
                </Checkbox>
              </div>

              <div className="consent-item">
                <Checkbox
                  checked={cookieConfirmed}
                  onChange={this.handleCookieChange}
                  className="consent-checkbox"
                >
                  <span className="consent-label-text">{t.cookieLabel}</span>
                </Checkbox>
              </div>

              <p className="warning-text">{t.warning}</p>
            </div>
          </div>

          <div className="modal-footer">
            <Button
              type="primary"
              size="large"
              onClick={this.handleConfirm}
              disabled={!canProceed}
              className="proceed-button"
            >
              {t.buttonText}
            </Button>
          </div>
        </div>
      </Modal>
    );
  }
}

export default AgeVerificationModal;
