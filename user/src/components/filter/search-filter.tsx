import { useState, useRef } from 'react';
import {
  Input, Row, Col, Select, Button, FormInstance, Form,
  message
} from 'antd';

import { connect } from 'react-redux';
import Router from 'next/router';
import './search-filter.less';
import { ICountry } from '@interfaces/utils';
import { utilsService } from '@services/utils.service';

interface IProps {
  attributes: any;
  countries: ICountry[];
  languages: Array<any>;
  // eslint-disable-next-line react/require-default-props
  customInputLabel?:string;
}

function SearchFilter({
  attributes = {},
  countries = [],
  languages = [],
  customInputLabel = 'Model name'
}: IProps) {
  const [searchVal, setSearchVal] = useState(process.browser ? Router.query : {} as any);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);

  const formRef = useRef<FormInstance>(null);
  const ages = [
    {
      key: '18_20',
      value: '18 - 20'
    },
    {
      key: '21_25',
      value: '21 - 25'
    },
    {
      key: '26_29',
      value: '26 - 29'
    },
    {
      key: '30_39',
      value: '30 - 39'
    },
    {
      key: '40 - 90',
      value: '40 - ...'
    }
  ];

  const onChange = (felid, val) => {
    setSearchVal({ ...searchVal, [felid]: val });
    // setSearchVal((prev) => ({ ...prev, ...val }));
  };

  const onSearch = () => {
    Router.push({
      pathname: '/search',
      query: {
        ...searchVal
      }
    });
  };

  const countryHandle = async (value) => {
    try {
      if (!value) {
        setSearchVal((prev) => ({
          ...prev, country: '', city: '', state: ''
        }));
        return;
      }
      setLoading(true);
      formRef.current && formRef.current.setFieldsValue({ city: null, state: null });
      const resp = await utilsService.statesProvincesList(value);
      setStates(resp.data?.states || []);
      setCities([]);
      setSearchVal((prev) => ({ ...prev, country: value }));
    } catch (error) {
      message.error('An error occurred, please try again!');
    } finally {
      setLoading(false);
    }
  };
  const stateHandle = async (value) => {
    try {
      setLoading(true);
      const resp = await utilsService.cityList(value);
      setCities(resp.data?.cities || []);
      setSearchVal((prev) => ({ ...prev, state: value }));
    } catch (error) {
      message.error('An error occurred, please try again!');
    } finally {
      setLoading(false);
    }
  };
  const cityHandle = (value) => {
    setSearchVal((prev) => ({ ...prev, city: value }));
  };
  return (
    <div className="filter-main">
      <Form
        ref={formRef}

      >
        <Row gutter={24}>
          <Col lg={6} xs={12}>
            <strong>Age</strong>
            <Select
              style={{ width: '100%' }}
              onChange={(val) => onChange('age', val)}
              value={searchVal.age || ''}
            >
              <Select value="">All</Select>
              {ages?.map((o) => (
                <Select.Option value={o.key} key={o.key}>
                  {o.value}
                </Select.Option>
              ))}
            </Select>
          </Col>
          <Col xs={12} md={12}>
            <Form.Item name="country" label="Country">
              <Select onChange={countryHandle} showSearch optionFilterProp="label">
                <Select.Option value="" key="all">
                  All
                </Select.Option>
                {(() => {
                  // Prioritize NL and BE for kinky.nl
                  const nl = countries.find(c => c.code === 'NL');
                  const be = countries.find(c => c.code === 'BE');
                  const others = countries.filter(c => c.code !== 'NL' && c.code !== 'BE');
                  const prioritized = [nl, be, ...others].filter(Boolean);
                  return prioritized.map((country) => (
                  <Select.Option key={country.code} label={country.name} value={country.name}>
                    <img src={country.flag} width="25px" alt="flag" />
                    {' '}
                    {country.name}
                  </Select.Option>
                  ));
                })()}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={12} md={12}>
            <Form.Item name="state" label="State/Province">
              <Select onChange={stateHandle} showSearch optionFilterProp="label">
                {
                  !loading && (
                    states.length !== 0 && (
                      states.map((state) => (
                        <Select.Option key={state.code} label={state.name} value={state.name}>
                          {state.name}
                        </Select.Option>
                      )))
                  )
                }
              </Select>
            </Form.Item>
          </Col>
          <Col xs={12} md={12}>
            <Form.Item name="city" label="City">
              <Select onChange={cityHandle} showSearch optionFilterProp="label">
                {
                  !loading && (
                    cities.map((city) => (
                      <Select.Option key={city.code} label={city.name} value={city.name}>
                        {city.name}
                      </Select.Option>
                    ))
                  )
                }
              </Select>
            </Form.Item>
          </Col>
          {/* <Col lg={6} xs={12}>
          <strong>Sexual Orientation</strong>
          <Select
            style={{ width: '100%' }}
            onChange={(val) => onChange('orientation', val)}
            value={searchVal.orientation || ''}
          >
            <Select value="">All</Select>
            {attributes?.orientations?.map((o) => (
              <Select.Option value={o.key} key={o.key}>
                {o.value}
              </Select.Option>
            ))}
          </Select>
        </Col> */}
          <Col lg={6} xs={12}>
            <strong>Meeting with</strong>
            <Select
              style={{ width: '100%' }}
              onChange={(val) => onChange('meetingWith', val)}
              value={searchVal.meetingWith || ''}
            >
              <Select value="">All</Select>
              {attributes?.meetingWith?.map((o) => (
                <Select.Option value={o.key} key={o.key}>
                  {o.value}
                </Select.Option>
              ))}
            </Select>
          </Col>
          <Col lg={6} xs={12}>
            <strong>Tattoo</strong>
            <Select
              style={{ width: '100%' }}
              onChange={(val) => onChange('tattoo', val)}
              value={searchVal.tattoo || ''}
            >
              <Select value="">All</Select>
              {attributes?.tattoos?.map((o) => (
                <Select.Option value={o.key} key={o.key}>
                  {o.value}
                </Select.Option>
              ))}
            </Select>
          </Col>

          <Col lg={6} xs={12}>
            <strong>Height</strong>
            <Select
              style={{ width: '100%' }}
              onChange={(val) => onChange('height', val)}
              value={searchVal.height || ''}
            >
              <Select value="">All</Select>
              {attributes?.heights?.map((o) => (
                <Select.Option value={o.key} key={o.key}>
                  {o.value}
                </Select.Option>
              ))}
            </Select>
          </Col>
          <Col lg={6} xs={12}>
            <strong>Weight</strong>
            <Select
              style={{ width: '100%' }}
              onChange={(val) => onChange('weight', val)}
              value={searchVal.weight || ''}
            >
              <Select.Option value="" key="all">
                All
              </Select.Option>
              {attributes?.weights?.map((o) => (
                <Select.Option value={o.key} key={o.key}>
                  {o.value}
                </Select.Option>
              ))}
            </Select>
          </Col>
          <Col lg={6} xs={12}>
            <strong>Language</strong>
            <Select
              style={{ width: '100%' }}
              onChange={(val) => onChange('languages', val)}
              value={searchVal.languages || ''}
            >
              <Select.Option value="" key="all">
                All
              </Select.Option>
              {languages?.map((o) => (
                <Select.Option value={o.name} key={o.code}>
                  {o.name}
                </Select.Option>
              ))}
            </Select>
          </Col>
          <Col lg={6} xs={12}>
            <strong>Ethnicity</strong>
            <Select
              style={{ width: '100%' }}
              onChange={(val) => onChange('ethnicity', val)}
              value={searchVal.ethnicity || ''}
            >
              <Select value="">All</Select>
              {attributes?.ethnicities?.map((o) => (
                <Select.Option value={o.key} key={o.key}>
                  {o.value}
                </Select.Option>
              ))}
            </Select>
          </Col>
          <Col lg={6} xs={12}>
            <strong>Hair color</strong>
            <Select
              style={{ width: '100%' }}
              onChange={(val) => onChange('hairColor', val)}
              value={searchVal.hairColor || ''}
            >
              <Select value="">All</Select>
              {attributes?.hairColors?.map((o) => (
                <Select.Option value={o.key} key={o.key}>
                  {o.value}
                </Select.Option>
              ))}
            </Select>
          </Col>
          <Col lg={6} xs={12}>
            <strong>Services offered</strong>
            <Select
              style={{ width: '100%' }}
              onChange={(val) => onChange('service', val)}
              value={searchVal.service || ''}
            >
              <Select value="">All</Select>
              {attributes?.services?.map((o) => (
                <Select.Option value={o.key} key={o.key}>
                  {o.value}
                </Select.Option>
              ))}
            </Select>
          </Col>

          <Col lg={6} xs={12}>
            <strong>{customInputLabel}</strong>
            <Input.Search
              name="q"
              allowClear
              enterButton
              placeholder="Enter model name"
              onPressEnter={() => onSearch()}
              onSearch={() => onSearch()}
              onChange={(e) => onChange('q', e.target.value)}
              value={searchVal.q || ''}
            />
          </Col>
          <Col span={6}>
            <div />
          </Col>
          <Col span={6} className="custom-col">
            <Button onClick={() => onSearch()} className="custom-btn">
              Search
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
}

const mapStates = (state: any) => ({
  attributes: state.settings.attributes,
  countries: state.settings.countries,
  languages: state.settings.languages
});

export default connect(mapStates)(SearchFilter);
