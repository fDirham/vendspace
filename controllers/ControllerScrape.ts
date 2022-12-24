import axios from 'axios';
import {
  API_URL,
  MAX_ITEM_VISUALS,
  MAX_LENGTH_ITEM_NAME,
  MAX_LENGTH_ITEM_PRICE,
} from 'utilities/constants';
import { ScrapedItemData } from 'utilities/types';

export default class ControllerScrape {
  static async scrapeAmazonItem(url: string) {
    try {
      if (!url.includes('a.co') && !url.includes('amazon.com')) {
        return { isError: true, data: 'Not an amazon link' };
      }
      const scrapeRes = await axios.post(`${API_URL}/scrape/amazon`, { url });
      const scrapedData = { ...scrapeRes.data, url } as ScrapedItemData;
      scrapedData.name = scrapedData.name.substring(0, MAX_LENGTH_ITEM_NAME);
      scrapedData.price = scrapedData.price.substring(0, MAX_LENGTH_ITEM_PRICE);
      scrapedData.imageSrcs = scrapedData.imageSrcs.slice(0, MAX_ITEM_VISUALS);

      return {
        isError: false,
        scrapedData: { ...scrapeRes.data, url } as ScrapedItemData,
      };
    } catch (err) {
      return { isError: true, data: err };
    }
  }
}
