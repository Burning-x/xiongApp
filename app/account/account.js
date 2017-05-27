/**
 * Created by admin on 2017/5/26.
 */


import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  AppRegistry,
  Text,
  TabBarIOS,
  View
} from 'react-native';

let Account = React.createClass({
  render(){
    return (
      <View style={styles.container}>
        <Text>制作页面</Text>
      </View>
    )
  }
})

const styles = {
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
}
module.exports = Account;