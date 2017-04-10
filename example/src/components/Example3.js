import React, { Component } from 'react'
import { Text, View, Image } from 'react-native'
import testID from '../utils/testID'

export default class Example3 extends Component {
  render() {
    return (
      <View>
        <Text {...testID('exampleText3')}>
          Babel Plugin Works on Example 3! YOU SHOULD SEE RED ARROW! NOT BLACK OR GREEN!
        </Text>
        <Image
          style={{ width: 30, height: 48 }}
          source={require('../img/backButton.png')}
          {...testID('localImage3')}
        />
      </View>
    )
  }
}
