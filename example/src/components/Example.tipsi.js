import React, { Component } from 'react'
import { Text, View, Image } from 'react-native'
import testID from '../utils/testID'

export default class ExampleTipsi extends Component {
  render() {
    return (
      <View>
        <Text {...testID('exampleText1')}>
          Babel Plugin Works on Example 1!
        </Text>
        <Image
          style={{ width: 50, height: 50 }}
          source={require('../img/tipsi_logo.png')}
          {...testID('localImage1')}
        />
        <Image
          style={{ width: 50, height: 50 }}
          source={{ uri: 'https://facebook.github.io/react/img/logo_og.png' }}
          {...testID('remoteImage1')}
        />
      </View>
    )
  }
}
