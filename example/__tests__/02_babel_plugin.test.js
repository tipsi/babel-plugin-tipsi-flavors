import test from 'tape-async'
import helper from 'tipsi-appium-helper'

const { driver, elements } = helper

test('Test if Babel plugin works on React-Native', async (t) => {
  const screen = elements()

  try {
    await driver.waitForVisible(screen.exampleText1, 60000)
    const exampleText1 = await driver.getText(screen.exampleText1)
    t.equal(exampleText1, 'Babel Plugin Works on Example 1!', 'Title 1 is correct')

    await driver.waitForVisible(screen.localImage1, 5000)
    t.pass('Black react logo (local) is visible')

    await driver.waitForVisible(screen.remoteImage1, 5000)
    t.pass('Black react logo (remote) is visible')

    // Example 2
    await driver.waitForVisible(screen.exampleText2, 5000)
    const exampleText2 = await driver.getText(screen.exampleText2)
    t.equal(exampleText2, 'Babel Plugin Works on Example 2!', 'Title 2 is correct')

    await driver.waitForVisible(screen.localImage2, 5000)
    t.pass('Black react logo 2 (local) is visible')

    await driver.waitForVisible(screen.remoteImage2, 5000)
    t.pass('Black react logo 2 (remote) is visible')

    // Example 3
    await driver.waitForVisible(screen.exampleText3, 5000)
    const exampleText3 = await driver.getText(screen.exampleText3)
    t.equal(
      exampleText3,
      'Babel Plugin Works on Example 3! YOU SHOULD SEE RED ARROW! NOT BLACK OR GREEN!',
      'Title 3 is correct'
    )

    await driver.waitForVisible(screen.localImage3, 5000)
    t.pass('Red arrow is visible')

    // Example 4
    await driver.waitForVisible(screen.exampleText4, 5000)
    const exampleText4 = await driver.getText(screen.exampleText4)
    t.equal(
      exampleText4,
      'Babel Plugin Works on Example 4! YOU SHOULD SEE BLUE ARROW! NOT PURPLE!',
      'Title 4 is correct'
    )

    await driver.waitForVisible(screen.localImage4, 5000)
    t.pass('Blue arrow is visible')

  } catch (error) {
    await helper.screenshot()
    await helper.source()

    throw error
  }
})
