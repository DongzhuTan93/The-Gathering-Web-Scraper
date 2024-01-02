/**
 * Moudle of the calender.
 *
 * @author Dongzhu Tan <dt222ha@student.lnu.se>
 * @version 1.1.0
 */

import { createRequire } from 'module'

/**
 * Represents a available calender.
 */
export class Calender {
  /**
   * Everyone´s available days.
   *
   * @param {Array} calenderURLs Everyones calenders links to scrape.
   * @returns {Array} Everyone's available days 'ok' state.
   */
  async availableDays (calenderURLs) {
    const require = createRequire(import.meta.url)
    const axios = require('axios')
    const cheerio = require('cheerio')

    const eachoneAvailableStatus = []
    await axios.get(calenderURLs).then(axiosUrl => {
      const $ = cheerio.load(axiosUrl.data)

      $('td').each((index, element) => {
        eachoneAvailableStatus.push($(element).text().toLowerCase())
      })
    })

    return eachoneAvailableStatus

    // I got inspiration here: https://stackoverflow.com/questions/31949521/scraping-text-with-cheerio
  }

  /**
   * Represents the same available days of everyone.
   *
   * @param {Array} days A array with everyone´s available days.
   * @returns {Array} Return an array that contain the same available days of everyone.
   */
  compareDays (days) {
    const everyonesAvailableDays = []

    if (days[0][0] === 'ok' && days[1][0] === 'ok' && days[2][0] === 'ok') {
      everyonesAvailableDays.push('friday')
    }

    if (days[0][1] === 'ok' && days[1][1] === 'ok' && days[2][1] === 'ok') {
      everyonesAvailableDays.push('saturday')
    }

    if (days[0][2] === 'ok' && days[1][2] === 'ok' && days[2][2] === 'ok') {
      everyonesAvailableDays.push('sunday')
    }

    // console.log('Everyone is free on : ' + everyonesAvailableDays + '!')
    return everyonesAvailableDays
  }
}
