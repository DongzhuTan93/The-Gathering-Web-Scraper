/**
 * Where the application starts.
 *
 * @author Dongzhu Tan <dt222ha@student.lnu.se>
 * @version 1.1.0
 */

import { Application } from './application.js'

/**
 * The main function of the application.
 *
 */
const main = async () => {
  try {
    // Save the the third element in the array(given the adress at the console.log with npm start). In this case it´s the start URL of the webbsite that want to scrape from.
    const beginURL = process.argv[2]
    // console.log(process.argv)
    // if you want to see the console.log it works with input web adress: (npm start https://courselab.lnu.se/scraper-site-1) and (npm start https://courselab.lnu.se/scraper-site-2)

    // Run the actual application.
    const application = new Application(beginURL)
    await application.run()
  } catch (error) {
    console.error(error.message)
  }
}

main()
