/* eslint-disable react/no-danger */
import { PureComponent } from 'react';
import { Modal, Checkbox, Button, message } from 'antd';
import { cookieService } from '@services/index';
import Link from 'next/link';
import './age-verification-modal.less';

interface IProps {
  visible: boolean;
  onConfirm: () => void;
}

interface IState {
  agreeAge: boolean;
  agreePrivacy: boolean;
  agreeTerms: boolean;
}

export class AgeVerificationModal extends PureComponent<IProps, IState> {
  state: IState = {
    agreeAge: false,
    agreePrivacy: false,
    agreeTerms: false
  };

  handleConfirm = () => {
    const { agreeAge, agreePrivacy, agreeTerms } = this.state;
    
    if (!agreeAge || !agreePrivacy || !agreeTerms) {
      message.error('Je moet alle voorwaarden accepteren om door te gaan');
      return;
    }

    // Set cookies for all acceptances
    cookieService.setCookie('confirm_adult', 'true', 24 * 60); // 24 hours
    cookieService.setCookie('confirm_privacy', 'true', 24 * 60 * 30); // 30 days
    cookieService.setCookie('confirm_terms', 'true', 24 * 60 * 30); // 30 days
    
    this.props.onConfirm();
  };

  render() {
    const { visible } = this.props;
    const { agreeAge, agreePrivacy, agreeTerms } = this.state;
    const allAgreed = agreeAge && agreePrivacy && agreeTerms;

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
          <h2 className="modal-title">18+ Bevestiging Vereist</h2>
          
          <div className="modal-warning">
            <p>
              <strong>WAARSCHUWING:</strong> Deze website bevat inhoud voor volwassenen (18+).
              Je moet bevestigen dat je minstens 18 jaar oud bent en akkoord gaat met onze
              voorwaarden om toegang te krijgen.
            </p>
          </div>

          <div className="modal-checkboxes">
            <div className="checkbox-item">
              <Checkbox
                checked={agreeAge}
                onChange={(e) => this.setState({ agreeAge: e.target.checked })}
              >
                <span className="checkbox-label">
                  Ik bevestig dat ik <strong>minstens 18 jaar oud</strong> ben
                </span>
              </Checkbox>
            </div>

            <div className="checkbox-item">
              <Checkbox
                checked={agreePrivacy}
                onChange={(e) => this.setState({ agreePrivacy: e.target.checked })}
              >
                <span className="checkbox-label">
                  Ik accepteer het{' '}
                  <Link href="/page/privacy-policy">
                    <a target="_blank" className="link-neon">Privacybeleid</a>
                  </Link>
                </span>
              </Checkbox>
            </div>

            <div className="checkbox-item">
              <Checkbox
                checked={agreeTerms}
                onChange={(e) => this.setState({ agreeTerms: e.target.checked })}
              >
                <span className="checkbox-label">
                  Ik accepteer de{' '}
                  <Link href="/page/terms-of-service">
                    <a target="_blank" className="link-neon">Algemene Voorwaarden</a>
                  </Link>
                </span>
              </Checkbox>
            </div>
          </div>

          <div className="modal-actions">
            <Button
              type="primary"
              size="large"
              onClick={this.handleConfirm}
              disabled={!allAgreed}
              className="btn-neon-primary"
            >
              Bevestigen en Doorgaan
            </Button>
            <Button
              size="large"
              onClick={() => {
                window.location.href = 'https://www.google.com';
              }}
              className="btn-neon-secondary"
            >
              Terug
            </Button>
          </div>
        </div>
      </Modal>
    );
  }
}

export default AgeVerificationModal;

