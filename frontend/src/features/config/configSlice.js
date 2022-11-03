const { createSlice } = require('@reduxjs/toolkit');

const initialState = {
  pairs: {},
  exchanges: {},
  strategies: {},
  bot: {
    gunthy_wallet: '0x3684b581db1f94b721ee0022624329feb16ab653',
    TOURNAMENT_AGREEMENT: true,
    TOURNAMENT_NICKNAME: 'nickname',
    CANCEL_ONCAP: true,
    CANCEL_ORDERS_CYCLE_CAP: 1,
    WATCH_MODE: true,
    MULTIPLE_BASE: true,
    BOT_CCLEAN: 1,

    // Telegram Options
    TELEGRAM_ENABLED: true,
    TG_TEST: true,
    TELEGRAM_NICK: 'Telegram Nick',
    TOKEN: '',
    chat_id: '',
    admin_id: '',
  },
  GUI: {
    authentication: {
      twoFA: true,
    },
  },
  ws: {},
  AutoConfig: {},
  imap_listener: {},
  webhooks: {},
};

export const configSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {
    patchConfig: (key_str, value) => {},
    setConfig: config => {},
  },
});

export const { patchConfig, setConfig } = configSlice.actions;

export const selectConfig = state => state.config;

export default configSlice.reducer;
