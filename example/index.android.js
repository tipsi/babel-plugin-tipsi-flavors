import React, { Component } from 'react'
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import Example from './src/components/Example'
import Example2 from './src/components/Example2'
import Example3 from './src/components/Example3'
import Example4 from './src/components/Example4'

export default class example extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Example />
        <Example2 />
        <Example3 />
        <Example4 />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
})

AppRegistry.registerComponent('example', () => example)
