import Head from 'next/head';
import { PureComponent } from 'react';
import { message, Checkbox, Table } from 'antd';
import Page from '@components/common/layout/page';
import { utilsService, blockCountryService } from '@services/index';
import { BreadcrumbComponent } from '@components/common';

interface IProps {
}

class BlockCountries extends PureComponent<IProps> {
  static async getInitialProps({ ctx }) {
    return ctx.query;
  }

  state = {
    submitting: false,
    searching: false,
    countries: [] as any,
    blockCountries: [] as any
  };

  async componentDidMount() {
    this.searchCountry();
  }

  async handleChange(code, e) {
    if (e.target && e.target.checked) {
      try {
        await this.setState({ submitting: true });
        blockCountryService.create(code);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
        message.error('error');
      } finally {
        this.setState({ submitting: false });
      }
    }
    if (e.target && !e.target.checked) {
      try {
        await this.setState({ submitting: true });
        blockCountryService.delete(code);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
        message.error('error');
      } finally {
        await this.setState({ submitting: false });
      }
    }
  }

  async searchCountry() {
    try {
      await this.setState({ searching: true });
      const countries = await (await utilsService.countriesList()).data;
      const blockCountries = await (await blockCountryService.search()).data;
      await this.setState({
        searching: false,
        countries,
        blockCountries
      });
    } catch (e) {
      message.error('An error occurred, please try again!');
      await this.setState({ searching: false });
    }
  }

  render() {
    const {
      countries, searching, blockCountries, submitting
    } = this.state;
    const columns = [
      {
        title: 'Country Name',
        dataIndex: 'name',
        key: 'name'
      },
      {
        title: 'Country Code',
        dataIndex: 'code',
        key: 'code'
      },
      {
        title: 'Flag',
        dataIndex: 'flag',
        key: 'flag',
        render: (flag) => <img alt="" src={flag} width="50px" />
      },
      {
        title: '#',
        dataIndex: 'code',
        key: 'check',
        render: (code) => (
          <Checkbox
            disabled={submitting}
            defaultChecked={!!(blockCountries.length > 0 && blockCountries.find((c) => c.countryCode === code))}
            onChange={this.handleChange.bind(this, code)}
          />
        )
      }
    ];
    return (
      <>
        <Head>
          <title>Block Countries</title>
        </Head>
        <BreadcrumbComponent breadcrumbs={[{ title: 'Block Countries' }]} />
        <Page>
          <div style={{ marginBottom: '20px' }}>
            <div className="">
              {countries && countries.length > 0 && !searching && (
              <Table
                pagination={false}
                dataSource={countries.map((c, index) => {
                  const d = c;
                  d.key = index;
                  return d;
                })}
                columns={columns}
              />
              )}
            </div>
          </div>
        </Page>
      </>
    );
  }
}

export default BlockCountries;
