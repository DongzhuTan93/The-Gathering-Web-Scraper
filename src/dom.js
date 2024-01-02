/**
 * A dom class moudle.
 *
 * @author Dongzhu Tan <dt222ha@student.lnu.se>
 * @version 1.1.0
 */

import { JSDOM } from 'jsdom'
import fetch from 'node-fetch'

/**
 * The main function of the application.
 *
 */
export class Dom {
  /**
   * Repersent a dom object.
   *
   * @param {string} currentURL The current URL to fetch.
   * @returns {object} The dom object to return.
   */
  async domfetch (currentURL) {
    const text = await this.#getText(currentURL)
    return new JSDOM(text)
  }

  /**
   * Gets the plain text from an URL.
   *
   * @param {string} cinemaURLs - URL to get text content from.
   * @returns {string} The content as plain text.
   */
  async #getText (cinemaURLs) {
    const response = await fetch(cinemaURLs)
    return response.text()
    // I got inspiration here: https://gitlab.lnu.se/1dv026/content/exercises/module-a/exercise-promising-web-scraper/-/blob/solution/src/link-scraper.js
  }
}
