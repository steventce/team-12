module.exports = {
  'Test Admin Reservations Page' : function (browser) {
    browser
      .url('http://localhost:3000/locations')
      .waitForElementVisible('body', 1000)
      .pause(1000)
      .assert.containsText('body', 'Locations')
      .assert.cssClassPresent('table', 'table')
      .end();
  }
};