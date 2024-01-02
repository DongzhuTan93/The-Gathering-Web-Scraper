/**
 * Moudle of the scraper-link.
 *
 * @author Dongzhu Tan <dt222ha@student.lnu.se>
 * @version 1.1.0
 */

import { createRequire } from 'module'

/**
 * Represents a link scraper.
 */
export class ScraperLink {
  /**
   * Extracts the absolute links on website.
   *
   * @param {string} url The URL of the web page to scrape.
   * @returns {string[]} The total absoult links form the begin-url.
   */
  async extractLinks (url) {
    // console.log(url)
    const require = createRequire(import.meta.url)
    const axios = require('axios')
    const cheerio = require('cheerio')

    const links = []
    await axios.get(url).then(axiosUrl => {
      const $ = cheerio.load(axiosUrl.data)

      $('li').each((index, element) => {
        const link = $(element).find('a').attr('href')
        if (link.substring(0, 5) !== 'https') {
          links.push(url + link.substring(2)) // Remove "./"
        } else {
          links.push(link)
        }
      })
    })

    return links
  }
  // I got inspiration here: https://www.youtube.com/watch?v=XX8Q_39mue4
}
