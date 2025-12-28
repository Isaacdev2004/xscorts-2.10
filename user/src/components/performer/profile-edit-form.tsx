import { useRef, useState, useEffect } from 'react';
import {
  Form,
  Input,
  Button,
  Select,
  Row,
  Col,
  DatePicker,
  message
} from 'antd';
import {
  IPerformer,
  IPhoneCodes,
  ILanguage,
  ICountry,
  IAttribute,
  ICategories
} from 'src/interfaces';
import moment from 'moment';
import './performer-edit-form.less';
import { utilsService } from '@services/utils.service';

const { Option } = Select;

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 }
};

const { TextArea } = Input;

interface IProps {
  // eslint-disable-next-line react/require-default-props
  performer?: IPerformer;
  loading: boolean;
  submitting: boolean;
  phoneCodes: IPhoneCodes[];
  countries: ICountry[];
  languages: ILanguage[];

  genders: any[];
  heights: any[];
  weights: any[];
  eyes: IAttribute[];
  hairColors: IAttribute[];
  hairLengths: IAttribute[];
  bustSizes: IAttribute[];
  bustTypes: IAttribute[];
  travels: IAttribute[];
  ethnicities: IAttribute[];
  orientations: IAttribute[];
  provides: IAttribute[];
  meetingWith: IAttribute[];
  services: IAttribute[];
  smokers: IAttribute[];
  tattoos: IAttribute[];
  categories: ICategories[];
  onFinish: Function;
  currencies: IAttribute[];
}

export function ModelProfileEditForm({
  submitting = false,
  performer = null,
  phoneCodes = [],
  countries = [],
  languages = [],
  genders = [],
  heights = [],
  weights = [],
  eyes = [],
  hairColors = [],
  hairLengths = [],
  bustSizes = [],
  bustTypes = [],
  travels = [],
  ethnicities = [],
  orientations = [],
  provides = [],
  meetingWith = [],
  services = [],
  smokers = [],
  tattoos = [],
  categories = [],
  currencies = [],
  onFinish
}: IProps) {
  const [dob, setDOB] = useState(
    moment().subtract(18, 'year').endOf('day') as any
  );
  const [phoneCode, setPhoneCode] = useState('+1');
  const [loading, setLoading] = useState(false);
  const formRef = useRef(null);
  const dobRef = useRef(null);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const countryHandle = async (value) => {
    try {
      setLoading(true);
      formRef.current.setFieldsValue({ city: null, state: null });
      const resp = await utilsService.statesProvincesList(value);
      setStates(resp.data?.states || []);
      setCities([]);
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
      setCities(resp.data.cities ? resp.data.cities : useState([]));
    } catch (error) {
      message.error('An error occurred, please try again!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (performer) {
      const data = { ...performer } as any;
      data.dateOfBirth = moment(performer.dateOfBirth);
      formRef?.current.setFieldsValue(data);
      setDOB(moment(data.dateOfBirth));
    }
  }, [performer]);

  useEffect(() => {
    const preloadStates = async (c) => {
      const resp = await utilsService.statesProvincesList(c);
      setStates(resp.data?.states || []);
    };

    const preloadCities = async (s) => {
      const resp = await utilsService.cityList(s);
      setCities(resp.data?.cities || []);
    };

    if (performer.country) {
      preloadStates(performer.country);
    }

    if (performer.state) {
      preloadCities(performer.state);
    }
  }, []);

  return (
    <Form
      ref={formRef}
      {...layout}
      name="edit-form"
      onFinish={(payload) => {
        const values = { ...payload };
        values.phoneCode = phoneCode;
        values.dateOfBirth = dob;
        if (!values.aboutMe || !values.aboutMe.trim()) {
          return message.error('Please enter information about yourself');
        }

        return onFinish(values);
      }}
      initialValues={
        performer || {
          country: 'United States of America',
          gender: 'male',
          phoneCode: 'US_+1',
          languages: ['English']
        }
      }
    >
      <div className="form-container">
        <Row>
          <Col span={24}>
            <h5 className="info-title">Basic info</h5>
          </Col>
          <Col lg={8} md={12} sm={24} xs={24}>
            <Form.Item name="name" label="Display name">
              <Input placeholder="Lara" />
            </Form.Item>
          </Col>
          <Col lg={8} md={12} sm={24} xs={24}>
            <Form.Item
              name="categoryIds"
              label="Category"
              rules={[
                {
                  required: true,
                  message: 'Please select your category'
                }
              ]}
            >
              <Select showSearch mode="multiple">
                {categories
                  && categories.map((category) => (
                    <Option key={category._id} value={category._id}>
                      {category.name}
                    </Option>
                  ))}
              </Select>
            </Form.Item>
          </Col>
          <Col lg={8} md={24} sm={24} xs={24}>
            <Form.Item
              hidden
              name="introVideoLink"
              label="Video link"
              rules={[{ type: 'url', message: 'Please input valid URL' }]}
            >
              <Input placeholder="Intro Video Link" />
            </Form.Item>
          </Col>
          <Col lg={24} md={24} sm={24} xs={24}>
            <Form.Item name="aboutMe" label="AboutMe">
              <TextArea
                rows={3}
                minLength={1}
                maxLength={2000}
                placeholder="Maximum length is 2000 characters"
              />
            </Form.Item>
          </Col>
          <Col lg={12} md={12} sm={12} xs={12}>
            <Form.Item name="currency" label="Currency">
              <Select
                showSearch
                optionFilterProp="label"
                defaultValue="$"
                className="currency"
              >
                {currencies.map((currency) => (
                  <Select.Option
                    key={currency.key}
                    value={currency.value}
                    className="select-currency"
                  >
                    {currency.key}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </div>

      <div className="form-container">
        <Row>
          <Col span={24}>
            <h5 className="info-title">MY DETAILS</h5>
          </Col>
          <Col lg={12} md={12} sm={24} xs={24}>
            <Form.Item name="gender" label="Gender">
              <Select>
                {genders.map((e) => (
                  <Option key={e.key} value={e.key}>
                    {e.value}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col lg={12} md={12} sm={24} xs={24}>
            <Form.Item
              name="dateOfBirth"
              label="Date of Birth"
              validateTrigger={['onChange', 'onBlur']}
              rules={[
                {
                  required: true
                }
              ]}
              valuePropName="date"
            >
              <DatePicker
                ref={dobRef}
                placeholder="YYYY-MM-DD"
                onChange={(date) => setDOB(date as any)}
                disabledDate={(currentDate) => currentDate
                  && currentDate > moment().subtract(18, 'year').endOf('day')}
                value={dob}
                defaultPickerValue={
                  moment().subtract(18, 'year').endOf('day') as any
                }
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
          <Col lg={12} md={12} sm={24} xs={24}>
            <Form.Item name="eyes" label="Eye color">
              <Select showSearch>
                {eyes?.map((e) => (
                  <Option key={e.key} value={e.key}>
                    {e.value}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col lg={12} md={12} sm={24} xs={24}>
            <Form.Item name="hairColor" label="Hair color">
              <Select showSearch>
                {hairColors.map((hc) => (
                  <Option key={hc.key} value={hc.key}>
                    {hc.value}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col lg={12} md={12} sm={24} xs={24}>
            <Form.Item name="hairLength" label="Hair length">
              <Select showSearch>
                {hairLengths.map((hl) => (
                  <Option key={hl.key} value={hl.key}>
                    {hl.value}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col lg={12} md={12} sm={24} xs={24}>
            <Form.Item name="bustSize" label="Bust size">
              <Select showSearch>
                {bustSizes.map((bs) => (
                  <Option key={bs.key} value={bs.key}>
                    {bs.value}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col lg={12} md={12} sm={24} xs={24}>
            <Form.Item name="bustType" label="Bust type">
              <Select showSearch>
                {bustTypes?.map((bt) => (
                  <Option key={bt.key} value={bt.key}>
                    {bt.value}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col lg={12} md={12} sm={24} xs={24}>
            <Form.Item name="travels" label="Travel">
              <Select showSearch mode="multiple">
                {travels.map((travel) => (
                  <Option key={travel.key} value={travel.key}>
                    {travel.value}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col lg={12} md={12} sm={24} xs={24}>
            <Form.Item name="weight" label="Weight">
              <Select showSearch>
                {weights.map((w) => (
                  <Option key={w.key} value={w.key}>
                    {w.value}
                  </Option>
                ))}
                <Option key="" value="">
                  Unknown
                </Option>
              </Select>
            </Form.Item>
          </Col>
          <Col lg={12} md={12} sm={24} xs={24}>
            <Form.Item name="height" label="Height">
              <Select showSearch>
                {heights.map((h) => (
                  <Option key={h.key} value={h.key}>
                    {h.value}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col lg={12} md={12} sm={24} xs={24}>
            <Form.Item name="ethnicity" label="Ethnicity">
              <Select showSearch>
                {ethnicities.map((e) => (
                  <Option key={e.key} value={e.key}>
                    {e.value}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col lg={12} md={12} sm={24} xs={24}>
            <Form.Item name="orientation" label="Orientation">
              <Select showSearch>
                {orientations.map((o) => (
                  <Option key={o.key} value={o.key}>
                    {o.value}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col lg={12} md={12} sm={24} xs={24}>
            <Form.Item name="smoker" label="Smoker">
              <Select showSearch optionFilterProp="label">
                {smokers.map((smoker) => (
                  <Select.Option key={smoker.key} value={smoker.key}>
                    {smoker.value}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col lg={12} md={12} sm={24} xs={24}>
            <Form.Item name="tattoo" label="Tattoo">
              <Select showSearch optionFilterProp="label">
                {tattoos.map((tattoo) => (
                  <Select.Option key={tattoo.key} value={tattoo.key}>
                    {tattoo.value}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col lg={12} md={12} sm={24} xs={24}>
            <Form.Item name="country" label="Nationality">
              <Select
                showSearch
                optionFilterProp="label"
                onChange={(value) => {
                  countryHandle(value);
                }}
              >
                {countries.map((country) => (
                  <Select.Option
                    key={country.code}
                    label={country.name}
                    value={country.name}
                  >
                    <img src={country.flag} width="25px" alt="flag" />
                    {' '}
                    {country.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col lg={12} md={12} sm={24} xs={24}>
            <Form.Item name="state" label="State">
              <Select
                showSearch
                optionFilterProp="label"
                onChange={(value) => stateHandle(value)}
                loading={loading}
              >
                {states.map((state) => (
                  <Select.Option
                    key={state.code}
                    label={state.name}
                    value={state.name}
                  >
                    {state.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col lg={12} md={12} sm={24} xs={24}>
            <Form.Item name="city" label="City">
              <Select showSearch optionFilterProp="label" loading={loading}>
                {cities.map((city) => (
                  <Select.Option
                    key={city.code}
                    label={city.name}
                    value={city.name}
                  >
                    {city.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col lg={12} md={12} sm={24} xs={24}>
            <Form.Item name="languages" label="Languages">
              <Select mode="multiple">
                {languages.map((l) => (
                  <Select.Option key={l.code} value={l.name}>
                    {l.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col lg={12} md={12} sm={24} xs={24}>
            <Form.Item name="services" label="Services">
              <Select showSearch mode="multiple">
                {services?.map((s) => (
                  <Option key={s.key} value={s.key}>
                    {s.value}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col lg={12} md={12} sm={24} xs={24}>
            <Form.Item name="provides" label="Provides">
              <Select showSearch mode="multiple">
                {provides.map((p) => (
                  <Option key={p.key} value={p.key}>
                    {p.value}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col lg={12} md={12} sm={24} xs={24}>
            <Form.Item name="meetingWith" label="Meeting with">
              <Select showSearch mode="multiple">
                {meetingWith.map((m) => (
                  <Option key={m.key} value={m.key}>
                    {m.value}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </div>

      <div className="form-container">
        <Row>
          <Col span={24}>
            <h5 className="info-title">Contact</h5>
          </Col>
          <Col lg={12} md={12} sm={24} xs={24}>
            <Form.Item
              name="phone"
              label="Phone Number"
              rules={[{ required: true }]}
            >
              <Input
                placeholder="9-12 digits phone number"
                addonBefore={(
                  <Select
                    style={{ width: 120 }}
                    defaultValue={performer?.phoneCode || 'US_+1'}
                    optionFilterProp="label"
                    showSearch
                    onChange={(val) => setPhoneCode(val)}
                  >
                    {phoneCodes?.map((p) => (
                      <Select.Option
                        key={`${p.countryCode}_${p.code}`}
                        value={`${p.countryCode}_${p.code}`}
                        label={`${p.code} ${p.name}`}
                      >
                        {`${p.code} ${p.name}`}
                      </Select.Option>
                    ))}
                  </Select>
                )}
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
          <Col lg={12} md={12} sm={24} xs={24}>
            <Form.Item name="phonePrivacy" label="Visibility">
              <Select showSearch>
                <Option key="public" value="public">
                  Public
                </Option>
                <Option key="private" value="private">
                  Private
                </Option>
              </Select>
            </Form.Item>
          </Col>
          <Col lg={12} md={12} sm={24} xs={24}>
            <Form.Item name="country" label="Country">
              <Select showSearch optionFilterProp="label">
                {(() => {
                  // Prioritize NL and BE for kinky.nl
                  const nl = countries.find(c => c.code === 'NL');
                  const be = countries.find(c => c.code === 'BE');
                  const others = countries.filter(c => c.code !== 'NL' && c.code !== 'BE');
                  const prioritized = [nl, be, ...others].filter(Boolean);
                  return prioritized.map((country) => (
                  <Select.Option
                    key={country.code}
                    label={country.name}
                    value={country.code}
                  >
                    <img src={country.flag} width="25px" alt="flag" />
                    {' '}
                    {country.name}
                  </Select.Option>
                  ));
                })()}
              </Select>
            </Form.Item>
          </Col>
          <Col lg={12} md={12} sm={24} xs={24}>
            <Form.Item name="city" label="City">
              <Select showSearch optionFilterProp="label" loading={loading}>
                {cities.map((city) => (
                  <Select.Option
                    key={city.code}
                    label={city.name}
                    value={city.name}
                  >
                    {city.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </div>
      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          loading={submitting}
          className="btn-submit"
        >
          Save now
        </Button>
      </Form.Item>
    </Form>
  );
}
