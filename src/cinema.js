/**
 * Moudle of the cinema.
 *
 * @author Dongzhu Tan <dt222ha@student.lnu.se>
 * @version 1.1.0
 */

import fetch from 'node-fetch'

/**
 * Represents a cinema.
 */
export class Cinema {
  /**
   * The available movies information.
   *
   * @param {object} dom A dom object.
   * @param {Array} cinemaURL Cinema links to scrape.
   * @param {string} everyonesAvailableDays Everyones free day.
   * @returns {object} The array include information of each available movie object.
   */
  async availableMovies (dom, cinemaURL, everyonesAvailableDays) {
    const availableMoviesChoice = []
    let dayValue
    for (let day = 0; day <= 2; day++) {
      if (everyonesAvailableDays[day]) {
        if (everyonesAvailableDays[day] === 'friday') { dayValue = '05' }
        if (everyonesAvailableDays[day] === 'saturday') { dayValue = '06' }
        if (everyonesAvailableDays[day] === 'sunday') { dayValue = '07' }

        for (let movies = 0; movies <= 2; movies++) {
          const movieName = dom.window.document.querySelector(`#movie option[value="0${movies + 1}"]`).innerHTML // option vaule begin with 1.
          let response = await fetch(cinemaURL + `/check?day=${dayValue}&movie=0${movies + 1}`) // Fetch every movies status, day, time and movies value.
          response = await response.json()

          for (let option = 0; option <= 2; option++) {
            if (response[option].status === 1) {
              response[option].movieName = movieName
              response[option].dayValue = dayValue
              response[option].time = parseInt(response[option].time)
              availableMoviesChoice.push(response[option])
            }
          }
        }
      }
    }
    return availableMoviesChoice
  }
}
