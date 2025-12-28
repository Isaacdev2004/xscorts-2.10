import { PureComponent } from 'react';
import {
  Layout, message, Tabs, Row, Col,
  Spin
} from 'antd';
import { connect } from 'react-redux';
import {
  IPerformer, ICountry, ILanguage
} from 'src/interfaces/';
import './edit-profile.less';
import { authService, performerService } from '@services/index';
import { ModelProfileEditForm } from '@components/performer';
import ProfileImagesUploads from '@components/performer/profile-image-update';
import PerformeServicesFormEdit from '@components/performer/performer-service-form-edit';
import Router from 'next/router';
import { UpdatePaswordForm } from '@components/user/update-password-form';
import { updatePassword } from 'src/redux/user/actions';
import { getResponseError } from '@lib/utils';
import { logout } from '@redux/auth/actions';
import { SocketContext } from 'src/socket';
import PerformerDeleteRequest from '@components/performer/performer-delete-request';
import SeoMetaHead from '@components/common/seo-meta-head';

const { TabPane } = Tabs;

interface IProps {
  id: string;
  countries?: ICountry[];
  languages?: ILanguage[];
  phoneCodes: any[];
  attributes: any;
  updatePassword: Function;
  logout:Function;
  updateSuccess: boolean;
  error: any;
}

interface IState {
  performer: IPerformer;
  submitting: boolean;
  loading: boolean;
  categories: any[];
  pwUpdating: boolean;
  ready: boolean;
}

class editPerformersProfile extends PureComponent<IProps, IState> {
  static authenticate: boolean = true;

  static noredirect: boolean = true;

  state = {
    performer: {} as any,
    submitting: false,
    loading: false,
    pwUpdating: false,
    categories: [],
    limit: 500,
    offset: 0,
    ready: false
  };

  componentDidMount() {
    this.getInitialData();
  }

  componentDidUpdate(preProps: IProps) {
    const { error, updateSuccess } = this.props;
    if (error !== preProps.error) {
      message.error(getResponseError(error));
    }
    if (updateSuccess && updateSuccess !== preProps.updateSuccess) {
      message.success('Changes saved.');
    }
  }

  getInitialData = async () => {
    const { limit, offset } = this.state;
    try {
      await this.setState({ loading: true });
      const resp = await performerService.me();
      await this.setState({ performer: resp.data });
      if (resp.data.status === 'waiting-for-review') {
        message.info('Your account is under for review, once done your profile will be shown for user end.', 10);
      }

      const categoryResp = await performerService.categoriesList({
        limit,
        offset: offset * limit
      });
      await this.setState({ categories: categoryResp.data.data, ready: true });
    } catch {
      message.error('Error occurred, please try again later');
    } finally {
      this.setState({ loading: false });
    }
  }

  updateProfile = async (values: any) => {
    try {
      await this.setState({ loading: true });
      await performerService.updateProfile(values);
      message.success('Updated successfully');
      Router.reload();
    } catch (e) {
      const error = await e;
      message.error(error?.message || 'An error occurred, please try again!');
    } finally {
      this.setState({ loading: false });
    }
  }

  updateCurrency = async (values: any) => {
    try {
      await this.setState({ loading: true });
      await performerService.updateProfile(values);
      message.success('Currency updated');
    } catch (e) {
      const error = await e;
      message.error(error?.message || 'Currency update error, please try again!');
    } finally {
      this.setState({ loading: false });
    }
  }

  updatePassword(data: any) {
    const { updatePassword: handleUpdatePassword } = this.props;
    handleUpdatePassword(data.password);
  }

  async handleDeleteAccount(password) {
    const { logout: logoutHandler } = this.props;
    try {
      const res = await performerService.deleteModel(password);
      if (res) {
        const token = authService.getToken();
        const socket = this.context;
        token && socket && (await socket.emit('auth/logout', { token }));
        socket && socket.close();
        logoutHandler();
      }
    } catch (e) {
      const error = await e;
      message.error(error.message || 'Something went wrong! Please try again');
    }
  }

  render() {
    const {
      phoneCodes, countries, languages, attributes
    } = this.props;
    const {
      performer,
      submitting,
      loading,
      categories,
      pwUpdating,
      ready
    } = this.state;
    const {
      genders,
      heights,
      weights,
      eyes,
      hairColors,
      hairLengths,
      bustSizes,
      bustTypes,
      travels,
      ethnicities,
      orientations,
      provides,
      meetingWith,
      services,
      smokers,
      tattoos,
      currencies
    } = attributes;

    return (
      <Layout className="model-edit-profile-layout">
        <SeoMetaHead item={{ title: 'Edit Profile' }} />
        <Row gutter={24}>
          <Col className="gutter-row" span={24}>
            <Tabs
              defaultActiveKey="general"
            // onTabClick={(activeKey) => {
            //   if (activeKey === 'deleteAccount') this.handleDeleteAccount();
            // }}

            >
              <TabPane tab="General Info" key="general">
                {!ready ? <Spin />
                  : (
                    <ModelProfileEditForm
                      onFinish={this.updateProfile}
                      performer={performer}
                      countries={countries}
                      languages={languages}
                      heights={heights}
                      weights={weights}
                      phoneCodes={phoneCodes}
                      services={services}
                      eyes={eyes}
                      hairColors={hairColors}
                      hairLengths={hairLengths}
                      bustSizes={bustSizes}
                      bustTypes={bustTypes}
                      travels={travels}
                      ethnicities={ethnicities}
                      orientations={orientations}
                      provides={provides}
                      meetingWith={meetingWith}
                      genders={genders}
                      smokers={smokers}
                      tattoos={tattoos}
                      loading={loading}
                      submitting={submitting}
                      categories={categories}
                      currencies={currencies}
                    />
                  )}
              </TabPane>
              <TabPane tab="Profile Images" key="images">
                {!ready ? <Spin /> : <ProfileImagesUploads />}
              </TabPane>
              <TabPane tab="Services and Rate" key="services">
                {!ready ? <Spin /> : <PerformeServicesFormEdit performerId={performer?._id} currency={performer.currency} />}
              </TabPane>
              <Tabs.TabPane tab="Change password" key="password">
                {!ready ? <Spin /> : (
                  <UpdatePaswordForm
                    onFinish={this.updatePassword.bind(this)}
                    updating={pwUpdating}
                  />
                )}
              </Tabs.TabPane>
              <Tabs.TabPane tab="Delete Account" key="deleteAccount">
                <PerformerDeleteRequest onFinish={this.handleDeleteAccount.bind(this)} />
              </Tabs.TabPane>
            </Tabs>
          </Col>
        </Row>
      </Layout>
    );
  }
}

const mapStates = (state: any) => ({
  attributes: state.settings.attributes,
  phoneCodes: state.settings.phoneCodes,
  countries: state.settings.countries,
  languages: state.settings.languages,
  updateSuccess: state.user.updateSuccess
});
editPerformersProfile.contextType = SocketContext;
const mapDispatch = { updatePassword, logout };
export default connect(mapStates, mapDispatch)(editPerformersProfile);
