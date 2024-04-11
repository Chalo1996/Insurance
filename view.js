//block

/**
 * @author Emmanuel Chalo <emmanuel.chalo@equitybank.co.ke>
 * @created 2012-04-08
 * @summary This custom view is for generating a customer quotation for the group credit.
 * @category view
 * @env equity
 * @origin -
 * @copyright -
 */

(props) => {
  const {
    Tabs,
    Form,
    Input,
    Row,
    Col,
    Select,
    DatePicker,
    Space,
    Switch,
    Button,
    Typography,
    Notification,
  } = A;

  const { TabPane } = Tabs;
  const { Item } = Form;
  const { Option } = Select;
  const { Title, Text } = Typography;

  const Suspense = React.Suspense;
  const useState = React.useState;
  const useEffect = React.useEffect;

  const [isQuotationTabEnable, setIsQuotationTabEnable] = React.useState(false);
  const [isDefaultButton, setIsDefaultButton] = React.useState('details');
  const [dataSource, setDataSource] = React.useState([]);
  const [userQuotationData, setUserQuotationData] = React.useState([]);

  console.log('User Info', dataSource);

  useEffect(() => {
    console.log('Quotation Details', dataSource);
  }, [dataSource]);

  const TabIcon = () => (
    <span role="img" aria-label="result" className="anticon anticon-result">
      <svg
        viewBox="0 0 1012 1012"
        focusable="false"
        data-icon="result"
        width="1em"
        height="1em"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M896 64H128v768h768V64z m-64 64v640H192V128h640z m-256 832H320V832h256v128z m0-256H320V576h256v256z m0-320H320V256h256v320z m-512 320H64V512h256v320z m0-384H64V128h256v256z m640 640H320V704h640v640z m0-768H320V128h640v640z"></path>
      </svg>
    </span>
  );

  const countryCodes = {
    Kenya: '+254',
    Uganda: '+256',
    Tanzania: '+255',
    Rwanda: '+250',
    Congo: '+123',
    'South Sudan': '+211',
  };

  const coverTypes = {
    Single: 'Single Individuals & Sole Proprietorships',
    Multiple: 'Multiple Individuals & Partnerships',
  };

  const PremiumFrequency = {
    annual: 'Annual',
    single: 'Single',
  };

  const ClientDetails = () => {
    const [name, setName] = useState('');
    const [country, setCountry] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [coverType, setCoverType] = useState('');
    const [dob, setDoB] = useState(null);
    const [sum, setSum] = useState(10000);
    const [code, setCode] = useState('');
    const [termsInMonths, setTermsInMonths] = useState(1);
    const [frequency, setFrequency] = useState('Annual');
    const [installments, setInstallments] = useState(1);
    const [retrenchment, setRetrenchment] = useState(false);
    const [sumDisabled, setSumDisabled] = useState(false);
    const [termsDisabled, setTermsDisabled] = useState(false);
    const [installmentsDisabled, setInstallmentsDisabled] = useState(false);
    const [quoteSubmitted, setQuoteSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleNameChange = (e) => setName(e.target.value);
    const handleCountryChange = (value) => {
      const selectedCode = countryCodes[value];
      console.log('Selected Country', value);
      console.log('Code', selectedCode);
      setCountry(value);
      setCode(selectedCode);
    };
    const handlePhoneChange = (e) => setPhone(e.target.value);

    const validatePhone = (_, value) => {
      const cleanedPhoneNumber = value.replace(/[ -()]/g, '');
      const phoneRegex = /^\d{9}$/;
      if (value && !phoneRegex.test(cleanedPhoneNumber)) {
        return Promise.reject('Please enter a valid phone number');
      }
      return Promise.resolve();
    };

    const handleEmailChange = (e) => setEmail(e.target.value);
    const handleCoverTypeChange = (e) => setCoverType(e);
    const handleDoBChange = (date, dateString) => {
      setDoB(dateString);
    };
    const handleSumChange = (e) => {
      const newValue = e.target.value;
      setSum(newValue);
      setSumDisabled(isNaN(parseFloat(newValue)));
    };
    const handleTermsInMonths = (e) => {
      const newValue = e.target.value;
      setTermsInMonths(newValue);
      setTermsDisabled(isNaN(parseFloat(newValue)));
    };
    const handlePremiumInstallments = (e) => {
      const newValue = e.target.value;
      setInstallments(newValue);
      setInstallmentsDisabled(isNaN(parseFloat(newValue)));
    };
    const handleFrequencyChange = (e) => {
      console.log(e);
      setFrequency(e);
    };
    const handleRetrenchmentChange = (checked) => setRetrenchment(checked);

    const onFinish = (values) => {
      console.log('Received values:', values);
      setIsQuotationTabEnable(true);
    };

    return (
      <Form layout="vertical" onFinish={onFinish}>
        <Row gutter={32}>
          <Col span={12}>
            <Text strong>User Details</Text>
            <Item
              label="Name"
              name="username"
              rules={[{ required: true, message: 'Please input your name!' }]}
            >
              <Input
                placeholder="Enter Name"
                value={name}
                onChange={handleNameChange}
              />
            </Item>
            <Item
              label="Country"
              name="country"
              rules={[
                { required: true, message: 'Please select your country!' },
              ]}
            >
              <Select
                placeholder="Select Country"
                onChange={handleCountryChange}
              >
                {Object.keys(countryCodes).map((country) => (
                  <Option key={country} value={country}>
                    {country}
                  </Option>
                ))}
              </Select>
            </Item>
            <Item
              label="Phone No"
              name="phone"
              rules={[
                { required: true, message: 'Please input your phone number!' },
                { validator: validatePhone },
              ]}
            >
              <Input
                addonBefore={code}
                placeholder="700000000"
                value={phone}
                onChange={handlePhoneChange}
              />
            </Item>
            <Item
              label="Date Of Birth"
              name="dob"
              rules={[
                { required: true, message: 'Please input your date of birth!' },
              ]}
            >
              <DatePicker
                format="DD/MM/YYYY"
                placeholder="Select Date of Birth"
                onChange={handleDoBChange}
              />
            </Item>
            <Item
              label="Email"
              name="email"
              rules={[
                {
                  type: 'email',
                  required: true,
                  message: 'Please input your email!',
                },
              ]}
            >
              <Input
                placeholder="Enter Email"
                value={email}
                onChange={handleEmailChange}
              />
            </Item>
          </Col>

          <Col span={12}>
            <Text strong>Product Details</Text>
            <Item
              label="Cover Type"
              name="coverType"
              rules={[{ required: true, message: 'Please select cover type!' }]}
            >
              <Select
                placeholder="Select Cover Type"
                onChange={handleCoverTypeChange}
              >
                {Object.values(coverTypes).map((type) => (
                  <Option key={type} value={type}>
                    {type}
                  </Option>
                ))}
              </Select>
            </Item>
            <Item
              label="Sum Assured"
              name="sumAssured"
              rules={[
                { required: true, message: 'Please input the sum assured!' },
              ]}
            >
              <Input
                placeholder="10000000"
                value={sum}
                onChange={handleSumChange}
                disabled={sumDisabled}
              />
            </Item>
            <Item
              label="Terms In Months"
              name="termsinmonths"
              rules={[
                { required: true, message: 'Please input terms in months!' },
              ]}
            >
              <Input
                placeholder="86"
                value={termsInMonths}
                onChange={handleTermsInMonths}
                disabled={termsDisabled}
              />
            </Item>
            <Item
              label="Number of Premium Installments"
              name="installments"
              rules={[
                {
                  required: true,
                  message: 'Please input number of premium installments!',
                },
              ]}
            >
              <Input
                placeholder="1"
                value={installments}
                onChange={handlePremiumInstallments}
                disabled={installmentsDisabled}
              />
            </Item>
            <Item
              label="Premium Frequency"
              name="frequency"
              rules={[
                { required: true, message: 'Please select premium frequency!' },
              ]}
            >
              <Select
                placeholder="Select frequency"
                onChange={handleFrequencyChange}
              >
                {Object.keys(PremiumFrequency).map((key) => (
                  <Option key={key} value={key}>
                    {PremiumFrequency[key]}
                  </Option>
                ))}
              </Select>
            </Item>
            <Item label="Retrenchment Cover?">
              <Switch
                defaultChecked={retrenchment}
                onChange={handleRetrenchmentChange}
              />
            </Item>
          </Col>
        </Row>
        <Row justify="end">
          <Item>
            <Button
              type="primary"
              htmlType="submit"
              disabled={quoteSubmitted}
              onClick={() => {
                setIsDefaultButton('quotation');
                const userInfo = {
                  Name: name,
                  Country: country,
                  Phone: `${code}${phone}`,
                  Email: email,
                  coverType: coverType,
                  userDateOfBirths: dob,
                  sumAssured: sum,
                  termsInMonths: termsInMonths,
                  frequency: frequency,
                  installments: installments,
                  individualRetrenchmentCover: retrenchment ? 'Yes' : 'No',
                };

                setDataSource([...dataSource, userInfo]);

                const contextObject = {
                  userInfo: {
                    sumAssured: userInfo.sumAssured,
                    termsInMonths: userInfo.termsInMonths,
                    individualRetrenchmentCover:
                      userInfo.individualRetrenchmentCover,
                    numberOfPartners: 2,
                    userDateOfBirths: new Array(userInfo.userDateOfBirths),
                    coverType: userInfo.coverType,
                    frequency: userInfo.frequency,
                    numOfPremiumInstallments: installments,
                  },
                  memberDetails: [],
                };

                exe('ExeChain', {
                  chain: 'M3TrainingGroupCreditFixedRating',
                  context: JSON.stringify(contextObject),
                }).then((response) => {
                  const { ok, msg, outData } = response;
                  if (!ok) {
                    Notification.error({ message: msg });
                  } else {
                    setDataSource((prevData) => [...prevData, ...outData]);
                  }
                });
              }}
            >
              Quote
            </Button>
          </Item>
        </Row>
      </Form>
    );
  };

  const Quotation = () => {
    const [loading, setLoading] = useState(true);
    const [qData, setQData] = useState(null);

    useEffect(() => {
      const fetchData = () => {
        try {
          new Promise((resolve) => setTimeout(resolve, 3000));

          const fetchedQData = dataSource[1];
          setQData(fetchedQData);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching quotation data:', error);
          setLoading(false);
        }
      };

      fetchData();
    }, []);

    if (!qData) {
      return <div>Loading....</div>;
    }

    return (
      <>
        <Row justify="end">
          <img
            src="https://th.bing.com/th/id/OIP.slQhzvN6Tzo0RxGP9AiQSgAAAA?rs=1&pid=ImgDetMain"
            alt="Company Logo"
            style={{
              maxWidth: '100px',
              maxHeight: '120px',
              marginTop: '20px',
            }}
          />
        </Row>

        <Title level={2}>Quotation Details</Title>

        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Text strong>Name:</Text> <Text>{dataSource[0].Name}</Text>
          </Col>
          <Col span={12}>
            <Text strong>Country:</Text> <Text>{dataSource[0].Country}</Text>
          </Col>
          <Col span={12}>
            <Text strong>Phone:</Text> <Text>{dataSource[0].Phone}</Text>
          </Col>
          <Col span={12}>
            <Text strong>Email:</Text> <Text>{dataSource[0].Email}</Text>
          </Col>
          <Col span={12}>
            <Text strong>Age:</Text> <Text>{qData.Age}</Text>
          </Col>
          <Col span={12}>
            <Text strong>Cover Type:</Text>{' '}
            <Text>{dataSource[0].coverType}</Text>
          </Col>
          <Col span={12}>
            <Text strong>Date of Birth:</Text>{' '}
            <Text>{dataSource[0].userDateOfBirths}</Text>
          </Col>
          <Col span={12}>
            <Text strong>Sum Assured:</Text>{' '}
            <Text>{dataSource[0].sumAssured}</Text>
          </Col>
          <Col span={12}>
            <Text strong>Terms in Months:</Text>{' '}
            <Text>{dataSource[0].termsInMonths}</Text>
          </Col>
          <Col span={12}>
            <Text strong>Terms in Years</Text> <Text>{qData.TermsInYears}</Text>
          </Col>
          <Col span={12}>
            <Text strong>Premium Frequency:</Text>{' '}
            <Text>{dataSource[0].frequency}</Text>
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Text strong>Annual Premium payable:</Text>{' '}
            <Text>{qData.AnnualPremiumsPayable}</Text>
          </Col>
          <Col span={12}>
            <Text strong>Number of premium instalments</Text>{' '}
            <Text>{qData.PremiumInstallements}</Text>
          </Col>
          <Col span={12}>
            <Text strong>Total Premiums payable</Text>{' '}
            <Text>{qData.GrossInsurancePremium}</Text>
          </Col>
        </Row>
      </>
    );
  };

  const MyTabs = () => {
    return (
      <Tabs defaultActiveKey={isDefaultButton}>
        <TabPane
          tab={
            <span>
              <TabIcon />
              Client Details
            </span>
          }
          key="userdetails"
        >
          <ClientDetails />
        </TabPane>
        <TabPane
          tab={
            <span>
              <TabIcon />
              Quotation
            </span>
          }
          key="quotation"
          disabled={!isQuotationTabEnable}
        >
          {<Quotation />}
        </TabPane>
      </Tabs>
    );
  };

  return (
    <DefaultPage
      title={t('Group Credit')}
      subTitle={t('')}
      icon="Heart"
      extra={<Space> </Space>}
    >
      <MyTabs />
    </DefaultPage>
  );
};
