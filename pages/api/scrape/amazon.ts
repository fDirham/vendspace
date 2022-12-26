import { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'node-fetch';
import { JSDOM } from 'jsdom';

export const config = {
  runtime: 'nodejs',
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const { url } = req.body;
    if (!url) {
      throw 'No url';
    }

    try {
      const fetchRes = await fetch(url, {
        headers: {
          accept:
            'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
          'accept-language': 'en-US,en;q=0.9',
          'cache-control': 'no-cache',
          'device-memory': '8',
          downlink: '10',
          dpr: '1',
          ect: '4g',
          pragma: 'no-cache',
          rtt: '50',
          'sec-ch-device-memory': '8',
          'sec-ch-dpr': '1',
          'sec-ch-ua': '"Not?A_Brand";v="8", "Chromium";v="108"',
          'sec-ch-ua-mobile': '?1',
          'sec-ch-ua-platform': '"Android"',
          'sec-ch-viewport-width': '375',
          'sec-fetch-dest': 'document',
          'sec-fetch-mode': 'navigate',
          'sec-fetch-site': 'same-origin',
          'sec-fetch-user': '?1',
          'upgrade-insecure-requests': '1',
          'viewport-width': '375',
          'user-agent':
            'Mozilla/5.0 (Linux; U; Android 4.4.2; en-us; SCH-I535 Build/KOT49H) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30',
        },
        method: 'GET',
      });

      const data = await fetchRes.text();

      const dom = new JSDOM(data, {});
      const { window } = dom;
      const { document } = window;

      let titleEl = document.querySelector('#title');
      if (!titleEl || !titleEl.textContent)
        throw 'Scrape failed! Title not found.';
      const name = cleanScrapedTitle(titleEl.textContent);

      const priceEl = document.querySelector(
        'span.priceToPay span.a-offscreen'
      );

      const price =
        priceEl && priceEl.textContent ? priceEl.textContent.trim() : '';

      const main = document.querySelector('div#immersive-main');
      const imageSrcs: string[] = [];
      if (main) {
        const carouselCards = main.querySelectorAll('li.a-carousel-card');
        carouselCards.forEach((el) => {
          const imgTag = el.querySelector('img');
          if (imgTag) {
            const src = imgTag.getAttribute('src');
            if (src && !imageSrcs.includes(src)) imageSrcs.push(src);
          }
        });
      }

      res.status(200).json({ name, price, imageSrcs });
    } catch (error) {
      res.status(500).json({ error });
    }
  } else {
    res.status(404);
  }
}

function cleanScrapedTitle(title: string) {
  let toReturn = title.replaceAll(/(\r\n|\n|\r|\t)/gm, '');
  const splitTitle = toReturn.split(' ');
  toReturn = '';
  splitTitle.forEach((part) => {
    if (part != '') {
      toReturn += part + ' ';
    }
  });
  toReturn = toReturn.trim();
  return toReturn;
}
