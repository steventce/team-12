module.exports = {
  'Test Sending Request' : function (browser) {
    browser
      .url('http://localhost:3000/request')
      .pause(1000)
      .assert.visible('input[type="radio"]', 'radio buttons are visible')
      .click('input[type=radio]')
      .pause(1000)
      .assert.visible('#submitBtn', 'submit button is visible')
      .click('button[id=submitBtn]')
      .pause(5000)
      .assert.visible('.modal-content', 'confirmation modal appears')
      .assert.visible('#confirmBtn', 'confirmation button is visible')
      .click('button[id=confirmBtn]')
      .pause(5000)
      .assert.visible('.modal-content', 'success modal appears')
      .click('a[id=successBtn]')
      .end();
  }
};