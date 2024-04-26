//block

/**
 * @author Emmanuel Chalo <emmanuel.chalo@equitybank.co.ke>
 * @created 2012-04-08
 * @sumAssuredmary This custom view is for generating a customer quotation for the group credit.
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
    Table,
  } = A;

  const { TabPane } = Tabs;
  const { Item } = Form;
  const { Option } = Select;
  const { Title, Text } = Typography;

  const useState = React.useState;
  const useEffect = React.useEffect;

  const [isQuotationTabEnable, setIsQuotationTabEnable] = React.useState(true);
  const [isDefaultTab, setIsDefaultTab] = React.useState("userdetails");
  const [formData, setFormData] = React.useState(null);
  const [quotationData, setQuotationData] = React.useState(null);

  const TabIcon = () => (
    <span role='img' aria-label='result' className='anticon anticon-result'>
      <svg
        viewBox='0 0 1012 1012'
        focusable='false'
        data-icon='result'
        width='1em'
        height='1em'
        fill='currentColor'
        aria-hidden='true'
      >
        <path d='M896 64H128v768h768V64z m-64 64v640H192V128h640z m-256 832H320V832h256v128z m0-256H320V576h256v256z m0-320H320V256h256v320z m-512 320H64V512h256v320z m0-384H64V128h256v256z m640 640H320V704h640v640z m0-768H320V128h640v640z'></path>
      </svg>
    </span>
  );

  const countryCodes = {
    Kenya: "+254",
    Uganda: "+256",
    Tanzania: "+255",
    Rwanda: "+250",
    Congo: "+123",
    "South Sudan": "+211",
  };
  const ClientDetails = () => {
    const [userName, SetUserName] = useState("");
    const [country, setCountry] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [coverType, setCoverType] = useState("");
    const [dob, setDoB] = useState(null);
    const [sumAssured, setSumAssured] = useState(1000000);
    const [countryCode, setCountryCode] = useState("");
    const [termsInMonths, setTermsInMonths] = useState(1);
    const [numOfPartners, setNumOfPartners] = useState(0);
    const [partnerDates, setPartnerDates] = useState(
      Array(numOfPartners).fill(null)
    );
    const [frequency, setFrequency] = useState("Annual");
    const [installments, setInstallments] = useState(1);
    const [retrenchment, setRetrenchment] = useState(false);
    const [quoteSubmitted, setQuoteSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleNameChange = (e) => SetUserName(e.target.value);
    const handleCountryChange = (value) => {
      const selectedCode = countryCodes[value];
      console.log("Selected Country", value);
      console.log("Code", selectedCode);
      setCountry(value);
      setCountryCode(selectedCode);
    };
    const handlePhoneChange = (e) => setPhone(e.target.value);

    const validatePhone = (_, value) => {
      const cleanedPhoneNumber = value.replace(/[ -()]/g, "");
      const phoneRegex = /^\d{9}$/;
      if (value && !phoneRegex.test(cleanedPhoneNumber)) {
        return Promise.reject("Please enter a valid phone number");
      }
      return Promise.resolve();
    };
    const handleEmailChange = (e) => setEmail(e.target.value);
    const handleCoverTypeChange = (value) => setCoverType(value);
    const handleDoBChange = (date, dateString) => {
      setDoB(dateString);
    };

    const disableNotNumberKey = (event) => {
      if (!/[0-9]/.test(event.key)) {
        event.preventDefault();
      }
    };

    const formatValueWithCommas = (value) => {
      return value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    const handleSumChange = (e) => {
      setSumAssured(formatValueWithCommas(e.target.value));
    };

    const handleTermsInMonths = (e) => {
      const newValue = e.target.value;
      setTermsInMonths(newValue);
    };
    const handlePremiumInstallments = (e) => {
      const newValue = e.target.value;
      setInstallments(newValue);
    };

    const handleFrequencyChange = (e) => {
      console.log(e);
      setFrequency(e);
    };
    const handleRetrenchmentChange = (checked) => setRetrenchment(checked);

    const disabledDate = (current) => {
      if (!current) return false;

      const selectedDate = new Date(current);
      const today = new Date();
      const age = today.getFullYear() - selectedDate.getFullYear();

      return age < 18 || age > 65;
    };

    const handleNumOfPartnersChange = (value) => setNumOfPartners(value);
    const handlePartnerDoBChange = (index, date, dateString) => {
      const updatedDates = [...partnerDates];
      updatedDates[index] = dateString;
      setPartnerDates(updatedDates);
    };

    useEffect(() => {
      setPartnerDates(Array(numOfPartners).fill(null));
    }, [numOfPartners, coverType]);

    const onFinish = (values) => {
      console.log("Received values:", values);
    };

    const onFinishFailed = (errorInfo) => {
      Notification.error({ message: errorInfo });
    };

    const onFinished = () => {
      const userInfo = {
        Name: userName,
        Country: country,
        Phone: `${countryCode}${phone}`,
        Email: email,
        coverType: coverType,
        numberOfPartners: numOfPartners,
        userDateOfBirths: dob,
        sumAssured: sumAssured.replace(/,/g, ""),
        termsInMonths: termsInMonths,
        frequency: frequency,
        installments: installments,
        individualRetrenchmentCover: retrenchment ? "Yes" : "No",
      };

      setFormData(userInfo);

      const contextObject = {
        userInfo: {
          sumAssured: userInfo.sumAssured,
          termsInMonths: userInfo.termsInMonths,
          individualRetrenchmentCover: userInfo.individualRetrenchmentCover,
          numberOfPartners:
            userInfo.numberOfPartners > 0 ? userInfo.numberOfPartners : 1,
          userDateOfBirths:
            coverType !== "Multiple"
              ? new Array(userInfo.userDateOfBirths)
              : new Array(...partnerDates),
          coverType: userInfo.coverType,
          frequency: userInfo.frequency,
          numOfPremiumInstallments: installments,
        },
        memberDetails: [],
      };

      console.log("Context Object", contextObject);

      setLoading(true);

      exe("ExeChain", {
        chain: "M3TrainingGroupCreditFixedRating",
        context: JSON.stringify(contextObject),
      })
        .then((response) => {
          const { ok, msg, outData } = response;
          if (!ok) {
            Notification.error({ message: msg });
          } else {
            setQuotationData(outData);
            setIsDefaultTab("quotation");
            setIsQuotationTabEnable(false);
          }
        })
        .catch((error) => {
          Notification.error({
            message: "An error occurred while processing the quote.",
          });
        })
        .finally(() => {
          setLoading(false);
        });
    };

    return (
      <Form
        name='clientdetails'
        initialValues={{ remember: true }}
        layout='vertical'
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Row gutter={32}>
          <Col span={12}>
            <Text strong>User Details</Text>
            <Item
              label='Name'
              name='username'
              rules={[{ required: true, message: "Please input your name!" }]}
            >
              <Input
                placeholder='Enter Name'
                value={userName}
                onChange={handleNameChange}
              />
            </Item>
            <Item
              label='Country'
              name='country'
              rules={[
                { required: true, message: "Please select your country!" },
              ]}
            >
              <Select
                placeholder='Select Country'
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
              label='Phone No'
              name='phone'
              onKeyPress={disableNotNumberKey}
              rules={[
                { required: true, message: "Please input your phone number!" },
                { validator: validatePhone },
              ]}
            >
              <Input
                addonBefore={countryCode}
                placeholder='700000000'
                value={phone}
                onChange={handlePhoneChange}
              />
            </Item>
            <Item
              label='Date Of Birth'
              name='dob'
              rules={[
                { required: true, message: "Please input your date of birth!" },
              ]}
            >
              <DatePicker
                format='DD/MM/YYYY'
                placeholder='Select Date of Birth'
                onChange={handleDoBChange}
                disabledDate={disabledDate}
              />
            </Item>
            <Item
              label='Email'
              name='email'
              rules={[
                {
                  type: "email",
                  required: true,
                  message: "Please input your email!",
                },
              ]}
            >
              <Input
                placeholder='Enter Email'
                value={email}
                onChange={handleEmailChange}
              />
            </Item>
          </Col>

          <Col span={12}>
            <Text strong>Product Details</Text>
            <Item
              label='Cover Type'
              name='coverType'
              rules={[{ required: true, message: "Please select cover type!" }]}
            >
              <Space wrap>
                <Select
                  placeholder='Select Cover Type'
                  onChange={handleCoverTypeChange}
                  options={[
                    {
                      value: "Single",
                      label: "Single Individuals & Sole Proprietorships",
                    },
                    {
                      value: "Multiple",
                      label: "Multiple Individuals & Partnerships",
                    },
                  ]}
                ></Select>
              </Space>
            </Item>
            <Item
              label='Sum Assured'
              name='sumAssured'
              onKeyPress={disableNotNumberKey}
              rules={[
                {
                  required: true,
                  message: "Please input the sumAssured assured!",
                },
              ]}
            >
              <Input value={sumAssured} onChange={handleSumChange} />
            </Item>
            <Item
              label='Terms In Months'
              name='termsinmonths'
              onKeyPress={disableNotNumberKey}
              rules={[
                { required: true, message: "Please input terms in months!" },
              ]}
            >
              <Input value={termsInMonths} onChange={handleTermsInMonths} />
            </Item>
            <Item
              name='partners'
              rules={[
                {
                  required: true,
                  message: "Please select number of partners to insure!",
                },
              ]}
            >
              <Space wrap>
                <Select
                  defaultValue='0'
                  style={{
                    width: 120,
                  }}
                  onChange={handleNumOfPartnersChange}
                  disabled={coverType !== "Multiple"}
                  options={[
                    { value: "2", label: 2 },
                    { value: "3", label: 3 },
                    { value: "4", label: 4 },
                    { value: "5", label: 5 },
                    { value: "6", label: 6 },
                    { value: "7", label: 7 },
                  ]}
                />
              </Space>
            </Item>
            {coverType === "Multiple" ? (
              <div style={{ marginLeft: "10px" }}>
                <Text strong>Partners Details</Text>
                {Array.from({ length: numOfPartners }, (_, index) => (
                  <Item
                    key={`partner_${index}`}
                    label={`Partner ${index + 1} Date of Birth`}
                    name={`dob_partner_${index}`}
                  >
                    <DatePicker
                      format='DD/MM/YYYY'
                      placeholder={`Select Partner ${index + 1} Date of Birth`}
                      onChange={(date, dateString) =>
                        handlePartnerDoBChange(index, date, dateString)
                      }
                      disabledDate={disabledDate}
                    />
                  </Item>
                ))}
              </div>
            ) : null}

            <Item
              label='Number of Premium Installments'
              name='installments'
              onKeyPress={disableNotNumberKey}
              rules={[
                {
                  required: true,
                  message: "Please input number of premium installments!",
                },
              ]}
            >
              <Input
                value={installments}
                onChange={handlePremiumInstallments}
              />
            </Item>
            <Item
              label='Premium Frequency'
              name='frequency'
              rules={[
                { required: true, message: "Please select premium frequency!" },
              ]}
            >
              <Space wrap>
                <Select
                  defaultValue='Annual'
                  placeholder='Select frequency'
                  onChange={handleFrequencyChange}
                  options={[
                    { value: "Annual", label: "Annual" },
                    { value: "Single", label: "Single" },
                  ]}
                ></Select>
              </Space>
            </Item>
            {coverType === "Single" ? (
              <Item label='Retrenchment Cover?'>
                <Switch
                  defaultChecked={retrenchment}
                  onChange={handleRetrenchmentChange}
                />
              </Item>
            ) : null}
          </Col>
        </Row>
        <Row justify='end'>
          <Item>
            <Button
              type='primary'
              htmlType='submit'
              disabled={quoteSubmitted}
              onClick={onFinished}
            >
              {loading ? "loading" : "Quote"}
            </Button>
          </Item>
        </Row>
      </Form>
    );
  };

  const Quotation = () => {
    const columns = [
      {
        title: "Attribute",
        dataIndex: "attribute",
        key: "attribute",
        width: "30%",
        render: (text) => <Text strong>{text}</Text>,
      },
      {
        title: "Value",
        dataIndex: "value",
        key: "value",
        width: "70%",
      },
    ];

    const dataUserDetails = [
      { key: "name", attribute: "Name", value: formData.Name },
      { key: "country", attribute: "Country", value: formData.Country },
      { key: "phone", attribute: "Phone", value: formData.Phone },
      { key: "email", attribute: "Email", value: formData.Email },
      {
        key: "dob",
        attribute: "Date of Birth",
        value: formData.userDateOfBirths,
      },
      { key: "age", attribute: "Age", value: quotationData.Age },
    ];

    const dataPolicyDetails = [
      {
        key: "coverType",
        attribute: "Type of Cover",
        value: formData.coverType,
      },
      {
        key: "termsInMonths",
        attribute: "Terms in Months",
        value: formData.termsInMonths,
      },
      {
        key: "termsInYears",
        attribute: "Terms in Years",
        value: quotationData.TermsInYears,
      },
      {
        key: "sumAssured",
        attribute: "Initial Sum Assured",
        value: formData.sumAssured,
      },
      {
        key: "frequency",
        attribute: "Premium Frequency",
        value: formData.frequency,
      },
    ];

    console.log("Retrenchment", formData.individualRetrenchmentCover);

    const dataSelectedOptionalBenefitsDetails = [
      {
        key: "retrenchment",
        attribute: "Retrenchment Cover/Job Loss",
        value:
          formData.coverType !== "Multiple"
            ? formData.individualRetrenchmentCover === "Yes"
              ? "Yes"
              : "No"
            : "Not Applicable for Multiple Individuals & Partnerships",
      },
    ];

    const dataPremiumDetails = [
      {
        key: "annualPremium",
        attribute: "Annual Premiums payable",
        value: quotationData.AnnualPremiumsPayable,
      },
      {
        key: "premiumInstallments",
        attribute: "Number of Premium Installments",
        value: quotationData.PremiumInstallements,
      },
      {
        key: "totalPremium",
        attribute: "Total Premiums payable",
        value: quotationData.GrossInsurancePremium,
      },
    ];

    return (
      <div style={{ maxWidth: "800px", margin: "auto" }}>
        <Row justify='end'>
          <img
            src='https://th.bing.com/th/id/OIP.slQhzvN6Tzo0RxGP9AiQSgAAAA?rs=1&pid=ImgDetMain'
            alt='Company Logo'
            style={{
              maxWidth: "100px",
              maxHeight: "120px",
              marginTop: "20px",
              marginLeft: "30px",
            }}
          />
        </Row>

        <Title style={{ textAlign: "center" }} level={4}>
          Client Details
        </Title>
        <Table
          columns={columns}
          dataSource={dataUserDetails}
          pagination={false}
          bordered
          size='middle'
          style={{
            border: "2px solid maroon",
            padding: "20px",
            marginBottom: "20px",
          }}
        />

        <Title style={{ textAlign: "center" }} level={4}>
          Policy Details
        </Title>
        <Table
          columns={columns}
          dataSource={dataPolicyDetails}
          pagination={false}
          bordered
          size='middle'
          style={{
            border: "2px solid maroon",
            padding: "20px",
            marginBottom: "20px",
          }}
        />

        <Title style={{ textAlign: "center" }} level={4}>
          Selected Optional Benefits
        </Title>
        <Table
          columns={columns}
          dataSource={dataSelectedOptionalBenefitsDetails}
          pagination={false}
          bordered
          size='middle'
          style={{
            border: "2px solid maroon",
            padding: "20px",
            marginBottom: "20px",
          }}
        />

        <Title style={{ textAlign: "center" }} level={4}>
          Premium Details
        </Title>
        <Table
          columns={columns}
          dataSource={dataPremiumDetails}
          pagination={false}
          bordered
          size='middle'
          style={{
            border: "2px solid maroon",
            padding: "20px",
            marginBottom: "20px",
          }}
        />
      </div>
    );
  };

  return (
    <DefaultPage
      title={t("EQUITY LIFE ASSURANCE (KENYA) LIMITED")}
      subTitle={t("Group credit insurance")}
      icon='calculator'
      extra={<Space> </Space>}
    >
      <Tabs
        defaultActiveKey={isDefaultTab}
        activeKey={isDefaultTab}
        onChange={(key) => setIsDefaultTab(key)}
      >
        <TabPane
          tab={
            <span>
              <TabIcon />
              Client Details
            </span>
          }
          key='userdetails'
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
          key='quotation'
          disabled={isQuotationTabEnable}
        >
          {quotationData ? <Quotation /> : <h1>Nothing to display</h1>}
        </TabPane>
      </Tabs>
    </DefaultPage>
  );
};
