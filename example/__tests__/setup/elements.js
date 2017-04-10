import helper from 'tipsi-appium-helper'

const { idFromXPath, idFromAccessId, select } = helper

helper.extend('elements', () => ({
  exampleText1: idFromAccessId('exampleText1'),
  exampleText2: idFromAccessId('exampleText2'),
  exampleText3: idFromAccessId('exampleText3'),
  exampleText4: idFromAccessId('exampleText4'),
  localImage1: idFromAccessId('localImage1'),
  localImage2: idFromAccessId('localImage2'),
  localImage3: idFromAccessId('localImage3'),
  localImage4: idFromAccessId('localImage4'),
  remoteImage1: idFromAccessId('remoteImage1'),
  remoteImage2: idFromAccessId('remoteImage2'),
}))
