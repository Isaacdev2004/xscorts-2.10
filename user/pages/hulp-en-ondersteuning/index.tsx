/* eslint-disable react/no-danger */
import { PureComponent } from 'react';
import { Layout, Collapse } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import SeoMetaHead from '@components/common/seo-meta-head';
import { IUIConfig } from '@interfaces/index';
import './index.less';

const { Panel } = Collapse;

interface IProps {
  ui: IUIConfig;
}

// Help content structure - all in Dutch, text-only
const HELP_SECTIONS = [
  {
    key: 'account',
    title: 'Account Problemen',
    content: [
      {
        question: 'Hoe maak ik een account aan?',
        answer: 'Klik op "Registreren" in de rechterbovenhoek van de website. Vul het registratieformulier in met je e-mailadres, gebruikersnaam en wachtwoord. Je ontvangt een verificatie-e-mail om je account te activeren.'
      },
      {
        question: 'Ik kan niet inloggen op mijn account',
        answer: 'Controleer of je de juiste gebruikersnaam en wachtwoord gebruikt. Let op hoofdletters en kleine letters. Als je je wachtwoord bent vergeten, gebruik dan de "Wachtwoord vergeten" functie op de inlogpagina.'
      },
      {
        question: 'Mijn account is geblokkeerd',
        answer: 'Als je account is geblokkeerd, neem dan contact met ons op via het contactformulier. Vermeld je gebruikersnaam en e-mailadres zodat we je kunnen helpen.'
      },
      {
        question: 'Hoe wijzig ik mijn e-mailadres?',
        answer: 'Ga naar je accountinstellingen en selecteer "E-mail wijzigen". Je ontvangt een verificatie-e-mail op je nieuwe adres. Klik op de link in de e-mail om de wijziging te bevestigen.'
      }
    ]
  },
  {
    key: 'username',
    title: 'Gebruikersnaam Herstel',
    content: [
      {
        question: 'Ik ben mijn gebruikersnaam vergeten',
        answer: 'Als je je gebruikersnaam bent vergeten, gebruik dan de "Gebruikersnaam vergeten" functie op de inlogpagina. Voer je geregistreerde e-mailadres in en je ontvangt een e-mail met je gebruikersnaam.'
      },
      {
        question: 'Kan ik mijn gebruikersnaam wijzigen?',
        answer: 'Gebruikersnamen kunnen niet worden gewijzigd na registratie. Als je een nieuwe gebruikersnaam wilt, moet je een nieuw account aanmaken met een ander e-mailadres.'
      },
      {
        question: 'Mijn gebruikersnaam is al in gebruik',
        answer: 'Elke gebruikersnaam moet uniek zijn. Kies een andere gebruikersnaam of voeg cijfers toe om je gewenste gebruikersnaam uniek te maken.'
      }
    ]
  },
  {
    key: 'payments',
    title: 'Betalingen',
    content: [
      {
        question: 'Welke betaalmethoden worden geaccepteerd?',
        answer: 'We accepteren verschillende betaalmethoden, waaronder creditcards (Visa, Mastercard) en andere veilige betaalopties. Alle betalingen worden verwerkt via beveiligde betaalproviders.'
      },
      {
        question: 'Mijn betaling is mislukt',
        answer: 'Controleer of je creditcardgegevens correct zijn ingevoerd en of er voldoende saldo beschikbaar is. Als het probleem aanhoudt, neem contact op met je bank of probeer een andere betaalmethode.'
      },
      {
        question: 'Wanneer wordt mijn betaling verwerkt?',
        answer: 'De meeste betalingen worden direct verwerkt. In sommige gevallen kan het tot 24 uur duren voordat je betaling wordt bevestigd. Je ontvangt een bevestiging per e-mail zodra je betaling is verwerkt.'
      },
      {
        question: 'Kan ik een terugbetaling krijgen?',
        answer: 'Terugbetalingen worden behandeld volgens ons terugbetalingsbeleid. Neem contact met ons op via het contactformulier en vermeld je transactienummer voor hulp bij terugbetalingen.'
      },
      {
        question: 'Is mijn betalingsinformatie veilig?',
        answer: 'Ja, alle betalingen worden verwerkt via gecertificeerde en beveiligde betaalproviders. We slaan geen creditcardgegevens op onze servers op.'
      }
    ]
  },
  {
    key: 'profile',
    title: 'Profielbeheer',
    content: [
      {
        question: 'Hoe bewerk ik mijn profiel?',
        answer: 'Log in op je account en ga naar "Mijn Profiel" of "Accountinstellingen". Klik op "Bewerken" om je profielgegevens, foto\'s en andere informatie bij te werken.'
      },
      {
        question: 'Hoe voeg ik foto\'s toe aan mijn profiel?',
        answer: 'Ga naar je profielinstellingen en selecteer "Foto\'s beheren". Klik op "Foto toevoegen" en upload je afbeeldingen. Zorg ervoor dat je foto\'s voldoen aan onze richtlijnen voor inhoud.'
      },
      {
        question: 'Hoe wijzig ik mijn wachtwoord?',
        answer: 'Ga naar je accountinstellingen en selecteer "Wachtwoord wijzigen". Voer je huidige wachtwoord in en kies een nieuw sterk wachtwoord. Zorg ervoor dat je nieuwe wachtwoord minimaal 8 tekens bevat.'
      },
      {
        question: 'Kan ik mijn profiel privé maken?',
        answer: 'Ja, je kunt privacy-instellingen aanpassen in je accountinstellingen. Je kunt kiezen welke informatie zichtbaar is voor andere gebruikers.'
      },
      {
        question: 'Hoe verwijder ik mijn account?',
        answer: 'Om je account te verwijderen, ga naar je accountinstellingen en selecteer "Account verwijderen". Let op: deze actie kan niet ongedaan worden gemaakt. Alle gegevens worden permanent verwijderd.'
      }
    ]
  }
];

class HulpEnOndersteuningPage extends PureComponent<IProps> {
  static authenticate = false;

  static noredirect = true;

  render() {
    const { ui } = this.props;

    return (
      <Layout>
        <SeoMetaHead item={{
          title: 'Hulp en Ondersteuning',
          description: 'Vind antwoorden op veelgestelde vragen over accountbeheer, betalingen, profielinstellingen en meer.'
        }}
        />
        <div className="main-container">
          <div className="help-page-container">
            <div className="page-heading">
              <span className="box">
                <QuestionCircleOutlined />
                {' '}
                Hulp en Ondersteuning
              </span>
            </div>
            <div className="help-intro">
              <p>
                Welkom bij onze help- en ondersteuningspagina. Hier vind je antwoorden op veelgestelde vragen
                over accountbeheer, betalingen, profielinstellingen en meer. Als je hier geen antwoord vindt,
                neem dan contact met ons op via het contactformulier.
              </p>
            </div>
            <div className="help-content">
              <Collapse
                defaultActiveKey={['account']}
                expandIconPosition="right"
                className="help-accordion"
              >
                {HELP_SECTIONS.map((section) => (
                  <Panel
                    header={<span className="panel-header">{section.title}</span>}
                    key={section.key}
                  >
                    <div className="help-questions">
                      {section.content.map((item, index) => (
                        <div key={index} className="help-item">
                          <h3 className="help-question">{item.question}</h3>
                          <p className="help-answer">{item.answer}</p>
                        </div>
                      ))}
                    </div>
                  </Panel>
                ))}
              </Collapse>
            </div>
            <div className="help-contact">
              <p>
                <strong>Nog steeds hulp nodig?</strong>
                {' '}
                Neem contact met ons op via het
                {' '}
                <a href="/contact">contactformulier</a>
                {' '}
                en we helpen je zo snel mogelijk verder.
              </p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
}

const mapStateToProps = (state: any) => ({
  ui: state.ui
});

export default connect(mapStateToProps)(HulpEnOndersteuningPage);

