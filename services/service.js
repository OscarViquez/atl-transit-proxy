const request = require("request");

const requestURL = (requestEndpoint, res) => {
  request({ url: requestEndpoint }, (error, response, body) => {
    /* If Error OR status code is anything but 200 */
    if (error || response.statusCode !== 200) {
      return res.status(500).json({ type: "error", message: err.message });
    }
    /* Parse JSON */
    res.json(JSON.parse(body));
  });
};

module.exports = requestURL;
