module.exports = {
  'Test All Reservations Page' : function (browser) {
    browser
      .url('http://localhost:3000/resources')
      .waitForElementVisible('body', 1000)
      .pause(1000)
      .assert.containsText('body', 'Resources')
      .assert.cssClassPresent('table', 'table')
      .end();
  }
};