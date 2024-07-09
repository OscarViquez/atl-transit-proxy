// Third-party Library Imports
require("dotenv").config();

// Cherrio is a library that allows you to parse HTML content using jQuery-like syntax.
const cheerio = require("cheerio");

/**
 * Fetches the balance information for a given transit card number by making a POST request to the BreezeCard balance endpoint.
 *
 * @param {string} cardNumber - The card number for which the balance information is being fetched.
 * @returns {Promise<string>} A promise that resolves with the HTML content of the balance information page as a string.
 *
 * This function constructs a POST request with the card number as part of the request body. It sends this request to the
 * BreezeCard balance endpoint, handling both successful and unsuccessful network responses. On success, it returns the HTML
 * content of the response. On failure, it throws an error indicating that the network response was not OK.
 */

async function getCardDetails(cardNumber) {
  try {
    const html = await fetchBalance(cardNumber);
    const details = await parseHTMLFromEndpoint(html);
    return details;
  } catch (error) {
    console.error(
      `Error fetching or parsing card details for card number ${cardNumber}:`,
      error
    );
    throw error;
  }
}

/**
 * Asynchronously fetches the balance information for a specified transit card from the BreezeCard service.
 *
 * This function sends a POST request to the BreezeCard balance endpoint with the card number included in the request body.
 * It uses specific request headers and credentials to mimic a form submission from the official BreezeCard balance check webpage.
 *
 * @param {string} cardNumber - The transit card number for which balance information is being requested.
 * @returns {Promise<string>} A promise that resolves to the HTML content of the balance information page as a string.
 *
 * The function ensures that the response from the server is checked for a successful HTTP status before attempting to read the response body.
 * If the response is not successful (i.e., the `ok` property of the response is `false`), the function throws an error indicating that the network response was not OK.
 *
 * Usage of this function requires handling the promise it returns, either through `await` in an async function or using `.then()` and `.catch()` for promise chaining.
 */

async function fetchBalance(cardNumber) {
  const response = await fetch(process.env.BREEZECARD_BALANCE_ENDPOINT, {
    credentials: "include",
    headers: {
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.5",
      "Content-Type": "application/x-www-form-urlencoded",
      "Upgrade-Insecure-Requests": "1",
      "Sec-Fetch-Dest": "document",
      "Sec-Fetch-Mode": "navigate",
      "Sec-Fetch-Site": "same-origin",
      "Sec-Fetch-User": "?1",
    },
    referrer: process.env.BREEZECARD_BALANCE_ENDPOINT_REFERRER,
    body: `cardnumber=${cardNumber}&submitButton.x=41&submitButton.y=4`,
    method: "POST",
    mode: "cors",
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return response.text();
}

/**
 * Parses the HTML content from the BreezeCard balance endpoint to extract relevant card details.
 * @param {string} htmlContent - The HTML content of the balance information page.
 * @returns {Promise<object>} A promise that resolves with an object containing the extracted card details.

 * The function uses Cheerio to parse the HTML content and extract the relevant details based on the structure of the page.
 * It resolves with an object containing the extracted information.
 */

const parseHTMLFromEndpoint = (htmlContent) => {
  return new Promise((resolve, reject) => {
    try {
      // Load the HTML content into cheerio to enable jQuery-like syntax for parsing
      const $ = cheerio.load(htmlContent);

      // Define a helper function to get trimmed text from a specified selector and index
      const getText = (selector, eq = 0) => $(selector).eq(eq).text().trim();

      // Extract text related to balance protection and hotlisted status
      const balanceAndHotlistedText = getText("td.Content_bold");

      // Determine if the card's balance is protected
      const balanceProtected = balanceAndHotlistedText.includes(
        "Is your card Balance Protected ? : No"
      )
        ? "No"
        : "Yes";

      // Determine the hotlisted status of the card
      const hotlistedStatus = balanceAndHotlistedText.includes(
        "Hotlisted Status : No"
      )
        ? "No"
        : "Yes";

      // Extract and format the card expiration date
      const cardExpirationDate = getText("td.Content_bold", 1).replace(
        "Your card will expire on : ",
        ""
      );

      // Extract the product name
      const productName = getText("td.Content_normal_black");

      // Extract the product expiration date
      const productExpireDate = getText("td.Content_normal_black", 1);

      // Extract the number of remaining rides
      const remainingRides = getText("td.Content_normal_black", 2);

      // Concatenate and extract the stored value information
      const storedValue = getText("tr.Content_bold", 3) + getText("td", 1);

      // Resolve the promise with an object containing all the extracted information
      resolve({
        balanceProtected,
        hotlistedStatus,
        cardExpirationDate,
        productName,
        productExpireDate,
        remainingRides,
        storedValue,
      });
    } catch (error) {
      throw new Error(`Error parsing HTML content: ${error.message}`);
    }
  });
};

module.exports = { fetchBalance, getCardDetails, parseHTMLFromEndpoint };
