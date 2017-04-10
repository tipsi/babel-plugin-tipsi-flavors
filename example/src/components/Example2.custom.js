import React, { Component } from 'react'
import { Text, View, Image } from 'react-native'
import testID from '../utils/testID'

export default class Example2Custom extends Component {
  render() {
    return (
      <View>
        <Text {...testID('exampleText2')}>
          Babel Plugin Works on Example 2!
        </Text>
        <Image
          style={{ width: 50, height: 50 }}
          source={require('../img/custom_logo.png')}
          {...testID('localImage2')}
        />
        <Image
          style={{ width: 50, height: 50 }}
          source={{ uri: 'https://facebook.github.io/react/img/logo_og.png' }}
          {...testID('remoteImage2')}
        />
      </View>
    )
  }
}
