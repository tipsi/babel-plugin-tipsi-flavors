import React, { Component } from 'react'
import { Text, View, Image } from 'react-native'

export default class Example extends Component {
  render() {
    return (
      <View>
        <Text>Something Wrong!</Text>
        <Text>Plugin does not see FLAVORS variable</Text>
        <Image
          style={{ width: 50, height: 50 }}
          source={require('../img/logo.jpg')}
        />
      </View>
    )
  }
}
