import helper from 'tipsi-appium-helper'

const { idFromXPath, idFromAccessId, select } = helper

helper.extend('elements', () => ({
  title: select({
    ios: idFromXPath(`
      /XCUIElementTypeApplication/XCUIElementTypeWindow/XCUIElementTypeOther/
      XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther/
      XCUIElementTypeOther/XCUIElementTypeStaticText[1]
    `),
    android: idFromAccessId('title'),
  }),
  exampleText1: select({
    ios: idFromXPath(`
      /XCUIElementTypeApplication/XCUIElementTypeWindow/XCUIElementTypeOther/
      XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther/
      XCUIElementTypeOther[1]/XCUIElementTypeStaticText
    `),
    android: idFromAccessId('exampleText1'),
  }),
  exampleText2: select({
    ios: idFromXPath(`
      /XCUIElementTypeApplication/XCUIElementTypeWindow/XCUIElementTypeOther/
      XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther/
      XCUIElementTypeOther[2]/XCUIElementTypeStaticText
    `),
    android: idFromAccessId('exampleText2'),
  }),
  localImage1: select({
    ios: idFromXPath(`
      /XCUIElementTypeApplication/XCUIElementTypeWindow/XCUIElementTypeOther/
      XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther/
      XCUIElementTypeOther[1]/XCUIElementTypeImage
    `),
    android: idFromAccessId('localImage1'),
  }),
  localImage2: select({
    ios: idFromXPath(`
      /XCUIElementTypeApplication/XCUIElementTypeWindow/XCUIElementTypeOther/
      XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther/
      XCUIElementTypeOther[2]/XCUIElementTypeImage
    `),
    android: idFromAccessId('localImage2'),
  }),
  remoteImage1: idFromAccessId('remoteImage1'),
  remoteImage2: idFromAccessId('remoteImage2'),
}))
