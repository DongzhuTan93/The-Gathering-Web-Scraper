/**
 * Moudle of the restaurant.
 *
 * @author Dongzhu Tan <dt222ha@student.lnu.se>
 * @version 1.1.0
 */
import fetch from 'node-fetch'
import jsdom from 'jsdom'
const { JSDOM } = jsdom

/**
 * Represents a restaurant.
 */
export class Restaurant {
  /**
   * Available restaurant boking time.
   *
   * @param {object} dom The dom object.
   * @param {string} restaurantURL The restaurants url.
   * @returns {Array} A array conatin avabile boking time.
   */
  async availableTableTime (dom, restaurantURL) {
    const login = Array.from(dom.window.document.querySelectorAll('form[action^="./"]')).map(Element => Element.action)
    // I got inspiration here: https://gitlab.lnu.se/1dv026/content/exercises/module-a/exercise-promising-web-scraper/-/blob/solution/src/link-scraper.js
    const loginLink = `${restaurantURL}${login[0].slice(2)}`
    const responseBeforeLogin = await fetch(loginLink, {
      headers: {
        'content-type': 'application/json'
      },
      method: 'POST',
      redirect: 'manual',
      body: JSON.stringify({ // Login with users name and password
        username: 'zeke',
        password: 'coys',
        submit: 'login'
      })
    })

    const responseAfterLogin = await fetch(`${restaurantURL}${responseBeforeLogin.headers.get('location')}`, { // Login in URL
      headers: {
        cookie: responseBeforeLogin.headers.get('set-cookie').substring(0, responseBeforeLogin.headers.get('set-cookie').indexOf(';'))
      }
    })

    const restaurantHTML = await responseAfterLogin.text()
    const restaurantDom = new JSDOM(restaurantHTML)
    const avaibleTable = Array.from(restaurantDom.window.document.querySelectorAll('input'))
      .map(element => element.value).slice(0, -1) // The last value of the array is not required.
    // console.log(avaibleTable)
    return avaibleTable
  }

  /**
   * Available reserved table items sorted.
   *
   * @param {Array} avaibleTable A array contain the avaible table information.
   * @returns {object} A object contain the avaible table information.
   */
  async sortTable (avaibleTable) {
    const suitableTable = []
    for (let i = 0; i < avaibleTable.length; i++) {
      const suitableTableObject = {} // Sort suitable table information and arrange them in a object.
      suitableTableObject.day = avaibleTable[i].slice(0, 3)
      suitableTableObject.startTime = avaibleTable[i].slice(3, 5)
      suitableTableObject.endTime = avaibleTable[i].slice(5)
      suitableTable.push(suitableTableObject)
    }
    // console.log(suitableTable)
    return suitableTable
  }

  /**
   * Get the exact booking time based on everyone's free time and the movie's free time.
   *
   * @param {Array} suitableTable A array contain free table.
   * @param {string} movieSuggestion A array contain movie suggestion.
   * @returns {object} The object contain the free table.
   */
  async considerTableTobook (suitableTable, movieSuggestion) {
    const avaibleMoviesAndTables = []
    for (let table = 0; table < suitableTable.length; table++) {
      for (let movie = 0; movie < movieSuggestion.length; movie++) {
        if (suitableTable[table].day === 'fri' && movieSuggestion[movie].day === '05' && (suitableTable[table].startTime - movieSuggestion[movie].time >= 2)) {
          avaibleMoviesAndTables.push({ day: movieSuggestion[movie].day = 'friday', movie: movieSuggestion[movie].movieName, movieBegin: movieSuggestion[movie].time, tableBeginTime: suitableTable[table].startTime, tableEndTime: suitableTable[table].endTime }) // Combine all the suibile information to an object.
        } if (suitableTable[table].day === 'sat' && movieSuggestion[movie].day === '06' && (suitableTable[table].startTime - movieSuggestion[movie].time >= 2)) {
          avaibleMoviesAndTables.push({ day: movieSuggestion[movie].day = 'saturday', movie: movieSuggestion[movie].movieName, movieBegin: movieSuggestion[movie].time, tableBeginTime: suitableTable[table].startTime, tableEndTime: suitableTable[table].endTime })
        } if (suitableTable[table].day === 'sun' && movieSuggestion[movie].day === '07' && (suitableTable[table].startTime - movieSuggestion[movie].time >= 2)) {
          avaibleMoviesAndTables.push({ day: movieSuggestion[movie].day = 'sunday', movie: movieSuggestion[movie].movieName, movieBegin: movieSuggestion[movie].time, tableBeginTime: suitableTable[table].startTime, tableEndTime: suitableTable[table].endTime })
        }
      }
    }
    // console.log(avaibleMoviesAndTables)
    return avaibleMoviesAndTables
  }
}
