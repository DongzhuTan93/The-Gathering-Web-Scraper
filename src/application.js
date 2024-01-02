/**
 * Moudle of the application.
 *
 * @author Dongzhu Tan <dt222ha@student.lnu.se>
 * @version 1.1.0
 */

import { ScraperLink } from './scraper-link.js'
import validator from 'validator'
import { Calender } from './calender.js'
import { Cinema } from './cinema.js'
import { Dom } from './dom.js'
import { Restaurant } from './restaurant.js'

/**
 * Represents a application.
 */
export class Application {
    /**
     * The URL to scrape.
     *
     */
    #currentURL

    /**
     * Initializes a new instance of the Application class.
     *
     * @param {string[]} beginURL The URL we typed in the terminal to be scrape links from.
     *
     */
    constructor (beginURL) {
      this.#currentURL = beginURL
    }

    /**
     * Get the scrape URL.
     *
     * @returns {string[]} The URL to scrape.
     */
    get currentURL () {
      return this.#currentURL
    }

    /**
     * Set the scrape URL and validate the URL.
     *
     */
    set currentURL (urls) {
      if (!urls) {
        throw new Error('There´s no urls!')
      }

      if (!validator.isURL(urls)) {
        throw new Error(`This "${urls}" is not a valid URL!`)
      }

      this.#currentURL = urls
    }

    /**
     * Scraped links from URLs and run the appliation.
     *
     * @returns {string} The avabile day.
     */
    async run () {
      const scraperLink = new ScraperLink()
      const startPageURLs = await scraperLink.extractLinks(this.#currentURL)
      console.log('Scraping links...ok')

      // Calender
      this.#currentURL = await scraperLink.extractLinks(startPageURLs[0])
      const availbeStaus = []
      const calender = new Calender()
      for (let i = 0; i < this.#currentURL.length; i++) {
        const personAvabileDays = await calender.availableDays(this.#currentURL[i])
        availbeStaus.push(personAvabileDays)
      }

      this.everyonesAvailableday = calender.compareDays(availbeStaus)
      console.log('Scraping available days...OK')

      // Cinema
      this.#currentURL = startPageURLs[1]
      this.movieSuggestion = await this.availableMovies()
      console.log('Scraping showtimes...OK')

      // Restaurant
      this.#currentURL = startPageURLs[2]
      this.checkRestaurantAvaible = await this.availableTableTime()
      this.sortTableInformation = await this.sortTableObject()
      const suitableTableToBook = await this.considerTable()
      console.log('Scraping possible reservations...OK')

      // Suggestions
      console.log('\nSuggestions')
      console.log('-----------------------------------')
      console.log('')
      for (let i = 0; i < suitableTableToBook.length; i++) {
        console.log(`* On ${suitableTableToBook[i].day}, "${suitableTableToBook[i].movie}" begins at ${suitableTableToBook[i].movieBegin}: 00, and there is a free table to book between ${suitableTableToBook[i].tableBeginTime}:00 - ${suitableTableToBook[i].tableEndTime}:00.`)
      }
    }

    /**
     * Fetch avabile URL .
     *
     * @returns {object} A object inclouds avabile movies.
     */
    async fetchAvabileURL () {
      return await new Dom().domfetch(this.#currentURL)
    }

    /**
     * Check the avaible movies.
     *
     * @returns {object} A object contain avaible movies information.
     */
    async availableMovies () {
      return new Cinema().availableMovies(await this.fetchAvabileURL(), this.#currentURL, this.everyonesAvailableday)
    }

    /**
     * Fetch restaurang's webb page content and convert it to a dom object.
     *
     * @returns {object} A object contain avaible table information.
     */
    async availableTableTime () {
      return new Restaurant().availableTableTime(await this.fetchAvabileURL(), this.#currentURL)
    }

    /**
     * Available reserved table items sorted.
     *
     * @returns {object}  A object contain sort table information.
     */
    async sortTableObject () {
      return new Restaurant().sortTable(this.checkRestaurantAvaible)
    }

    /**
     * Get suitable table for everyone.
     *
     * @returns {object} An object contain suitable free table according to available movies and available time..
     */
    async considerTable () {
      return new Restaurant().considerTableTobook(this.sortTableInformation, this.movieSuggestion)
    }
}
