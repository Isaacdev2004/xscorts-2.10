import {
  Layout, message, PageHeader, Row, Col
} from 'antd';
import Head from 'next/head';
import { PureComponent } from 'react';
import { BreadcrumbComponent } from '@components/common/breadcrumb';
import Page from '@components/common/layout/page';
import { bookingService, userService } from 'src/services';
import { getResponseError } from '@lib/utils';
import { formatDate } from 'src/lib/date';
import { capitalizeFirstLetter } from '@lib/string';

const { Content } = Layout;

interface IProps {
  id: string;
}

interface IStates {
  booking: any;
  loading: boolean;
  sourceInfo:any;
}

class DetailBooking extends PureComponent<IProps, IStates> {
  static authenticate = true;

  static onlyPerformer = true;

  static async getInitialProps({ ctx }) {
    return ctx.query;
  }

  constructor(props: IProps) {
    super(props);
    this.state = {
      booking: null,
      loading: false,
      sourceInfo: null
    };
  }

  componentDidMount() {
    this.getData();
  }

  async getData() {
    try {
      this.setState({ loading: true });
      const { id } = this.props;
      const resp = await bookingService.findById(id);
      const user = await userService.findById(resp.data.fromSourceId);
      this.setState({
        booking: resp.data,
        sourceInfo: user.data
      });
    } catch (e) {
      const err = await Promise.resolve(e);
      message.error(getResponseError(err));
    } finally {
      this.setState({ loading: false });
    }
  }

  render() {
    const { booking, loading, sourceInfo } = this.state;
    return (
      <Layout>
        <Head>
          <title>Booking details</title>
        </Head>
        <Content>
          <div className="main-container">
            <BreadcrumbComponent
              breadcrumbs={[
                { title: 'Booking details', href: '/bookings' },
                {
                  title: booking?._id || 'Booking details'
                }
              ]}
            />
            {booking && sourceInfo && !loading ? (
              <Page>
                <PageHeader title="Booking details" />
                <Row>
                  <Col xs={24} md={24}>
                    <div className="ant-table">
                      <table>
                        <tbody>
                          <tr>
                            <td>Booker:</td>
                            <td>{capitalizeFirstLetter(sourceInfo.username)}</td>
                          </tr>
                          <tr>
                            <td>Escort:</td>
                            <td>
                              {capitalizeFirstLetter(booking.targetInfo?.username
                                || booking.targetInfo?.name
                                || 'N/A')}
                            </td>
                          </tr>
                          <tr>
                            <td>Status:</td>
                            <td>
                              {capitalizeFirstLetter(booking?.status || 'N/A')}
                            </td>
                          </tr>
                          <tr>
                            <td>Message:</td>
                            <td>
                              <td style={{ whiteSpace: 'pre-line' }}>{booking.message}</td>
                            </td>
                          </tr>
                          <tr>
                            <td>Duration:</td>
                            <td>
                              {booking?.duration || 'N/A'}
                            </td>
                          </tr>
                          <tr>
                            <td>Start at:</td>
                            <td>{formatDate(booking.startAt)}</td>
                          </tr>
                          <tr>
                            <td>Created at:</td>
                            <td>{formatDate(booking.createdAt)}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </Col>
                </Row>
              </Page>
            ) : (
              <p>Booking not found.</p>
            )}
          </div>
        </Content>
      </Layout>
    );
  }
}

export default DetailBooking;
