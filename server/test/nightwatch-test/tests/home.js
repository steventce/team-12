module.exports = {
  'Test Home Page' : function (browser) {
    browser
      .url('http://localhost:3000')
      .waitForElementVisible('body', 1000)
      .pause(1000)
      .assert.containsText('body', 'Your Current Reservations')
      .assert.cssClassPresent('table', 'table')
      .end();
  }
};