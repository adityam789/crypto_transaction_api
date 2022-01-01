import axios from "axios";

const url = "https://api.pro.coinbase.com";

export default class PricingService {
  public getPricingFromCoinbase(coin1: string, coin2:string, date?: string) {
    const coinpair: string = [coin1, coin2].join("-");
    return axios
      .get(`https://api.coinbase.com/v2/prices/${coinpair}/spot`, {
        params: { date },
      })
      .then((response) => response.data.data)
      .catch((error) => error.response.data);
  }
  public getCandlestickDataFromCoinbase(
    product_id: string,
    start?: string,
    end?: string,
    granularity?: number
  ) {
    return axios
      .get(`https://api.exchange.coinbase.com/products/${product_id}/candles`, {
        params: { start, end, granularity },
      })
      .then((response) => response.data.data)
      .catch((error) => error.response.data);
  }
}
