import {
  Autocomplete,
  Button,
  FormControl,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import React, { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import { patchConfig, selectConfig } from 'src/features/config/configSlice';
import { setter } from 'src/utils/common';

const useStyles = makeStyles(theme => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  input: {
    display: 'none',
  },
}));

export default function ImportSettings() {
  const classes = useStyles();
  const [filename, setFilename] = useState('');
  const [fileContent, setFileContent] = useState('');
  const [errorStatus, setErrorStatus] = useState('');
  const [isAutoconfig, setIsAutoconfig] = useState(false); // false is config.js
  const [config, setConfig] = useState({});
  const [autoConfig, setAutoConfig] = useState({});
  const [selectedConfigElements, setSelectedConfigElements] = useState({});

  const dispatch = useDispatch();
  const activeConfig = useSelector(selectConfig);

  const handleUpload = e => {
    setFilename(e.target.value);
    const fileReader = new FileReader();
    fileReader.readAsText(e.target.files[0], 'UTF-8');
    fileReader.onload = e => {
      setFileContent(e.target.result); // result is string
    };
  };

  const handleToggleConfig = () => {
    setIsAutoconfig(!isAutoconfig);
    setErrorStatus('');
    setSelectedConfigElements({});
    setFilename('');
    setFileContent('');
  };

  const handleMerge = () => {
    if (isAutoconfig) {
      const autoConfig = _.merge({}, activeConfig.autoconfig, selectedConfigElements);
      dispatch(patchConfig('autoconfig', autoConfig));
    } else {
      Object.keys(selectedConfigElements).forEach(section => {
        const configPart = _.merge({}, activeConfig[section], selectedConfigElements[section]);
        dispatch(patchConfig(section, configPart));
      });
    }
  };

  const handleSelect = (selectedValues, type) => {
    switch (type) {
      case 'pair':
        const pairs = {};
        selectedValues.forEach(({ exchange, pair, pairContent }) => {
          if (!pairs[exchange]) pairs[exchange] = {};
          pairs[exchange][pair] = pairContent;
        });
        setSelectedConfigElements(setter('pairs', pairs));
        break;

      case 'strategy':
        const strategies = {};
        selectedValues.forEach(({ stratName, stratContent }) => {
          strategies[stratName] = stratContent;
        });
        setSelectedConfigElements(setter('strategies', strategies));
        break;

      case 'exchange':
        const exchanges = {};
        selectedValues.forEach(({ exchange, exchangeContent }) => {
          exchanges[exchange] = exchangeContent;
        });
        setSelectedConfigElements(setter('exchanges', exchanges));
        break;

      case 'bot':
      case 'imap_listener':
      case 'webhooks':
        let items = {};
        selectedValues.forEach(({ key, value }) => {
          if (!items[type]) items[type] = {};
          items[type][key] = value;
        });
        setSelectedConfigElements(type, items);
        break;

      case 'autoconfig':
        let tempConfig = {};
        selectedValues.forEach(item => {
          tempConfig[item.key] = item.value;
        });
        setSelectedConfigElements(tempConfig);
        break;

      default:
        break;
    }
  };

  const pairList = useMemo(() => {
    if (!config.pairs) return [];
    const list = [];
    _.each(config.pairs, (pairs, exchange) => {
      _.each(pairs, (pairContent, pair) => {
        list.push({
          exchange,
          pair,
          pairContent,
          key: `${pair} | ${exchange}`,
        });
      });
    });
    return list;
  }, [config.pairs]);

  const strategyList = useMemo(() => {
    if (!config.strategies) return [];
    return Object.keys(config.strategies).map(item => ({
      key: item,
      stratName: item,
      stratContent: config.strategies[item],
    }));
  }, [config.strategies]);

  const exchanges = useMemo(() => {
    if (!config.exchanges) return [];
    return Object.keys(config.exchanges).map(exchange => {
      return {
        key: exchange,
        exchange,
        exchangeContent: config.exchanges[exchange],
      };
    });
  }, [config.exchanges]);

  const botSettings = useMemo(() => {
    if (!config.bot) return [];
    return Object.keys(config.bot).map(item => ({
      key: item,
      value: config.bot[item],
    }));
  }, [config.bot]);

  const imap_listeners = useMemo(() => {
    if (!config.imap_listener) return [];
    return Object.keys(config.imap_listener).map(item => ({
      key: item,
      value: config.imap_listener[item],
    }));
  }, [config.imap_listener]);

  const webhooks = useMemo(() => {
    if (!config.webhooks) return [];
    return Object.keys(config.webhooks).map(item => ({
      key: item,
      value: config.webhooks[item],
    }));
  }, [config.webhooks]);

  const autoConfigs = useMemo(() => {
    return Object.keys(autoConfig).map(item => ({
      key: item,
      value: autoConfig[item],
    }));
  }, [autoConfig]);

  React.useEffect(() => {
    if (fileContent === '') return;

    setSelectedConfigElements({});

    let jsonContent = '';
    try {
      jsonContent = JSON.parse(fileContent);
    } catch (error) {
      return setErrorStatus('Uploaded file is invalid JSON');
    }

    if (!isAutoconfig) {
      if (!jsonContent.strategies || !jsonContent.pairs || !jsonContent.bot) {
        setConfig({});
        setErrorStatus('Uploaded file is not a valid config.js file');
      } else {
        let data = jsonContent.pairs;
        let healedPairs = JSON.parse(JSON.stringify(jsonContent.pairs));
        Object.keys(data).forEach(exchange => {
          Object.keys(data[exchange]).forEach(pair => {
            healedPairs[exchange][pair].strategy = data[exchange][pair].strategy.toLowerCase();
            if (!_.isNil(data[exchange][pair].override?.BUY_METHOD)) {
              healedPairs[exchange][pair].override.BUY_METHOD = data[exchange][pair].override.BUY_METHOD.toLowerCase();
            }
            if (!_.isNil(data[exchange][pair].override?.SELL_METHOD)) {
              healedPairs[exchange][pair].override.SELL_METHOD =
                data[exchange][pair].override.SELL_METHOD.toLowerCase();
            }
          });
        });

        let healedstrategies = {};
        Object.keys(jsonContent.strategies).forEach(stratName => {
          healedstrategies[stratName.toLowerCase()] = jsonContent.strategies[stratName];
          healedstrategies[stratName.toLowerCase()].BUY_METHOD =
            healedstrategies[stratName.toLowerCase()].BUY_METHOD.toLowerCase();
          healedstrategies[stratName.toLowerCase()].SELL_METHOD =
            healedstrategies[stratName.toLowerCase()].SELL_METHOD.toLowerCase();
        });

        jsonContent.pairs = healedPairs;
        jsonContent.strategies = healedstrategies;

        setConfig(jsonContent);
        setErrorStatus('');
      }
    } else {
      if (jsonContent.strategies && jsonContent.pairs && jsonContent.bot) {
        setAutoConfig({});
        setErrorStatus('Uploaded file does not seem to be a valid autoconfig.json file');
      } else {
        setAutoConfig(jsonContent);
        setErrorStatus('');
      }
    }
  }, [fileContent, isAutoconfig]);

  console.log('easy-edit refreshed');

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} lg={4}>
        <FormControl variant="filled" fullWidth>
          <RadioGroup row onChange={handleToggleConfig} value={isAutoconfig}>
            <FormControlLabel value={false} control={<Radio />} label="config.js" />
            <FormControlLabel value={true} control={<Radio />} label="autoconfig.json" />
          </RadioGroup>
        </FormControl>
      </Grid>

      <Grid item xs={12} lg={4}>
        <input
          accept="*.json/*.js"
          className={classes.input}
          id="contained-button-upload"
          type="file"
          value={filename}
          onChange={handleUpload}
        />
        <label htmlFor="contained-button-upload">
          <Button variant="contained" color="primary" component="span">
            {!isAutoconfig ? 'Upload config file' : 'Upload autoconfig file'}
          </Button>
        </label>
      </Grid>

      {Object.keys(selectedConfigElements).length > 0 && (
        <Grid item xs={12} lg={4}>
          <Button variant="contained" color="primary" component="span" onClick={handleMerge}>
            Import selected items
          </Button>
        </Grid>
      )}
      <Grid item xs={12} py="0 !important" />

      {errorStatus ? (
        <Grid item xs={12}>
          {errorStatus}
        </Grid>
      ) : (
        <>
          {!isAutoconfig ? (
            Object.keys(config).length > 0 ? (
              <>
                <Grid item xs={12} lg={6} xl={4}>
                  <Autocomplete
                    multiple
                    options={strategyList}
                    isOptionEqualToValue={isOptionEqualToValue}
                    disableCloseOnSelect
                    getOptionLabel={option => option.stratName}
                    onChange={(_, value) => {
                      handleSelect(value, 'strategy');
                    }}
                    fullWidth
                    renderInput={params => (
                      <TextField
                        {...params}
                        variant="outlined"
                        label="Select strategies"
                        placeholder="Select strategies"
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} lg={6} xl={4}>
                  <Autocomplete
                    multiple
                    options={pairList}
                    isOptionEqualToValue={isOptionEqualToValue}
                    disableCloseOnSelect
                    getOptionLabel={option => option.key}
                    onChange={(_, values) => handleSelect(values, 'pair')}
                    fullWidth
                    renderInput={params => (
                      <TextField {...params} variant="outlined" label="Select pairs" placeholder="Select pairs" />
                    )}
                  />
                </Grid>
                <Grid item xs={12} lg={6} xl={4}>
                  <Autocomplete
                    multiple
                    options={exchanges}
                    isOptionEqualToValue={isOptionEqualToValue}
                    disableCloseOnSelect
                    getOptionLabel={option => option.exchange}
                    onChange={(_, value) => handleSelect(value, 'exchange')}
                    fullWidth
                    renderInput={params => (
                      <TextField
                        {...params}
                        variant="outlined"
                        label="Select exchange keys"
                        placeholder="Select exchange keys"
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} lg={6} xl={4}>
                  <Autocomplete
                    multiple
                    options={botSettings}
                    isOptionEqualToValue={isOptionEqualToValue}
                    disableCloseOnSelect
                    getOptionLabel={option => option.key}
                    onChange={(_, value) => handleSelect(value, 'bot')}
                    fullWidth
                    renderInput={params => (
                      <TextField
                        {...params}
                        variant="outlined"
                        label="Select bot settings"
                        placeholder="Select bot settings"
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} lg={6} xl={4}>
                  <Autocomplete
                    multiple
                    options={imap_listeners}
                    isOptionEqualToValue={isOptionEqualToValue}
                    disableCloseOnSelect
                    getOptionLabel={option => option.key}
                    onChange={(_, value) => handleSelect(value, 'imap_listener')}
                    fullWidth
                    renderInput={params => (
                      <TextField
                        {...params}
                        variant="outlined"
                        label="Select imap settings"
                        placeholder="Select imap settings"
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} lg={6} xl={4}>
                  <Autocomplete
                    multiple
                    options={webhooks}
                    isOptionEqualToValue={isOptionEqualToValue}
                    disableCloseOnSelect
                    getOptionLabel={option => option.key}
                    onChange={(_, value) => handleSelect(value, 'webhooks')}
                    fullWidth
                    renderInput={params => (
                      <TextField
                        {...params}
                        variant="outlined"
                        label="Select webhooks settings"
                        placeholder="Select webhooks settings"
                      />
                    )}
                  />
                </Grid>
              </>
            ) : (
              <Grid item xs={12}>
                <Typography variant="body2" p={2} textAlign="center">
                  Please upload config.js file
                </Typography>
              </Grid>
            )
          ) : Object.keys(autoConfig).length > 0 ? (
            <Grid item xs={12} lg={4}>
              <Autocomplete
                multiple
                options={autoConfigs}
                disableCloseOnSelect
                getOptionLabel={option => option.key}
                onChange={(_, value) => handleSelect(value, 'autoconfig')}
                fullWidth
                renderInput={params => (
                  <TextField
                    {...params}
                    variant="outlined"
                    label="Select AutoConfig jobs"
                    placeholder="Select AutoConfig jobs"
                  />
                )}
              />
            </Grid>
          ) : (
            <Grid item xs={12}>
              <Typography variant="body2" p={2} textAlign="center">
                Please upload autoConfig.json file
              </Typography>
            </Grid>
          )}
        </>
      )}
    </Grid>
  );
}

const isOptionEqualToValue = (a, b) => a.key === b.key;
