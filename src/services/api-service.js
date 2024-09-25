/* eslint-disable */
import axios from "axios";
import cookies from 'js-cookie'

//--- Importing constants ---
import config from "../assets/config.json";
import options from "../assets/options.json";

const headers = {
  'Content-Type': 'application/json',
  "Access-Control-Allow-Origin" : "*",
  "Access-Control-Allow-Methods":"GET,PUT,POST,DELETE,PATCH,OPTIONS",
  "Authorization": ""
}

export class ApiService {

  constructor (bus) {
    this._eventBus = bus;
    this._cookies = cookies;
  }

  login (email, passwd, callback) {
    const formData = new FormData();
    formData.append("username", email);
    formData.append("password", passwd);
    axios.post(config.url.root + config.url.auth.login, formData, {
      headers: headers
    }).then((resp) => {
      callback(resp.data);
    }).catch((err) => {
      this._eventBus.emit(options.eventbus.AUTH_ERROR, err.message);
    });
  }

  queryNavLinksByRole(callback) {
    let token = this._cookies.get(options.cookies.token);
    headers.Authorization = "Bearer " + token;
    axios.get(config.url.root + config.url.inquiry.user.navlinks, {
      headers: headers
    }).then((resp) => {
      callback(resp.data);
    }).catch((err) => {
      this._eventBus.emit(options.eventbus.INQUIRY_ERROR, err.message);
    });
  }

  register (fname, lname, gender, salutation, birth, job, country, email, callback) {
    const formData = new FormData();
    formData.append("fname", fname);
    formData.append("lname", lname);
    formData.append("gender", gender);
    formData.append("salutation", salutation);
    formData.append("birth", birth);
    formData.append("job", job);
    formData.append("country", country);
    formData.append("email", email);
    axios.post(config.url.root + config.url.auth.register, formData, {
      headers: headers
    }).then((resp) => {
      callback(resp.data);
    }).catch((err) => {
      this._eventBus.emit(options.eventbus.AUTH_ERROR, err.message);
    });
  }

  logout () {
    let token = this._cookies.get(options.cookies.token);
    const formData = new FormData();
    formData.append("token", token);
    axios.post(config.url.root + config.url.auth.logout, formData, {
      headers: headers
    }).catch((err) => {
      this._eventBus.emit(options.eventbus.AUTH_ERROR, err.message);
    });
  }

  queryNavItemsByPair(provider, pair, callback) {
    let token = this._cookies.get(options.cookies.token);
    if (token) {
      headers.Authorization = "Bearer " + token;
      const formData = new FormData();
      formData.append("provider", provider);
      formData.append("pair", pair);
      axios.post(config.url.root + config.url.inquiry.events.bypair, formData, {
        headers: headers
      }).then((resp) => {
        callback(resp.data);
      }).catch((err) => {
        this._eventBus.emit(options.eventbus.INQUIRY_ERROR, err.message);
      });
    }
  }

  queryNavItemsByCurrency(provider, currency, callback) {
    let token = this._cookies.get(options.cookies.token);
    if (token) {
      headers.Authorization = "Bearer " + token;
      const formData = new FormData();
      formData.append("provider", provider);
      formData.append("currency", currency);
      axios.post(config.url.root + config.url.inquiry.events.bycurrency, formData, {
        headers: headers
      }).then((resp) => {
        callback(resp.data);
      }).catch((err) => {
        this._eventBus.emit(options.eventbus.INQUIRY_ERROR, err.message);
      });
    }
  }

  queryNavItemsByWords(words, callback) {
    let token = this._cookies.get(options.cookies.token);
    if (token) {
      headers.Authorization = "Bearer " + token;
      const formData = new FormData();
      formData.append("words", words);
      axios.post(config.url.root + config.url.inquiry.events.bywords, formData, {
        headers: headers
      }).then((resp) => {
        callback(resp.data);
      }).catch((err) => {
        this._eventBus.emit(options.eventbus.INQUIRY_ERROR, err.message);
      });
    }
  }

  queryEventsByTitleForPair(provider, curr, title, page, max, callback) {
    let token = this._cookies.get(options.cookies.token);
    if (token) {
      headers.Authorization = "Bearer " + token;
      const formData = new FormData();
      formData.append("provider", provider);
      formData.append("title", title);
      formData.append("currency", curr);
      formData.append("page", page);
      formData.append("max", max);
      axios.post(config.url.root + config.url.inquiry.events.forpair, formData, {
        headers: headers
      }).then((resp) => {
        callback(resp.data);
      }).catch((err) => {
        this._eventBus.emit(options.eventbus.INQUIRY_ERROR, err.message);
      });
    }
  }

  queryEventsByTitleForPairs(provider, curr, title, page, callback) {
    let token = this._cookies.get(options.cookies.token);
    if (token) {
      headers.Authorization = "Bearer " + token;
      const formData = new FormData();
      formData.append("provider", provider);
      formData.append("title", title);
      formData.append("currency", curr);
      formData.append("page", page);
      axios.post(config.url.root + config.url.inquiry.events.forpairs, formData, {
        headers: headers
      }).then((resp) => {
        callback(resp.data);
      }).catch((err) => {
        this._eventBus.emit(options.eventbus.INQUIRY_ERROR, err.message);
      });
    }
  }

  queryOtherEventsByEventTime(provider, pair, time, uuid, callback) {
    let token = this._cookies.get(options.cookies.token);
    if (token) {
      headers.Authorization = "Bearer " + token;
      const formData = new FormData();
      formData.append("provider", provider);
      formData.append("pair", pair);
      formData.append("time", time);
      formData.append("uuid", uuid);
      axios.post(config.url.root + config.url.inquiry.events.others, formData, {
        headers: headers
      }).then((resp) => {
        callback(resp.data);
      }).catch((err) => {
        this._eventBus.emit(options.eventbus.INQUIRY_ERROR, err.message);
      });
    }
  }

  queryPricesByEventTime(pair, timeframe, time, callback) {
    let token = this._cookies.get(options.cookies.token);
    if (token) {
      headers.Authorization = "Bearer " + token;
      const formData = new FormData();
      formData.append("pair", pair);
      formData.append("timeframe", timeframe);
      formData.append("time", time);
      axios.post(config.url.root + config.url.inquiry.prices.byeventtime, formData, {
        headers: headers
      }).then((resp) => {
        callback(resp.data);
      }).catch((err) => {
        this._eventBus.emit(options.eventbus.INQUIRY_ERROR, err.message);
      });
    }
  }

  queryVolatilityByEvent(origin, title, pair, currency, time, page, index, perpage, max, callback) {
    let token = this._cookies.get(options.cookies.token);
    if (token) {
      headers.Authorization = "Bearer " + token;
      const formData = new FormData();
      formData.append("provider", origin);
      formData.append("title", title);
      formData.append("pair", pair);
      formData.append("currency", currency);
      formData.append("time", time);``
      formData.append("page", page);
      formData.append("index", index);
      formData.append("perpage", perpage);
      formData.append("max", max);
      axios.post(config.url.root + config.url.inquiry.prices.volatilities, formData, {
        headers: headers
      }).then((resp) => {
        console.log("VOLATILITY:\n", resp.data);
        callback(resp.data);
      }).catch((err) => {
        this._eventBus.emit(options.eventbus.INQUIRY_ERROR, err.message);
      });
    }
  }

  queryForecastByEvent(origin, title, pair, currency, time, page, index, perpage, max, callback) {
    let token = this._cookies.get(options.cookies.token);
    if (token) {
      headers.Authorization = "Bearer " + token;
      const formData = new FormData();
      formData.append("provider", origin);
      formData.append("title", title);
      formData.append("pair", pair);
      formData.append("currency", currency);
      formData.append("time", time);``
      formData.append("page", page);
      formData.append("index", index);
      formData.append("perpage", perpage);
      formData.append("max", max);
      axios.post(config.url.root + config.url.inquiry.events.forecast, formData, {
        headers: headers
      }).then((resp) => {
        callback(resp.data);
      }).catch((err) => {
        this._eventBus.emit(options.eventbus.INQUIRY_ERROR, err.message);
      });
    }
  }

  querySwingByEvent(origin, title, pair, currency, time, page, index, perpage, max, callback) {
    let token = this._cookies.get(options.cookies.token);
    if (token) {
      headers.Authorization = "Bearer " + token;
      const formData = new FormData();
      formData.append("provider", origin);
      formData.append("title", title);
      formData.append("pair", pair);
      formData.append("currency", currency);
      formData.append("time", time);``
      formData.append("page", page);
      formData.append("index", index);
      formData.append("perpage", perpage);
      formData.append("max", max);
      axios.post(config.url.root + config.url.inquiry.prices.swings, formData, {
        headers: headers
      }).then((resp) => {
        callback(resp.data);
      }).catch((err) => {
        this._eventBus.emit(options.eventbus.INQUIRY_ERROR, err.message);
      });
    }
  }

}
