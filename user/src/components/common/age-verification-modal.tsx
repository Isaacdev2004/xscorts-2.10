import React, { PureComponent } from 'react';
import { Modal, Switch, Button } from 'antd';
import { cookieService } from '@services/index';
import './age-verification-modal.less';

interface IProps {
  visible: boolean;
  onConfirm: () => void;
}

interface IState {
  ageConfirmed: boolean;
  termsConfirmed: boolean;
  privacyConfirmed: boolean;
  cookieConfirmed: boolean;
  canProceed: boolean;
}

class AgeVerificationModal extends PureComponent<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      ageConfirmed: false,
      termsConfirmed: false,
      privacyConfirmed: false,
      cookieConfirmed: false,
      canProceed: false
    };
  }

  handleAgeToggle = (checked: boolean) => {
    this.setState({ ageConfirmed: checked }, this.checkCanProceed);
  };

  handleTermsToggle = (checked: boolean) => {
    this.setState({ termsConfirmed: checked }, this.checkCanProceed);
  };

  handlePrivacyToggle = (checked: boolean) => {
    this.setState({ privacyConfirmed: checked }, this.checkCanProceed);
  };

  handleCookieToggle = (checked: boolean) => {
    this.setState({ cookieConfirmed: checked }, this.checkCanProceed);
  };

  checkCanProceed = () => {
    const { ageConfirmed, termsConfirmed, privacyConfirmed, cookieConfirmed } = this.state;
    const canProceed = ageConfirmed && termsConfirmed && privacyConfirmed && cookieConfirmed;
    this.setState({ canProceed });
  };

  handleConfirm = () => {
    const { ageConfirmed, termsConfirmed, privacyConfirmed, cookieConfirmed } = this.state;
    
    if (ageConfirmed && termsConfirmed && privacyConfirmed && cookieConfirmed) {
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
    const { ageConfirmed, termsConfirmed, privacyConfirmed, cookieConfirmed, canProceed } = this.state;

    return (
      <Modal
        visible={visible}
        closable={false}
        maskClosable={false}
        footer={null}
        width={600}
        className="age-verification-modal"
        centered
      >
        <div className="age-verification-content">
          <div className="modal-header">
            <h2>Important Before You Start!</h2>
            <div className="language-selector">
              <span>🇬🇧</span>
              <select className="lang-dropdown">
                <option value="en">English</option>
                <option value="nl">Nederlands</option>
                <option value="de">Deutsch</option>
                <option value="fr">Français</option>
              </select>
            </div>
          </div>

          <div className="modal-body">
            <div className="info-text">
              <p>
                <strong>XScorts is only intended for persons 18 years and older.</strong> Every visitor must agree to the 
                General Terms and Conditions and the Privacy Policy. Cookie preferences can be saved in 'My Settings'.
              </p>
              <p>
                XScorts uses functional and analytical cookies for website optimization and statistics. 
                In addition, marketing cookies are used to display advertisements. You can manage and save your 
                cookie preferences via 'My Settings'. The Cookie statement describes how you can adjust your cookie preferences.
              </p>
            </div>

            <div className="consent-section">
              <p className="consent-intro">
                Before you continue, we want to know the following from you:
              </p>

              <div className="consent-item">
                <div className="consent-label">
                  <span>I declare to be 18 years or older</span>
                </div>
                <Switch
                  checked={ageConfirmed}
                  onChange={this.handleAgeToggle}
                  className="consent-switch"
                />
              </div>

              <div className="consent-item">
                <div className="consent-label">
                  <span>I agree with the General Terms and Conditions and Privacy Policy.</span>
                </div>
                <Switch
                  checked={termsConfirmed}
                  onChange={this.handleTermsToggle}
                  className="consent-switch"
                />
              </div>

              <div className="consent-item">
                <div className="consent-label">
                  <span>I agree with the Cookie statement and accept cookies according to My settings</span>
                </div>
                <Switch
                  checked={cookieConfirmed}
                  onChange={this.handleCookieToggle}
                  className="consent-switch"
                />
              </div>
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
              Continue to Website
            </Button>
          </div>
        </div>
      </Modal>
    );
  }
}

export default AgeVerificationModal;
