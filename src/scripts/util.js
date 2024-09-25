/* eslint-disable */
import moment from "moment/moment";

export class Util {
  constructor () {}

  static coloringFact (mode) {
    let rescol
    switch (mode) {
      case "AEP":
        rescol = "blue"
        break
      case "ABP":
        rescol = "green"
        break
      case "ASP":
        rescol = "red"
        break
      case "AEF":
        rescol = "blue"
        break
      case "ABF":
        rescol = "green"
        break
      case "ASF":
        rescol = "red"
        break
      case "FEP":
        rescol = "blue"
        break
      case "FBP":
        rescol = "green"
        break
      case "FSP":
        rescol = "red"
        break
      default:
        rescol = "red"
        break
    }
    return rescol
  }

  static stylingImpact (val) {
    let col
    switch (val) {
      case -1:
        col = "sr-impact-none"
        break
      case 0:
        col = "sr-impact-low"
        break
      case 1:
        col = "sr-impact-med"
        break
      case 2:
        col = "sr-impact-high"
        break
      default:
        col = "sr-impact-none"
        break
    }
    return col
  }

  static translateImpact (val) {
    let impactLabel
    switch (val) {
      case -1:
        impactLabel = "NONE"
        break
      case 0:
        impactLabel = "LOW"
        break
      case 1:
        impactLabel = "MED"
        break
      case 2:
        impactLabel = "HIGH"
        break
    }
    return impactLabel
  }

  static coloringImpact (val) {
    let col;
    switch (val) {
      case -1:
        col = {
          "color": "blue",
          "font-weight": "bold"
        };
        break;
      case 0:
        col =  {
          "color": "green",
          "font-weight": "bold"
        };
        break;
      case 1:
        col =  {
          "color": "orange",
          "font-weight": "bold"
        };
        break;
      case 2:
        col =  {
          "color": "red",
          "font-weight": "bold"
        };
        break;
      default:
        col =  {
          "color": "blue",
          "font-weight": "bold"
        };
        break;
    }
    return col;
  }

  static coloringResult (mode) {
    let rescol;
    switch (mode) {
      case "AEP":
        rescol = "blue";
        break;
      case "ABP":
        rescol = "green";
        break;
      case "ASP":
        rescol = "red";
        break;
      case "AEF":
        rescol = "blue";
        break;
      case "ABF":
        rescol = "green";
        break;
      case "ASF":
        rescol = "red";
        break;
      case "FEP":
        rescol = "blue";
        break;
      case "FBP":
        rescol = "green";
        break;
      case "FSP":
        rescol = "red";
        break;
    }
    return rescol;
  }

  static setFlagIcon(val) {
    return "icons/" + val + ".png";
  }

  static isEmail(email) {
    return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
  }

  static isExpired(time) {
    let expired = new Date(time);
    let now = new Date();
    if (expired < now) {
      return true;
    } else {
      return false;
    }
  }

  static parseTimeOnly(unixtime) {
    let time = moment.unix(unixtime).format("DD/MM/yyyy HH:mm");
    return time;
  }

  static parseDateOnly(unixtime) {
    let time = moment.unix(unixtime).format("DD/MM/yyyy");
    return time;
  }

  static parseDayAndTime(unixtime) {
    let time = moment.unix(unixtime).format("DD/MM/yyyy HH:mm");
    let day = moment.unix(unixtime).format("ddd");
    return day + " " + time;
  }

  static fromUnixtimeToDate(unixtime) {
    return new Date(unixtime * 1000);
  }

  static getPairsByCurrency(curr) {
    let pairs = [];
    switch (curr) {
      case "USD":
        pairs.push("AUDUSD");
        pairs.push("EURUSD");
        pairs.push("GBPUSD");
        pairs.push("NZDUSD");
        pairs.push("USDCAD");
        pairs.push("USDCHF");
        pairs.push("USDJPY");
        break;
      case "AUD":
        pairs.push("AUDUSD");
        pairs.push("AUDCAD");
        pairs.push("AUDCHF");
        pairs.push("AUDJPY");
        pairs.push("AUDNZD");
        pairs.push("EURAUD");
        pairs.push("GBPAUD");
        break;
      case "EUR":
        pairs.push("EURUSD");
        pairs.push("EURAUD");
        pairs.push("EURCAD");
        pairs.push("EURCHF");
        pairs.push("EURGBP");
        pairs.push("EURJPY");
        pairs.push("EURNZD");
        break;
      case "GBP":
        pairs.push("GBPUSD");
        pairs.push("EURGBP");
        pairs.push("GBPAUD");
        pairs.push("GBPCAD");
        pairs.push("GBPCHF");
        pairs.push("GBPJPY");
        pairs.push("GBPNZD");
        break;
      case "NZD":
        pairs.push("NZDUSD");
        pairs.push("AUDNZD");
        pairs.push("EURNZD");
        pairs.push("GBPNZD");
        pairs.push("NZDCAD");
        pairs.push("NZDCHF");
        pairs.push("NZDJPY");
        break;
      case "CAD":
        pairs.push("USDCAD");
        pairs.push("AUDCAD");
        pairs.push("CADCHF");
        pairs.push("CADJPY");
        pairs.push("EURCAD");
        pairs.push("GBPCAD");
        pairs.push("NZDCAD");
        break;
      case "CHF":
        pairs.push("USDCHF");
        pairs.push("AUDCHF");
        pairs.push("CADCHF");
        pairs.push("CHFJPY");
        pairs.push("EURCHF");
        pairs.push("GBPCHF");
        pairs.push("NZDCHF");
        break;
      case "JPY":
        pairs.push("USDJPY");
        pairs.push("AUDJPY");
        pairs.push("CADJPY");
        pairs.push("CHFJPY");
        pairs.push("EURJPY");
        pairs.push("GBPJPY");
        pairs.push("NZDJPY");
        break;
    }
    return pairs;
  };
}
