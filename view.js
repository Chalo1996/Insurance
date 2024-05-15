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
    InputNumber,
    Row,
    Col,
    Select,
    DatePicker,
    Space,
    Switch,
    Button,
    Typography,
    notification,
    Table,
  } = A;

  const { TabPane } = Tabs;
  const { Item } = Form;
  const { Option } = Select;
  const { Title, Text } = Typography;

  const useState = React.useState;
  const useEffect = React.useEffect;

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

  const MainComponent = () => {
    const [isQuotationTabEnable, setIsQuotationTabEnable] =
      React.useState(true);
    const [isDefaultTab, setIsDefaultTab] = React.useState("userdetails");
    const [quotationData, setQuotationData] = React.useState(null);
    const [formData, setFormData] = useState({
      userName: "",
      country: "",
      phone: "",
      email: "",
      coverType: "",
      dob: null,
      sumAssured: 5000000,
      countryCode: "",
      termsInMonths: "",
      numOfPartners: 0,
      partnerDates: [],
      frequency: "Annual",
      installments: "",
      retrenchment: false,
      quoteSubmitted: false,
      quotationData: null,
      loading: false,
    });

    const handleFormChange = (fieldName, value) => {
      setFormData({
        ...formData,
        [fieldName]: value,
      });
    };

    const handleQuotationChange = (data) => {
      setQuotationData(data);
    };

    const handleDefaultTabChange = (value) => {
      setIsDefaultTab(value);
    };

    const handleIsQuotationTabEnableChange = (bool) => {
      setIsQuotationTabEnable(bool);
    };

    return (
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
          <ClientDetails
            formData={formData}
            handleFormChange={handleFormChange}
            handleQuotationChange={handleQuotationChange}
            handleDefaultTabChange={handleDefaultTabChange}
            handleIsQuotationTabEnableChange={handleIsQuotationTabEnableChange}
          />
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
          {quotationData ? (
            <Quotation formData={formData} quotationData={quotationData} />
          ) : (
            <h1>Nothing to display</h1>
          )}
        </TabPane>
      </Tabs>
    );
  };

  const ClientDetails = ({
    formData,
    handleFormChange,
    handleQuotationChange,
    handleDefaultTabChange,
    handleIsQuotationTabEnableChange,
  }) => {
    const {
      userName,
      country,
      phone,
      email,
      coverType,
      dob,
      sumAssured,
      countryCode,
      termsInMonths,
      numOfPartners,
      partnerDates,
      frequency,
      installments,
      retrenchment,
      quoteSubmitted,
      loading,
    } = formData;

    const [form] = Form.useForm();

    const handleNameChange = (e) =>
      handleFormChange("userName", e.target.value);

    const handleCountryCodeChange = (value) => {
      let countryCode;
      switch (value) {
        case "Kenya":
          countryCode = "+254";
          break;
        case "Uganda":
          countryCode = "+256";
          break;
        case "Tanzania":
          countryCode = "+255";
          break;
        case "Rwanda":
          countryCode = "+250";
          break;
        case "Congo":
          countryCode = "+123";
          break;
        case "South-Sudan":
          countryCode = "+211";
          break;
        default:
          countryCode = "000";
      }
      handleFormChange("country", value);
      handleFormChange("countryCode", countryCode);
    };

    const handlePhoneChange = (e) => handleFormChange("phone", e.target.value);

    const validatePhone = (_, value) => {
      const cleanedPhoneNumber = value.replace(/[ -()]/g, "");
      const phoneRegex = /^\d{9}$/;
      if (value && !phoneRegex.test(cleanedPhoneNumber)) {
        return Promise.reject("Please enter a valid phone number");
      }
      return Promise.resolve();
    };
    const handleEmailChange = (e) => handleFormChange("email", e.target.value);
    const handleCoverTypeChange = (value) =>
      handleFormChange("coverType", value);
    const handleDoBChange = (date, dateString) => {
      handleFormChange("dob", dateString);
    };

    const disableNotNumberKey = (event) => {
      if (!/[0-9]/.test(event.key)) {
        event.preventDefault();
      }
    };

    const handleSumChange = (value) => {
      handleFormChange("sumAssured", value);
    };

    const handleTermsInMonths = (value) => {
      handleFormChange("termsInMonths", value);
    };
    const handlePremiumInstallments = (value) => {
      handleFormChange("installments", value);
    };

    const handleFrequencyChange = (e) => {
      console.log(e);
      handleFormChange("frequency", e);
    };
    const handleRetrenchmentChange = (checked) =>
      handleFormChange("retrenchment", checked);

    const disabledDate = (current) => {
      if (!current) return false;

      const selectedDate = new Date(current);
      const today = new Date();

      let age = today.getFullYear() - selectedDate.getFullYear();

      const hasBirthdayOccurred =
        today.getMonth() > selectedDate.getMonth() ||
        (today.getMonth() === selectedDate.getMonth() &&
          today.getDate() >= selectedDate.getDate());

      if (!hasBirthdayOccurred) {
        age--;
      }

      return age < 18 || age > 65;
    };

    const handleNumOfPartnersChange = (value) => {
      handleFormChange("numOfPartners", parseInt(value));
    };
    const handlePartnerDoBChange = (index, date, dateString) => {
      const updatedDates = [...partnerDates];
      updatedDates[index] = dateString;
      handleFormChange("partnerDates", updatedDates);
    };

    useEffect(() => {
      form.resetFields(
        Array.from(
          { length: numOfPartners },
          (_, index) => `dob_partner_${index}`
        )
      );
      handleFormChange("partnerDates", Array(numOfPartners).fill(null));
    }, [numOfPartners, form]);

    const onFinish = (values) => {
      console.log("Received values:", values);
    };

    const onFinishFailed = (errorInfo) => {
      notification.error({ message: errorInfo });
    };

    const onFinished = () => {
      if (coverType === "") {
        notification.error({
          message: "Please select a type of cover.",
        });
        return;
      }

      if (!dob) {
        notification.error({
          message: "Please provide your date of birth.",
        });
        return;
      }

      if (coverType === "Multiple") {
        if (numOfPartners === 0) {
          notification.error({
            message: "Please select number of partners to cover.",
          });
          return;
        }
        if (partnerDates.includes(null)) {
          notification.error({
            message: "Please provide dates of births of all partners.",
          });
          return;
        }
      }

      if (!installments) {
        notification.error({
          message: "Please provide number of installments.",
        });
        return;
      }

      const contextObject = {
        userInfo: {
          sumAssured: sumAssured,
          termsInMonths: termsInMonths,
          individualRetrenchmentCover: retrenchment,
          annuitantDoB: dob,
          numberOfPartners: numOfPartners,
          partnersDatesOfBirths: partnerDates,
          coverType: coverType,
          frequency: frequency,
          numOfPremiumInstallments: installments,
        },
        memberDetails: [],
      };

      console.log("Context Object", contextObject);

      handleFormChange("loading", true);

      exe("ExeChain", {
        chain: "M3TrainingGroupCreditFixedRating",
        context: JSON.stringify(contextObject),
      })
        .then((response) => {
          const { ok, msg, outData } = response;
          if (!ok) {
            notification.error({ message: msg });
          } else {
            handleQuotationChange(outData);
            handleDefaultTabChange("quotation");
            handleIsQuotationTabEnableChange(false);
          }
        })
        .catch((error) => {
          notification.error({
            message: "An error occurred while processing the quote.",
          });
        })
        .finally(() => {
          handleFormChange("loading", false);
        });
    };

    return (
      <Form
        form={form}
        variant="filled"
        name='clientdetails'
        initialValues={{ remember: true }}
        layout='vertical'
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={24} md={12} lg={12} xl={12}>
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
                onChange={handleCountryCodeChange}
              >
                <Option value='Kenya'>Kenya (+254)</Option>
                <Option value='Uganda'>Uganda (+256)</Option>
                <Option value='Tanzania'>Tanzania (+255)</Option>
                <Option value='Rwanda'>Rwanda (+250)</Option>
                <Option value='Congo'>Congo (+123)</Option>
                <Option value='South-Sudan'>South-Sudan (+211)</Option>
              </Select>
            </Item>

            <Item
              label='Phone No'
              name='phone'
              onKeyPress={disableNotNumberKey}
              rules={[
                {
                  required: true,
                  message: "Please input your phone number!",
                },
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
                {
                  required: true,
                  message: "Please input your date of birth!",
                },
              ]}
            >
              <DatePicker
                format='MM/DD/YYYY'
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

          <Col xs={24} sm={24} md={12} lg={12} xl={12}>
            <Text strong>Product Details</Text>
            <Item
              label='Cover Type'
              name='coverType'
              // rules={[{ required: true, message: "Please select cover type!" }]}
            >
              <Space direction='vertical' wrap style={{ width: "100%" }}>
                <Select
                  style={{ width: "100%" }}
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
              <InputNumber
                style={{
                  width: "100%",
                }}
                value={sumAssured}
                prefix='KSH'
                formatter={(value) =>
                  value.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                onChange={handleSumChange}
              />
            </Item>
            <Item
              label='Terms In Months'
              name='termsinmonths'
              onKeyPress={disableNotNumberKey}
              rules={[
                {
                  required: true,
                  message: "Please input terms in months!",
                },
              ]}
            >
              <InputNumber
                style={{ width: "100%" }}
                onChange={handleTermsInMonths}
              />
            </Item>
            <Item
              label={<Text strong>Partners Details</Text>}
              name='partners'
              // rules={[
              //   {
              //     required: true,
              //     message: "Please select number of partners to insure!",
              //   },
              // ]}
            >
              <Space direction='vertical' wrap style={{ width: "100%" }}>
                <Select
                  style={{ width: "100%" }}
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
              <div>
                <Row gutter={[8, 8]}>
                  {Array.from({ length: numOfPartners }, (_, index) => (
                    <Col
                      xs={24}
                      sm={12}
                      md={12}
                      lg={6}
                      xl={6}
                      key={`partner_${index}`}
                    >
                      <Form.Item
                        label={`Partner ${index + 1} Date of Birth`}
                        name={`dob_partner_${index}`}
                        rules={[
                          {
                            required: true,
                            message: "Please select a date of birth",
                          },
                        ]}
                      >
                        <DatePicker
                          format='MM/DD/YYYY'
                          placeholder={`Select Partner ${
                            index + 1
                          } Date of Birth`}
                          onChange={(date, dateString) =>
                            handlePartnerDoBChange(index, date, dateString)
                          }
                          disabledDate={disabledDate}
                        />
                      </Form.Item>
                    </Col>
                  ))}
                </Row>
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
              <InputNumber
                style={{ width: "100%" }}
                onChange={handlePremiumInstallments}
              />
            </Item>
            <Item
              label='Premium Frequency'
              name='frequency'
              // rules={[
              //   {
              //     required: true,
              //     message: "Please select premium frequency!",
              //   },
              // ]}
            >
              <Space wrap>
                <Select
                  style={{ width: "100%" }}
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
              {loading ? "Loading" : "Quote"}
            </Button>
          </Item>
        </Row>
      </Form>
    );
  };

  const Quotation = ({ quotationData, formData }) => {
    const {
      userName,
      country,
      phone,
      email,
      coverType,
      dob,
      sumAssured,
      countryCode,
      termsInMonths,
      numOfPartners,
      frequency,
      installments,
      retrenchment,
    } = formData;

    const {
      annuitantAge,
      TermsInYears,
      AnnualPremiumsPayable,
      individualRetrenchmentCover,
      GrossInsurancePremium,
    } = quotationData;

    let selectedcountry = "";

    switch (countryCode) {
      case "+254":
        selectedcountry = "Kenya";
        break;
      case "256":
        selectedcountry = "+Uganda";
        break;
      case "+255":
        selectedcountry = "Tanzania";
        break;
      case "+250":
        selectedcountry = "Rwanda";
        break;
      case "+123":
        selectedcountry = "Congo";
        break;
      case "+211":
        selectedcountry = "South Sudan";
        break;
      default:
        selectedcountry = "Not Selected.";
    }

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

    const dataUserDetailsColumns = [
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
      { key: "name", attribute: "Name", value: userName },
      { key: "country", attribute: "Country", value: selectedcountry },
      { key: "phone", attribute: "Phone", value: `${countryCode}${phone}` },
      { key: "email", attribute: "Email", value: email },
      {
        key: "dob",
        attribute: "Date of Birth",
        value: dob,
      },
      { key: "age", attribute: "Age", value: annuitantAge - 1 },
    ];

    const dataPolicyDetails = [
      {
        key: "coverType",
        attribute: "Type of Cover",
        value: coverType,
      },
      {
        key: "termsInMonths",
        attribute: "Terms in Months",
        value: termsInMonths,
      },
      {
        key: "termsInYears",
        attribute: "Terms in Years",
        value: TermsInYears,
      },
      {
        key: "sumAssured",
        attribute: "Initial Sum Assured",
        value:
          sumAssured &&
          sumAssured.toLocaleString("en-US", {
            style: "currency",
            currency: "KSH",
          }),
      },
      {
        key: "frequency",
        attribute: "Premium Frequency",
        value: frequency,
      },
    ];

    if (coverType === "Multiple") {
      dataPolicyDetails.push({
        key: "numOfPartners",
        attribute: "Number of partners",
        value: numOfPartners,
      });
    }

    console.log("Policy Details", dataPolicyDetails);

    const dataSelectedOptionalBenefitsDetails = [
      {
        key: "retrenchment",
        attribute: "Retrenchment Cover/Job Loss",
        value:
          coverType !== "Multiple"
            ? individualRetrenchmentCover
              ? "Yes"
              : "No"
            : "Not Applicable for Multiple Individuals & Partnerships",
      },
    ];

    const dataPremiumDetails = [
      {
        key: "annualPremium",
        attribute: "Annual Premiums payable",
        value: AnnualPremiumsPayable.toLocaleString("en-US", {
          style: "currency",
          currency: "KSH",
        }),
      },
      {
        key: "premiumInstallments",
        attribute: "Number of Premium Installments",
        value: installments,
      },
      {
        key: "totalPremium",
        attribute: "Total Premiums payable",
        value: GrossInsurancePremium.toLocaleString("en-US", {
          style: "currency",
          currency: "KSH",
        }),
      },
    ];

    console.log("Premium Details", dataPremiumDetails);

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
          showHeader={false}
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
          showHeader={false}
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
          showHeader={false}
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
          showHeader={false}
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
      <MainComponent />
    </DefaultPage>
  );
};
