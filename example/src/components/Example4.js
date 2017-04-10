import React, { Component } from 'react'
import { Text, View, Image } from 'react-native'
import testID from '../utils/testID'

export default class Example4 extends Component {
  render() {
    return (
      <View>
        <Text {...testID('exampleText4')}>
          Babel Plugin Works on Example 4! YOU SHOULD SEE BLUE ARROW! NOT PURPLE!
        </Text>
        <Image
          style={{ width: 30, height: 48 }}
          source={require('../img/forwardButton.png')}
          {...testID('localImage4')}
        />
      </View>
    )
  }
}
