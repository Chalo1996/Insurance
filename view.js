//block

/**
 * @author Emmanuel Chalo <emmanuel.chalo@equitybank.co.ke>
 * @created 2012-04-08
 * @lastEdition 2024-05-21
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
      frequency: "Single",
      installments: 1,
      retrenchment: false,
      gcRate: 0.675,
      retRate: 0.775,
      discount: 70,
      freeCoverLimit: 5000000,
      quoteSubmitted: false,
      quotationData: null,
      loading: false,
    });

    const handleFormChange = (fieldName, value) => {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [fieldName]: value,
      }));
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
      gcRate,
      retRate,
      discount,
      freeCoverLimit,
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
    const handleFrequencyChange = (value) => {
      handleFormChange("frequency", value);
      let installmentValue;
      switch (value) {
        case "Annually":
          installmentValue = 1;
          break;
        case "SemiAnnually":
          installmentValue = 2;
          break;
        case "Quarterly":
          installmentValue = 4;
          break;
        case "Monthly":
          installmentValue = 12;
          break;
        default:
          installmentValue = 1;
      }

      handleFormChange("installments", installmentValue);
    };

    const handlePremiumInstallments = (e) => {
      handleFormChange("installments", e.target.value);
    };

    const handleRetrenchmentChange = (checked) =>
      handleFormChange("retrenchment", checked);

    const handleGCRateChange = (value) => {
      handleFormChange("gcRate", value);
    };

    const handleRETRateChange = (value) => {
      handleFormChange("retRate", value);
    };

    const handleDiscountChange = (value) => {
      handleFormChange("discount", value);
    };

    const handleFreeCoverLimitChange = (value) => {
      handleFormChange("freeCoverLimit", value);
    };

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

    const onFinish = () => {
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
          memberName: userName,
          sumAssured: sumAssured,
          termsInMonths: termsInMonths,
          individualRetrenchmentCover: retrenchment === true ? "Yes" : "No",
          annuitantDoB: dob,
          numberOfPartners: numOfPartners,
          partnersDatesOfBirths: partnerDates,
          coverType: coverType,
          frequency: frequency,
          retRate: retRate,
          gcRate: gcRate,
          discount: discount,
          freeCoverLimit: freeCoverLimit,
        },
        memberDetails: [],
      };

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
        variant='filled'
        name='clientdetails'
        initialValues={{ remember: true }}
        layout='vertical'
        onSubmit={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={24} md={12} lg={12} xl={12}>
            <Text strong>User Details(Principal Member)</Text>
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
              label={
                coverType === "Multiple"
                  ? "Partner 1 Date Of Birth"
                  : "Date Of Birth"
              }
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
            <Item label='Cover Type' name='coverType'>
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
              label={<Text strong>Other Partner Details</Text>}
              name='partners'
            >
              <Space direction='vertical' wrap style={{ width: "100%" }}>
                <Select
                  style={{ width: "100%" }}
                  onChange={handleNumOfPartnersChange}
                  disabled={coverType !== "Multiple"}
                  options={[
                    { value: "1", label: 1 },
                    { value: "2", label: 2 },
                    { value: "3", label: 3 },
                    { value: "4", label: 4 },
                    { value: "5", label: 5 },
                    { value: "6", label: 6 },
                  ]}
                />
              </Space>
            </Item>

            {coverType === "Multiple" ? (
              <div>
                <Row gutter={[16, 16]}>
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
                        label={`Partner ${index + 2} Date of Birth`}
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
                            index + 2
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

            <Row gutter={[16, 16]}>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <Item label='Premium Frequency' name='frequency'>
                  <Select
                    style={{ width: "100%" }}
                    defaultValue='Single'
                    placeholder='Select frequency'
                    onChange={handleFrequencyChange}
                    options={[
                      { value: "Single", label: "Single" },
                      { value: "Annual", label: "Annual" },
                      { value: "SemiAnnually", label: "Semi-Annually" },
                      { value: "Quarterly", label: "Quarterly" },
                      { value: "Monthly", label: "Monthly" },
                    ]}
                  />
                </Item>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <Item
                  label={<Text>Number of Premium Installments</Text>}
                  name='installments'
                >
                  <Space direction='vertical' wrap style={{ width: "100%" }}>
                    <Input
                      onChange={handlePremiumInstallments}
                      readOnly={true}
                      value={installments}
                    />
                  </Space>
                </Item>
              </Col>
            </Row>

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

        <div
          style={{ borderBottom: "2px solid #d9d9d9", margin: "24px 0" }}
        ></div>

        <div>
          <Text strong>Product parameters</Text>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={12} lg={6} xl={6}>
              <Item label='Group credit (gc) rate' name='gcrate'>
                <InputNumber
                  style={{ width: "100%" }}
                  defaultValue={gcRate}
                  formatter={(value) => `${value}%`}
                  parser={(value) => value.replace("%", "")}
                  readOnly={true}
                  onKeyPress={disableNotNumberKey}
                  onChange={handleGCRateChange}
                />
              </Item>
            </Col>
            <Col xs={24} sm={12} md={12} lg={6} xl={6}>
              <Item label='Retrenchment rate (ret) rate' name='retrate'>
                <InputNumber
                  style={{ width: "100%" }}
                  defaultValue={retRate}
                  formatter={(value) => `${value}%`}
                  parser={(value) => value.replace("%", "")}
                  readOnly={true}
                  onKeyPress={disableNotNumberKey}
                  onChange={handleRETRateChange}
                />
              </Item>
            </Col>
            <Col xs={24} sm={12} md={12} lg={6} xl={6}>
              <Item label='Discount' name='discount'>
                <InputNumber
                  style={{ width: "100%" }}
                  defaultValue={discount}
                  formatter={(value) => `${value}%`}
                  parser={(value) => value.replace("%", "")}
                  readOnly={true}
                  onKeyPress={disableNotNumberKey}
                  onChange={handleDiscountChange}
                />
              </Item>
            </Col>
            <Col xs={24} sm={12} md={12} lg={6} xl={6}>
              <Item label='Free cover limit' name='freecoverlimit'>
                <InputNumber
                  style={{ width: "100%" }}
                  defaultValue={freeCoverLimit}
                  readOnly={true}
                  onKeyPress={disableNotNumberKey}
                  prefix='KSH'
                  formatter={(value) =>
                    value.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                  onChange={handleFreeCoverLimitChange}
                />
              </Item>
            </Col>
          </Row>
        </div>

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
      medicalRequirements,
    } = quotationData;

    const columns = [
      {
        title: "Attribute",
        dataIndex: "attribute",
        key: "attribute",
        width: "50%",
        render: (text) => <Text strong>{text}</Text>,
      },
      {
        title: "Value",
        dataIndex: "value",
        key: "value",
        width: "50%",
      },
    ];

    const dataUserDetails = [
      { key: "name", attribute: "Name", value: userName },
      { key: "country", attribute: "Country", value: country },
      { key: "phone", attribute: "Phone", value: `${countryCode}${phone}` },
      { key: "email", attribute: "Email", value: email },
      {
        key: "dob",
        attribute: "Date of Birth",
        value: dob,
      },
      { key: "age", attribute: "Age", value: annuitantAge - 1 },
    ];

    let coverTypeTitle;
    let premiumsAttr;
    let numOfPremiumAttr;

    switch (frequency) {
      case "Single":
        coverTypeTitle = `Single`;
        premiumsAttr = `Total`;
        numOfPremiumAttr = ``;
        break;
      case "Annual":
        coverTypeTitle = `Annually`;
        premiumsAttr = `Annual`;
        numOfPremiumAttr = ` every year`;
        break;
      case "SemiAnnually":
        coverTypeTitle = `SemiAnnually`;
        premiumsAttr = `Semi-Annual`;
        numOfPremiumAttr = ` per year`;
        break;
      case "Quarterly":
        coverTypeTitle = `Quarterly`;
        premiumsAttr = `Quarterly`;
        numOfPremiumAttr = ` per year`;
        break;
      case "Monthly":
        coverTypeTitle = `Monthly`;
        premiumsAttr = "Monthly";
        numOfPremiumAttr = ` per year`;
        break;
      default:
        premiumsAttr = "";
    }

    const dataPolicyDetails = [
      {
        key: "coverType",
        attribute: "Type of Cover",
        value: coverTypeTitle,
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
        value: numOfPartners + 1,
      });
    }

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
        attribute: `${premiumsAttr} Premiums payable`,
        value: AnnualPremiumsPayable.toLocaleString("en-US", {
          style: "currency",
          currency: "KSH",
        }),
      },
      {
        key: "premiumInstallments",
        attribute: `Number of Premium Installments${numOfPremiumAttr}`,
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

    const today = new Date();
    const options = { month: "long", day: "numeric", year: "numeric" };
    const formattedDate = today.toLocaleDateString("en-US", options);

    return (
      <>
        <div
          style={{
            border: "2px solid black",
            maxWidth: "800px",
            margin: "auto",
            position: "relative",
            paddingBottom: "60px",
          }}
        >
          <div style={{ maxWidth: "750px", margin: "auto" }}>
            <Row
              justify='space-between'
              align='middle'
              style={{ marginTop: "20px" }}
            >
              <Col>
                <Title level={4} style={{ margin: 0 }}>
                  EQUITY LIFE ASSURANCE (KENYA) LIMITED
                </Title>
                <Title level={4} style={{ margin: 0 }}>
                  Group Credit Quotation
                </Title>
              </Col>
              <Col>
                <div style={{ textAlign: "right" }}>
                  <img
                    src='https://th.bing.com/th/id/OIP.slQhzvN6Tzo0RxGP9AiQSgAAAA?rs=1&pid=ImgDetMain'
                    alt='Company Logo'
                    style={{
                      maxWidth: "100px",
                      maxHeight: "120px",
                      marginLeft: "30px",
                    }}
                  />
                  <Text style={{ display: "block", marginTop: "10px" }} strong>
                    Date: {formattedDate}
                  </Text>
                </div>
              </Col>
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
          <div
            style={{
              textAlign: "justify",
              marginTop: "20px",
              marginLeft: "15px",
              padding: "10px",
            }}
          >
            <Text strong>Notes:</Text>
            <br />
            <Text>Quotation is valid for 90 days since the date of issue</Text>
            <br />
            <Text>Premium is Indicative: Medicals Required</Text>
            <br />
            <Text strong style={{ color: "red" }}>
              Medical Requirements
            </Text>
            {/* <br />
            <Text>1. Medical Examiner's Report</Text>
            <br />
            <Text>
              2. Blood Profile (ESR, CBC) and Blood Chemistry Studies (FBS,
              Cholesterol, SGPT, SGOT, Creatinine or Serum Urea)
            </Text>
            <br />
            <Text>3. Urinalysis Report</Text>
            <br /> */}
            <br />
            <Text>1. {medicalRequirements}</Text>
            <br />
            <br />
            <Text strong>Term & Conditions</Text>
            <br />
            <a
              href='http://www.equity.co.ke/insurance_termlife'
              target='_blank'
              rel='noopener noreferrer'
            >
              www.equity.co.ke/insurance_termlife
            </a>
            <br />
            <Text strong>Contacts</Text>
            <br />
            <Text>Email: quotations@equityinsurance.co.ke</Text>
            <br />
            <Text>Tel: 0765000000</Text>
            <br />
          </div>

          <div
            style={{
              backgroundColor: "maroon",
              position: "absolute",
              bottom: "0",
              width: "100%",
              textAlign: "center",
              color: "white",
              padding: "5px 0",
            }}
          >
            Equity Life Assurance (Kenya) Limited
          </div>
        </div>
      </>
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
