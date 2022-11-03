import React, { useEffect, useMemo, useState } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  CardActions,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControl,
  TextField,
  MenuItem,
  IconButton,
  Autocomplete,
  Slider,
  Switch,
} from '@mui/material';
import { withStyles } from '@mui/styles';
import { Delete, ExpandMore, Refresh } from '@mui/icons-material';
import _ from 'lodash';
import { useSelector } from 'react-redux';

import $scope from 'src/utils/scope';
import TooltipTitle from './TooltipTitle';
import {
  clientIdExchanges,
  licenseTypes,
  marketSelectionExchanges,
  passphraseExchanges,
  subaccountExchanges,
  testnetExchanges,
  utilityTokenExchange,
} from 'src/utils/gunbot.options';
import { selectConfig } from 'src/features/config/configSlice';
import ImportSettings from './ImportSettings';
import { setter } from 'src/utils/common';

const paramInfo = $scope.setupWizard.exchange.settings.parameters;
const availableExchangeOptions = [...paramInfo.exchangeName.values, ...paramInfo.exchangeNameMore.values].sort((a, b) =>
  a.value.localeCompare(b.value),
);

const EasyEditPage = () => {
  const config = useSelector(selectConfig);

  const defaultOptions = useMemo(() => {
    const exchange = Object.keys(config.exchanges)[0] || 'binance';
    const isEncrypted = config.exchanges[exchange]?.isEncrypted;
    const exchangeOption = availableExchangeOptions.find(option => option.value === exchange);
    const exchangeSettings = config.exchanges[exchange] || $scope.exchangeConfig;
    const licenseType = config.bot.gunthy_wallet.length > 1 ? 'Gunbot Standard or above' : 'Gunbot ONE';
    return {
      exchange,
      licenseType,
      isEncrypted,
      exchangeOption,
      exchangeSettings,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [haveChanges, setHaveChanges] = useState(false);
  const [licenseType, setLicenseType] = useState(defaultOptions.licenseType);
  const [exchange, setExchange] = useState(defaultOptions.exchange);
  const [exchangeSettings, setExchangeSettings] = useState(defaultOptions.exchangeSettings);
  const [orderNumber, setOrderNumber] = useState('');
  const [gunthy_wallet, setGunthyWallet] = useState(config.bot.gunthy_wallet);
  const [licenseDetails, setLicenseDetails] = useState({});
  const [subAccount, setSubAccount] = useState('main');
  const [isSubAccount, setIsSubAccount] = useState(false);
  const [useTwoFA, setUseTwoFA] = useState(config?.GUI?.authentication?.twoFA);
  const [keyReadOnly, setKeyReadOnly] = useState(false);
  const [walletValidated, setWalletValidated] = useState(true);
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [twoFactorSecret, setTwoFactorSecret] = useState(null);
  const [twoFactorImage, setTwoFactorImage] = useState(null);

  const { isEncrypted } = exchangeSettings;
  const setIsEncrypted = encrypted => setExchangeSettings(setter('isEncrypted', encrypted));

  const [telegramSettings, setTelegramSettings] = useState({
    TELEGRAM_ENABLED: config?.bot?.TELEGRAM_ENABLED,
    TG_TEST: config?.bot?.TG_TEST,
    TELEGRAM_NICK: config?.bot?.TELEGRAM_NICK,
    TOKEN: config?.bot?.TOKEN,
    chat_id: config?.bot?.chat_id,
    admin_id: config?.bot?.admin_id,
  });
  const [tournamentSettings, setTournamentSettings] = useState({
    TOURNAMENT_AGREEMENT: config?.bot?.TOURNAMENT_AGREEMENT,
    TOURNAMENT_NICKNAME: config?.bot?.TOURNAMENT_NICKNAME,
  });
  const [variousSettings, setVariousSettings] = useState({
    BOT_CCLEAN: config?.bot?.BOT_CCLEAN,
    CANCEL_ORDERS_ENABLED: config?.bot?.CANCEL_ORDERS_ENABLED,
    CANCEL_ORDERS_CYCLE_CAP: config?.bot?.CANCEL_ORDERS_CYCLE_CAP || 1,
    CANCEL_ONCAP: config?.bot?.CANCEL_ONCAP,
    WATCH_MODE: config?.bot?.WATCH_MODE,
    MULTIPLE_BASE: config?.bot?.MULTIPLE_BASE,
    INSTANCE_NAME: config?.bot?.INSTANCE_NAME || '',
  });

  const [key, setKey] = useState('');

  const [errors, setErrors] = useState([]);

  // check settings changes for errors. Errors get shown as chip in settings summary area
  useEffect(() => {
    // let tempErrors = [];
    // tempErrors.push('Invalid Gunthy wallet');
    // tempErrors.push('Make sure to complete wallet registration');
    // tempErrors.push('Make sure to wait for token delivery');
    // setErrors(tempErrors);
  }, []);

  // handlers for different types of input elements
  const handleSettingsText = event => {
    let eventValue = event.target.value.trim();
    let eventName = event.target.name;
    switch (eventName) {
      case 'exchangeName':
        setExchange(eventValue);
        setExchangeSettings($scope.exchangeConfig);
        setIsEncrypted(false);
        break;

      case 'orderNumber':
        setOrderNumber(eventValue);
        break;

      case 'gunthy_wallet':
        setGunthyWallet(eventValue);
        break;

      case 'masterkey':
      case 'mastersecret':
      case 'clientId':
      case 'passphrase':
        setExchangeSettings(setter(eventName, eventValue));
        setIsEncrypted(false);
        break;

      case 'TELEGRAM_NICK':
      case 'TOKEN':
      case 'chat_id':
      case 'admin_id':
        setTelegramSettings(setter(eventName, eventValue));
        break;

      case 'TOURNAMENT_NICKNAME':
        setTournamentSettings(setter(eventName, eventValue));
        break;

      case 'INSTANCE_NAME':
      case 'BOT_CCLEAN':
      case 'CANCEL_ORDERS_CYCLE_CAP':
        setVariousSettings(setter(eventName, eventValue));
        break;

      case 'accountType':
        setSubAccount(eventValue);
        console.log({ eventValue });
        setHaveChanges(true);
        if (eventValue !== 'sub') {
          setExchangeSettings(setter('SUBACCOUNT', undefined));
          setIsSubAccount(false);
        } else {
          setIsSubAccount(true);
        }
        break;
      default:
        setExchangeSettings(setter(eventName, eventValue));
        break;
    }
    setHaveChanges(true);
  };

  console.log('easy-edit ------------------------ exchange =', exchange);

  const handleRemoveExchange = option => {
    // const exchange = option.value;
    // if (!_.isNil(config?.pairs?.[exchange])) {
    //   sendNotification(
    //     `Remove ${exchange} pairs before removing exchange credentials`,
    //     'error',
    //   );
    // } else {
    //   dispatch(CustomDispatch('putConfig', undefined, exchange, 'exchanges'));
    //   setExchangeSettings($scope.exchangeConfig);
    //   setIsEncrypted(false);
    //   sendNotification(
    //     `Removed ${exchange} exchange settings \n\nMake sure to save changes to store new settings`,
    //     'success',
    //   );
    // }
  };

  const onChangeExchangeOption = ({ value: selectedExchange }) => {
    const exchangeSettings = config.exchanges[selectedExchange];
    if (exchangeSettings) {
      // if selected exchange exists in config
      setExchange(selectedExchange);
      setExchangeSettings(exchangeSettings);
      setIsSubAccount(false);
      setKeyReadOnly(false);
    } else if (
      // if license of the selected exchange is registered.
      Object.keys(licenseDetails).length > 1 &&
      Object.keys(licenseDetails?.activeKeys).indexOf(selectedExchange) > -1
    ) {
      let newExchangeSettings = $scope.exchangeConfig;
      newExchangeSettings.masterkey = licenseDetails.activeKeys[selectedExchange];
      if (selectedExchange === 'kraken') {
        newExchangeSettings.delay = 8;
      }
      setExchange(selectedExchange);
      setExchangeSettings(newExchangeSettings);
      setIsEncrypted(false);
      setIsSubAccount(false);
      setKeyReadOnly(true);
    } else {
      let newExchangeSettings = $scope.exchangeConfig;
      if (selectedExchange === 'kraken') {
        newExchangeSettings.delay = 8;
      }
      setExchange(selectedExchange);
      setExchangeSettings(newExchangeSettings);
      setIsEncrypted(false);
      setIsSubAccount(false);
      setKeyReadOnly(false);
    }
  };

  const handleSettingsSlider = e => {
    const name = e.target.name;
    const value = e.target.value;
    switch (name) {
      case 'BOT_CCLEAN':
      case 'CANCEL_ORDERS_CYCLE_CAP':
        setVariousSettings(setter(name, value));
        break;

      default:
        setExchangeSettings(setter(name, value));
        break;
    }
  };

  const handleBlurSliderInput = event => {
    let value = event.target.value;
    let name = event.target.name;
    const min = Number(event.target.getAttribute('min'));
    const max = Number(event.target.getAttribute('max'));

    if (value < min) {
      value = min;
    } else if (value > max) {
      value = max;
    } else {
      return;
    }

    switch (name) {
      case 'BOT_CCLEAN':
      case 'CANCEL_ORDERS_CYCLE_CAP':
        setVariousSettings(setter(name, value));
        break;

      default:
        setExchangeSettings(setter(name, value));
        break;
    }
    setHaveChanges(true);
  };

  const handleSettingsToggle = event => {
    const { name, checked } = event.target;
    switch (name) {
      case 'TG_TEST':
      case 'TELEGRAM_ENABLED':
        setTelegramSettings(setter(name, checked));
        break;

      case 'twoFA':
        setUseTwoFA(event.target.checked);
        break;

      case 'TOURNAMENT_AGREEMENT':
        setTournamentSettings(setter(name, checked));
        break;

      case 'CANCEL_ORDERS_ENABLED':
      case 'CANCEL_ONCAP':
      case 'WATCH_MODE':
      case 'MULTIPLE_BASE':
        setVariousSettings(setter(name, checked));
        break;

      default:
        setExchangeSettings(setter(name, checked));
        break;
    }
    setHaveChanges(true);
  };

  return (
    <Grid container spacing={2} sx={{ p: 3 }}>
      <Grid item xs={12} lg={9}>
        <Card>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" component="h2">
              Gunbot settings
            </Typography>
            <Typography variant="body2" component="p" sx={{ mb: 4 }}>
              Configure your bot, so that it connect to the API of your exchange.
            </Typography>

            <Accordion disableGutters>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography sx={{ width: '33%', flexShrink: 0 }}>License</Typography>
                <Typography sx={{ color: 'text.secondary' }}>Connect Gunbot license</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={3}>
                  <Grid item xs={12} lg={4}>
                    <FormControl variant="filled" fullWidth>
                      <TooltipTitle title="License type" tooltip="Choose your Gunbot license type." />
                      <TextField
                        select
                        variant="outlined"
                        value={licenseType}
                        onChange={e => setLicenseType(e.target.value)}
                        sx={{ m: 1 }}
                      >
                        {Object.values(licenseTypes).map((type, key) => (
                          <MenuItem key={key} value={type}>
                            {type}
                          </MenuItem>
                        ))}
                      </TextField>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} lg={8}>
                    {licenseType === licenseTypes.ONE ? (
                      <FormControl variant="filled" fullWidth>
                        <TooltipTitle
                          title="Order number"
                          tooltip={`The order number is the license key. \n\nYou can look up your order number in the emails received during your order. \n\nA valid order number looks like this: 1638239714905-1DWPTptMhAnp7Txy8X34Sc625a23Z1X`}
                        />
                        <TextField
                          name="orderNumber"
                          variant="outlined"
                          sx={{ m: 1 }}
                          value={orderNumber}
                          onChange={handleSettingsText}
                        />
                      </FormControl>
                    ) : (
                      <FormControl variant="filled" fullWidth>
                        <TooltipTitle
                          title="Gunthy wallet"
                          tooltip="The registered Gunthy wallet address for your license."
                        />
                        <TextField
                          name="gunthy_wallet"
                          variant="outlined"
                          sx={{ m: 1 }}
                          value={gunthy_wallet}
                          onChange={handleSettingsText}
                        />
                      </FormControl>
                    )}
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>

            <Accordion disableGutters>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography sx={{ width: '33%', flexShrink: 0 }}>Exchange settings</Typography>
                <Typography sx={{ color: 'text.secondary' }}>Connect to your exchange account(s)</Typography>
              </AccordionSummary>

              <AccordionDetails>
                {orderNumber.length < 2 && gunthy_wallet.length < 2 ? (
                  <Grid container spacing={3}>
                    <Grid item>
                      <Typography variant="body2" p={3}>
                        Set your license details before connecting an exchange.
                      </Typography>
                    </Grid>
                  </Grid>
                ) : (
                  <>
                    <Grid container spacing={3}>
                      <Grid item xs={12} lg={4}>
                        {licenseType === licenseTypes.ONE ? (
                          <FormControl variant="filled" fullWidth>
                            <TooltipTitle title="Exchange" tooltip="Name of the exchange" />
                            <TextField
                              name="exchangeName"
                              select
                              variant="outlined"
                              value={exchange}
                              sx={{ m: 1 }}
                              onChange={handleSettingsText}
                            >
                              {paramInfo.exchangeName.values.map((element, key) => (
                                <MenuItem value={element.value} key={key}>
                                  {element.name}
                                </MenuItem>
                              ))}
                            </TextField>
                          </FormControl>
                        ) : (
                          <FormControl variant="filled" fullWidth>
                            <TooltipTitle title="Exchange" tooltip="Name of the exchange" />
                            <Autocomplete
                              defaultValue={defaultOptions.exchangeOption}
                              options={availableExchangeOptions}
                              getOptionLabel={option => option.name}
                              onChange={(_, option) => onChangeExchangeOption(option)}
                              sx={{ m: 1 }}
                              disableClearable
                              renderOption={(props, option) => {
                                return (
                                  <StyledMenuItem value={option.value} key={option.value} {...props}>
                                    <span>
                                      {option.name}
                                      {!(
                                        Object.keys(licenseDetails).length > 1 &&
                                        Object.keys(licenseDetails?.activeKeys).indexOf(option.value) > -1
                                      ) && (
                                        <Chip
                                          label={'registered'}
                                          size="small"
                                          variant="outlined"
                                          style={{
                                            marginLeft: '8px',
                                            marginBottom: '2px',
                                          }}
                                        />
                                      )}
                                    </span>

                                    <div onClick={e => e.stopPropagation()}>
                                      {Object.keys(config.exchanges).indexOf(option.value) > -1 && (
                                        <IconButton
                                          aria-label="remove exchange credentials"
                                          component="span"
                                          style={{ maxWidth: '80px' }}
                                          onClick={() => handleRemoveExchange(option)}
                                          color="error"
                                          size="small"
                                        >
                                          <Delete />
                                        </IconButton>
                                      )}
                                    </div>
                                  </StyledMenuItem>
                                );
                              }}
                              renderInput={params => <TextField {...params} variant="outlined" />}
                            />
                          </FormControl>
                        )}
                      </Grid>

                      {marketSelectionExchanges.indexOf(exchange) > -1 && licenseType !== licenseTypes.ONE ? (
                        <Grid item xs={12} lg={4}>
                          <FormControl variant="filled" fullWidth>
                            <TooltipTitle title="Market type" tooltip={paramInfo.market.tooltip} />
                            <TextField
                              name="market"
                              select
                              variant="outlined"
                              value={exchangeSettings.market}
                              sx={{ m: 1 }}
                              onChange={handleSettingsText}
                            >
                              {paramInfo.market.values.map(({ name, value }, key) => {
                                if (exchange.toLowerCase().includes('futures') && value === 'spot') {
                                  return null;
                                } else {
                                  return (
                                    <MenuItem value={value} key={key}>
                                      {name}
                                    </MenuItem>
                                  );
                                }
                              })}
                            </TextField>
                          </FormControl>
                        </Grid>
                      ) : (
                        <Grid item xs={12} lg={4}></Grid>
                      )}

                      {subaccountExchanges.indexOf(exchange) > -1 ? (
                        <>
                          <Grid item xs={12} lg={4}>
                            <FormControl variant="filled" fullWidth>
                              <TooltipTitle
                                title="Account type"
                                tooltip="Set the correct account type for which your API key can be used."
                              />
                              <TextField
                                name="accountType"
                                select
                                variant="outlined"
                                value={subAccount}
                                sx={{ m: 1 }}
                                onChange={handleSettingsText}
                              >
                                {paramInfo.accountType.values.map((element, key) => {
                                  const value = element.value;
                                  const name = element.name;
                                  return (
                                    <MenuItem value={value} key={key}>
                                      {name}
                                    </MenuItem>
                                  );
                                })}
                              </TextField>
                            </FormControl>
                          </Grid>
                          {isSubAccount && (
                            <Grid item xs={12} lg={4}>
                              <FormControl variant="filled" fullWidth>
                                <TooltipTitle
                                  title="Subaccount name"
                                  tooltip="The exact name of the subaccount your API key is valid for"
                                />
                                <TextField
                                  name="SUBACCOUNT"
                                  variant="outlined"
                                  value={exchangeSettings.SUBACCOUNT}
                                  onChange={handleSettingsText}
                                  sx={{ m: 1 }}
                                />
                              </FormControl>
                            </Grid>
                          )}
                        </>
                      ) : (
                        <Grid item xs={12} lg={4}></Grid>
                      )}
                    </Grid>

                    <Grid container spacing={3}>
                      <Grid item xs={12} lg={6}>
                        <FormControl variant="filled" fullWidth>
                          <TooltipTitle
                            title={`API key ${keyReadOnly ? `[registered]` : ''}`}
                            tooltip={paramInfo.key.tooltip}
                          />
                          <TextField
                            name="masterkey"
                            variant="outlined"
                            value={exchangeSettings.masterkey}
                            onChange={handleSettingsText}
                            InputProps={{
                              readOnly: keyReadOnly,
                            }}
                            sx={{ m: 1 }}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} lg={6}>
                        <FormControl variant="filled" fullWidth>
                          <TooltipTitle
                            title={`API secret ${isEncrypted ? `[encrypted - read only]` : ''}`}
                            tooltip={paramInfo.secret.tooltip}
                          />
                          <TextField
                            name="mastersecret"
                            variant="outlined"
                            value={exchangeSettings.mastersecret}
                            onChange={handleSettingsText}
                            InputProps={{
                              readOnly: isEncrypted,
                            }}
                            sx={{ m: 1 }}
                          />
                        </FormControl>
                      </Grid>

                      {passphraseExchanges.indexOf(exchange) > -1 && (
                        <Grid item xs={12} lg={6}>
                          <FormControl variant="filled" fullWidth>
                            <TooltipTitle title="API passphrase" tooltip={paramInfo.passphrase.tooltip} />
                            <TextField
                              name="passphrase"
                              variant="outlined"
                              value={exchangeSettings.passphrase}
                              onChange={handleSettingsText}
                              sx={{ m: 1 }}
                            />
                          </FormControl>
                        </Grid>
                      )}

                      {clientIdExchanges.indexOf(exchange) > -1 && (
                        <Grid item xs={12} lg={6}>
                          <FormControl variant="filled" fullWidth>
                            <TooltipTitle title="Client ID" tooltip={paramInfo.clientId.tooltip} />
                            <TextField
                              name="clientId"
                              variant="outlined"
                              value={exchangeSettings.clientId}
                              onChange={handleSettingsText}
                              sx={{ m: 1 }}
                            />
                          </FormControl>
                        </Grid>
                      )}

                      <Grid item xs={12} lg={6}>
                        <FormControl variant="filled" fullWidth>
                          <TooltipTitle title="Processing delay" tooltip={paramInfo.delay.tooltip} />
                          <Grid container spacing={2} alignItems="flex-start">
                            <Grid item xs>
                              <Slider
                                name="delay"
                                color="secondary"
                                value={Number(exchangeSettings.delay)}
                                valueLabelDisplay="auto"
                                step={1}
                                min={0}
                                max={60}
                                sx={{ m: 1 }}
                                marks={[
                                  { value: 0, label: `0s` },
                                  { value: 60, label: `60s` },
                                ]}
                                onChange={handleSettingsSlider}
                              />
                            </Grid>
                            <Grid item>
                              <TextField
                                name="delay"
                                type="number"
                                size="small"
                                sx={{ width: 70, m: 1 }}
                                value={exchangeSettings.delay}
                                onChange={handleSettingsText}
                                onBlur={handleBlurSliderInput}
                                inputProps={{
                                  step: 1,
                                  min: 0,
                                  max: 60,
                                }}
                              />
                            </Grid>
                          </Grid>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} lg={6}>
                        <FormControl variant="filled" fullWidth>
                          <TooltipTitle title="Trading fees" tooltip={paramInfo.TRADING_FEES.tooltip} />
                          <Grid container spacing={2} alignItems="flex-start">
                            <Grid item xs>
                              <Slider
                                name="TRADING_FEES"
                                valueLabelDisplay="auto"
                                color="secondary"
                                step={0.1}
                                min={0}
                                max={1}
                                value={Number(exchangeSettings.TRADING_FEES)}
                                sx={{ m: 1 }}
                                marks={[
                                  { value: 0, label: `0%` },
                                  { value: 1, label: `1%` },
                                ]}
                                onChange={handleSettingsSlider}
                              />
                            </Grid>
                            <Grid item>
                              <TextField
                                name="TRADING_FEES"
                                sx={{ width: 70, m: 1 }}
                                size="small"
                                value={exchangeSettings.TRADING_FEES}
                                onChange={handleSettingsText}
                                onBlur={handleBlurSliderInput}
                                inputProps={{
                                  step: 0.1,
                                  min: 0,
                                  max: 1,
                                  type: 'number',
                                }}
                              />
                            </Grid>
                          </Grid>
                        </FormControl>
                      </Grid>

                      {utilityTokenExchange.indexOf(exchange) > -1 && (
                        <Grid item xs={12} lg={6}>
                          <FormControl variant="filled" fullWidth>
                            <TooltipTitle
                              title={paramInfo.pay_with_utility_token.name}
                              tooltip={paramInfo.pay_with_utility_token.tooltip}
                            />
                            <Switch
                              name="pay_with_utility_token"
                              checked={exchangeSettings.pay_with_utility_token}
                              onChange={handleSettingsToggle}
                              color="secondary"
                            />
                          </FormControl>
                        </Grid>
                      )}
                      {testnetExchanges.indexOf(exchange) > -1 && (
                        <Grid item xs={12} lg={6}>
                          <FormControl variant="filled" fullWidth>
                            <TooltipTitle title={paramInfo.testnet.name} tooltip={paramInfo.testnet.tooltip} />
                            <Switch
                              name="testnet"
                              checked={exchangeSettings.testnet}
                              onChange={handleSettingsToggle}
                              color="secondary"
                            />
                          </FormControl>
                        </Grid>
                      )}
                    </Grid>
                  </>
                )}
              </AccordionDetails>
            </Accordion>

            {(walletValidated || config.GUI.demo) && (
              <>
                <Accordion disableGutters>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography sx={{ width: '33%', flexShrink: 0 }}>Various</Typography>
                    <Typography sx={{ color: 'text.secondary' }}>Global bot settings</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={3}>
                      <Grid item xs={12} lg={4}>
                        <FormControl variant="filled" fullWidth>
                          <TooltipTitle
                            title="Cancel open orders"
                            tooltip="Allow the bot to cancel open orders for active trading pairs. This happens automatically when there is an open limit order and price starts moving away from it."
                          />
                          <Switch
                            checked={variousSettings.CANCEL_ORDERS_ENABLED}
                            onChange={handleSettingsToggle}
                            name="CANCEL_ORDERS_ENABLED"
                            color="secondary"
                          />
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} lg={4}>
                        <FormControl variant="filled" fullWidth>
                          <TooltipTitle
                            title="Cancel after x rounds"
                            tooltip="Change the behavior of cancelling orders: orders are cancelled after a number of defined processing rounds passes."
                          />
                          <Switch
                            checked={variousSettings.CANCEL_ONCAP}
                            onChange={handleSettingsToggle}
                            name="CANCEL_ONCAP"
                            color="secondary"
                          />
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} lg={4}>
                        <FormControl variant="filled" fullWidth>
                          <TooltipTitle
                            title="Cancel order rounds"
                            tooltip="Sets the number of rounds to wait before cancelling an open order."
                          />
                          <Grid container spacing={3}>
                            <Grid item xs>
                              <Slider
                                name="CANCEL_ORDERS_CYCLE_CAP"
                                valueLabelDisplay="auto"
                                step={1}
                                min={1}
                                max={999}
                                color="secondary"
                                value={Number(variousSettings.CANCEL_ORDERS_CYCLE_CAP)}
                                sx={{ m: 1 }}
                                marks={[
                                  { value: 1, label: `1` },
                                  { value: 999, label: `999` },
                                ]}
                                onChange={handleSettingsSlider}
                              />
                            </Grid>
                            <Grid item>
                              <TextField
                                name="CANCEL_ORDERS_CYCLE_CAP"
                                sx={{ width: '70px', m: 1 }}
                                size="small"
                                value={Number(variousSettings.CANCEL_ORDERS_CYCLE_CAP)}
                                onChange={handleSettingsText}
                                onBlur={handleBlurSliderInput}
                                inputProps={{
                                  step: 1,
                                  min: 1,
                                  max: 999,
                                  type: 'number',
                                }}
                              />
                            </Grid>
                          </Grid>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} lg={4}>
                        <FormControl variant="filled" fullWidth>
                          <TooltipTitle
                            title="Watch mode"
                            tooltip={`Gunbot will process the configured pairs, but will not place actual buy or sell orders. \n\nFor spot strategies and futuresGrid only`}
                          />
                          <Switch
                            checked={variousSettings.WATCH_MODE}
                            onChange={handleSettingsToggle}
                            name="WATCH_MODE"
                            color="secondary"
                          />
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} lg={4}>
                        <FormControl variant="filled" fullWidth>
                          <TooltipTitle
                            title="Multiple base"
                            tooltip={`Change selling behavior. \n\nDefault: each sell order will sell all available funds \n\nMultiple base: each sell order will sell only as much as the trading limit for a pair defines\n\nWarning: improper use of this setting will lead to sell order execution problems. Don't enabled this unless you know exactly why you need it.`}
                          />
                          <Switch
                            checked={variousSettings.MULTIPLE_BASE}
                            onChange={handleSettingsToggle}
                            name="MULTIPLE_BASE"
                            color="secondary"
                          />
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} lg={4}>
                        <FormControl variant="filled" fullWidth>
                          <TooltipTitle
                            title="Clean cache"
                            tooltip="Clean the internal cache every x hours. This causes a bot restart, normally you do not need to adjust this setting."
                          />
                          <Grid container spacing={3}>
                            <Grid item xs>
                              <Slider
                                name="BOT_CCLEAN"
                                valueLabelDisplay="auto"
                                step={1}
                                min={1}
                                max={999}
                                color="secondary"
                                value={Number(variousSettings.BOT_CCLEAN)}
                                sx={{ m: 1 }}
                                marks={[
                                  { value: 1, label: `1h` },
                                  { value: 999, label: `999h` },
                                ]}
                                onChange={handleSettingsSlider}
                              />
                            </Grid>
                            <Grid item>
                              <TextField
                                name="BOT_CCLEAN"
                                sx={{ width: '70px', m: 1 }}
                                size="small"
                                value={Number(variousSettings.BOT_CCLEAN)}
                                onChange={handleSettingsText}
                                onBlur={handleBlurSliderInput}
                                inputProps={{
                                  step: 1,
                                  min: 1,
                                  max: 999,
                                  type: 'number',
                                }}
                              />
                            </Grid>
                          </Grid>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} lg={4}>
                        <FormControl variant="filled" fullWidth>
                          <TooltipTitle
                            title="Instance name"
                            tooltip="Custom prefix to identify your bot instance in its browser tab name"
                          />
                          <TextField
                            name="INSTANCE_NAME"
                            variant="outlined"
                            value={variousSettings?.INSTANCE_NAME}
                            onChange={handleSettingsText}
                            sx={{ m: 1 }}
                          />
                        </FormControl>
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>

                <Accordion disableGutters>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography sx={{ width: '33%', flexShrink: 0 }}>Telegram</Typography>
                    <Typography sx={{ color: 'text.secondary' }}>Configure Telegram bot</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={3}>
                      <Grid item xs={12} lg={4}>
                        <FormControl variant="filled" fullWidth>
                          <TooltipTitle
                            title="Enable Telegram bot"
                            tooltip="Use the Telegram bot to receive notifications for trades, and much more."
                          />
                          <Switch
                            name="TELEGRAM_ENABLED"
                            checked={telegramSettings.TELEGRAM_ENABLED}
                            onChange={handleSettingsToggle}
                            color="secondary"
                          />
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} lg={4}>
                        <FormControl variant="filled" fullWidth>
                          <TooltipTitle
                            title="Enable test message"
                            tooltip="Sends a test message every time the bot core starts."
                          />
                          <Switch
                            name="TG_TEST"
                            checked={telegramSettings.TG_TEST}
                            onChange={handleSettingsToggle}
                            color="secondary"
                          />
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} lg={4}>
                        <FormControl variant="filled" fullWidth>
                          <TooltipTitle title="Nickname" tooltip="Set a nickname for your Telegram bot." />
                          <TextField
                            name="TELEGRAM_NICK"
                            variant="outlined"
                            value={telegramSettings?.TELEGRAM_NICK}
                            onChange={handleSettingsText}
                            sx={{ m: 1 }}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} lg={4}>
                        <FormControl variant="filled" fullWidth>
                          <TooltipTitle title="Bot token" tooltip="The bot token as generated by @botfather" />
                          <TextField
                            name="TOKEN"
                            variant="outlined"
                            value={telegramSettings?.TOKEN}
                            onChange={handleSettingsText}
                            sx={{ m: 1 }}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} lg={4}>
                        <FormControl variant="filled" fullWidth>
                          <TooltipTitle
                            title="Chat ID"
                            tooltip="Your telegram chat ID. You can request this ID by talking to @myidbot"
                          />
                          <TextField
                            name="chat_id"
                            variant="outlined"
                            value={telegramSettings?.chat_id}
                            onChange={handleSettingsText}
                            sx={{ m: 1 }}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} lg={4}>
                        <FormControl variant="filled" fullWidth>
                          <TooltipTitle
                            title="Admin ID"
                            tooltip="The telegram chat ID that is allowed to interact with the bot, usefull in groups. When in doubt, use the same value as the Chat ID."
                          />
                          <TextField
                            name="admin_id"
                            variant="outlined"
                            value={telegramSettings?.admin_id}
                            onChange={handleSettingsText}
                            sx={{ m: 1 }}
                          />
                        </FormControl>
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>

                <Accordion disableGutters>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography sx={{ width: '33%', flexShrink: 0 }}>2FA</Typography>
                    <Typography sx={{ color: 'text.secondary' }}>Two factor authentication</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={3}>
                      <Grid item xs={12} lg={4}>
                        <FormControl variant="filled" fullWidth>
                          <TooltipTitle
                            title="Enable 2FA"
                            tooltip="Use two factor authentication for access to the Gunbot interface."
                          />
                          <Switch name="twoFA" checked={useTwoFA} onChange={handleSettingsToggle} color="secondary" />
                        </FormControl>
                      </Grid>

                      {useTwoFA ? (
                        <Grid item xs={12} lg={12}>
                          <div sx={{ m: 1 }}>
                            <Button
                              onClick={() => setShowTwoFactor(!showTwoFactor)}
                              variant="contained"
                              color="primary"
                              size="small"
                            >
                              {showTwoFactor ? 'Hide QR code' : 'Show QR code'}
                            </Button>
                            {showTwoFactor ? (
                              <Typography
                                variant="body2"
                                component="p"
                                gutterBottom
                                style={{
                                  paddingLeft: '0px',
                                  fontSize: '1rem',
                                }}
                              >
                                <img
                                  src={twoFactorImage}
                                  width="160"
                                  alt=""
                                  style={{
                                    filter: 'invert(86.5%)',
                                  }}
                                />
                                <br />
                                Scan this QR code with an app like Authy or Google Authenticator
                                <br />
                                {'QR Code: ' + twoFactorSecret}
                              </Typography>
                            ) : null}
                          </div>
                        </Grid>
                      ) : null}
                    </Grid>
                  </AccordionDetails>
                </Accordion>

                <Accordion disableGutters>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography sx={{ width: '33%', flexShrink: 0 }}>Tournament</Typography>
                    <Typography sx={{ color: 'text.secondary' }}>Join trading tournaments</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={3}>
                      <Grid item xs={12} lg={4}>
                        <FormControl variant="filled" fullWidth>
                          <TooltipTitle
                            title="Join tournament"
                            tooltip="Agree to sharing trading results and strategy settings for the purpose of tracking tournament results. Custom strategies or AutoConfig data remain private."
                          />
                          <Switch
                            checked={tournamentSettings.TOURNAMENT_AGREEMENT}
                            onChange={handleSettingsToggle}
                            name="TOURNAMENT_AGREEMENT"
                            color="secondary"
                          />
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} lg={4}>
                        <FormControl variant="filled" fullWidth>
                          <TooltipTitle
                            title="Nickname"
                            tooltip={`Your unique nickname to show on the tournament board. \r\nYou can join the tournament with multiple bot instances. In that case, add a number to the end of your nick (like nick1, nick2) so they can be merged at the end of the tournament.`}
                          />
                          <TextField
                            name="TOURNAMENT_NICKNAME"
                            variant="outlined"
                            value={tournamentSettings.TOURNAMENT_NICKNAME}
                            onChange={handleSettingsText}
                            sx={{ m: 1 }}
                          />
                        </FormControl>
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>

                <Accordion disableGutters>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography sx={{ width: '33%', flexShrink: 0 }}>Exchange settings</Typography>
                    <Typography sx={{ color: 'text.secondary' }}>Import settings from file</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <ImportSettings />
                  </AccordionDetails>
                </Accordion>
              </>
            )}

            <Accordion disableGutters>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography sx={{ width: '33%', flexShrink: 0 }}>Export</Typography>
                <Typography sx={{ color: 'text.secondary' }}>Export config to share</Typography>
              </AccordionSummary>
              <AccordionDetails></AccordionDetails>
            </Accordion>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} lg={3}>
        <Card>
          <CardContent>
            <Typography variant="h6" component="h2">
              Setting summary
            </Typography>
            <Typography variant="body2" component="p" gutterBottom style={{ paddingLeft: '0px', fontSize: '0.8rem' }}>
              This page helps you connect your bot to your exchange account(s), validate your license and more global
              bot settings.
            </Typography>

            <Typography variant="subtitle2" component="p" gutterBottom sx={{ mt: 3 }}>
              Connected exchanges:
            </Typography>
            <Grid container spacing={1}>
              {Object.keys(config.exchanges).map((exchange, key) => (
                <Grid item key={key}>
                  <Chip label={`${exchange}`} variant="outlined" />
                </Grid>
              ))}
            </Grid>

            <Typography variant="subtitle2" component="p" gutterBottom sx={{ mt: 3 }}>
              Important enabled settings:
            </Typography>
            <Grid container spacing={1}>
              {variousSettings.WATCH_MODE && (
                <Grid item>
                  <Chip label={`Watch mode`} variant="outlined" />
                </Grid>
              )}
              {telegramSettings.TELEGRAM_ENABLED && (
                <Grid item>
                  <Chip label={`Telegram bot`} variant="outlined" />
                </Grid>
              )}
              {useTwoFA && (
                <Grid item>
                  <Chip label={`Two factor authentication`} variant="outlined" />
                </Grid>
              )}
              {variousSettings.MULTIPLE_BASE && (
                <Grid item>
                  <Chip label={`Multiple base`} variant="outlined" />
                </Grid>
              )}
              {tournamentSettings.TOURNAMENT_NICKNAME && (
                <Grid item>
                  <Chip label={`Joined tournament as ${tournamentSettings.TOURNAMENT_NICKNAME}`} variant="outlined" />
                </Grid>
              )}
            </Grid>

            <Typography variant="subtitle2" component="p" gutterBottom sx={{ mt: 3 }}>
              Errors:
            </Typography>
            <Grid container spacing={1}>
              {errors.map((error, key) => (
                <Grid item key={key}>
                  {error === 'API credentials wrong: cannot connect' ? (
                    <Chip
                      key={key}
                      icon={<Refresh />}
                      label={`${error}`}
                      variant="outlined"
                      color="secondary"
                      onClick={() => {}}
                    />
                  ) : (
                    <Chip key={key} label={`${error}`} variant="outlined" color="secondary" />
                  )}
                </Grid>
              ))}
            </Grid>
          </CardContent>
          <CardActions sx={{ p: 2, justifyContent: 'flex-end' }}>
            <Button
              size="small"
              color="inherit"
              onClick={() => {
                window.open('https://wiki.gunthy.org/about/supported-exchanges/create-api/', '_blank');
              }}
            >
              How to create api keys
            </Button>
          </CardActions>
        </Card>
      </Grid>
    </Grid>
  );
};

const StyledMenuItem = withStyles({
  root: {
    '&:hover': {
      backgroundColor: 'transparent',
    },
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between !important',
  },
})(MenuItem);

export default EasyEditPage;
