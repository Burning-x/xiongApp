/**
 * Created by admin on 2017/5/26.
 */

import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import request from '../common/request';
import config from '../common/config';
import {
  AppRegistry,
  Text,
  ListView,
  RefreshControl,
  TouchableHighlight,
  TabBarIOS,
  Dimensions,
  Image,
  ActivityIndicator,
  View
} from 'react-native';
let width = Dimensions.get('window').width;
let cachedResults = {
  nextPage: 1,
  items: [],
  total: 0,
}
/*

let Item = React.createClass({
  getInitialState(){

  }
  render(){
    return (
      <TouchableHighlight>
        <View style={styles.item}>
          <Text style={styles.title}>
            {row.title}
          </Text>
          <Image
            style={styles.thumb}
            source={{uri:row.thumb}}>
            <Icon
              name="ios-play"
              size={28}
              style={styles.play}
            />
          </Image>
          <View style={styles.itemFooter}>
            <View style={styles.handleBox}>
              <Icon
                name="ios-heart-outline"
                size={28}
                style={styles.up}
              />
              <Text style={styles.handleText}>喜欢</Text>
            </View>
            <View style={styles.handleBox}>
              <Icon
                name="ios-chatboxes-outline"
                size={28}
                style={styles.commentIcon}
              />
              <Text style={styles.handleText}>评论</Text>
            </View>
          </View>
        </View>
      </TouchableHighlight>
    )
  }
})
*/


let List = React.createClass({
  getInitialState: function() {
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return {
      isRefreshing: false,
      dataSource: ds.cloneWithRows([]),
      isLoadingTail:false,
    };
  },
  _renderRow(row) {
    return (
      <TouchableHighlight>
        <View style={styles.item}>
          <Text style={styles.title}>
            {row.title}
          </Text>
          <Image
            style={styles.thumb}
            source={{uri:row.thumb}}>
            <Icon
              name="ios-play"
              size={28}
              style={styles.play}
            />
          </Image>
          <View style={styles.itemFooter}>
            <View style={styles.handleBox}>
              <Icon
                name="ios-heart-outline"
                size={28}
                style={styles.up}
              />
              <Text style={styles.handleText}>喜欢</Text>
            </View>
            <View style={styles.handleBox}>
              <Icon
                name="ios-chatboxes-outline"
                size={28}
                style={styles.commentIcon}
              />
              <Text style={styles.handleText}>评论</Text>
            </View>
          </View>
        </View>
      </TouchableHighlight>
    )
  },
  _fetchData(page) {
    let that = this;
    if (page !== 0 ){
      this.setState({
        isLoadingTail:true,
      })
    } else {
      this.setState({
        isRefreshing:true,
      })
    }

     request.get(config.api.base + config.api.creations, {
       accessToken: 'abc',
       page: page,
     })
      .then((data) => {
        if (data.success) {
          let items = cachedResults.items;
          if (page !==0) {
            items = items.concat(data.data);
            cachedResults.nextPage +=1;
          } else {
            items = data.data.concat(items);
          }

          cachedResults.items = items;
          cachedResults.total = data.total;
          setTimeout(function () {
            if (page !==0) {
              that.setState({
                isLoadingTail: false,
                dataSource: that.state.dataSource.cloneWithRows(cachedResults.items)
              })
            } else {
                that.setState({
                  isRefreshing: false,
                  dataSource: that.state.dataSource.cloneWithRows(cachedResults.items)
                })
            }

          },20)
        }
      })
      .catch((error) => {
        if (page !==0) {
          this.setState({
            isLoadingTail: false,
          })
        } else {
          this.setState({
            isRefreshing: false,
          })
        }
      });
  },
  componentDidMount(){
    this._fetchData(1);
  },
  _hasMore(){
    return cachedResults.items.length !== cachedResults.total;
  },
  _fetchMoreData() {
    if (!this._hasMore() || this.state.isLoadingTail) {
      return
    }
    let page = cachedResults.nextPage;
    this._fetchData(page)
  },
  _renderFooter(){
    if (!this._hasMore() && cachedResults.total !==0) {
      return (
        <View style={styles.loadingMore}>
          <Text style={styles.loadingText}>没有更多了</Text>
        </View>
      )
    }
    return <ActivityIndicator
      style={styles.loadingMore}
    />
  },
  _onRefresh() {
    if (!this._hasMore() || this.state.isRefreshing) {
      return
    }
    this._fetchData(0)
  },
  render(){
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>列表页面</Text>
        </View>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this._renderRow}
          renderFooter={this._renderFooter}
          onEndReached={this._fetchMoreData}
          enableReachedThreshold={20}
          enableEmptySections={true}
          showsVerticalScrollIndicator={false}
          automaticallyAdjustContentInsets={false}
          refreshControl={
            <RefreshControl
              refreshing={this.state.isRefreshing}
              onRefresh={this._onRefresh}
              tintColor="#ff6600"
              title="拼命加载中..."
            />
          }
        />
      </View>
    )
  }
})

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  header: {
    paddingTop: 25,
    paddingBottom:12,
    backgroundColor: '#ee735c',
  },
  headerTitle: {
    color: '#fff',
    fontSize:16,
    textAlign: 'center',
    fontWeight: '600'
  },
  item: {
    width: width,
    marginBottom: 10,
    backgroundColor: '#fff'
  },
  thumb: {
    width: width,
    height: width * 0.56,
    resizeMode: 'cover'
  },
  title: {
    padding: 10,
    fontSize: 18,
    color: '#333'
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#eee'
  },
  handleBox: {
    padding: 10,
    flexDirection: 'row',
    width: width / 2 -0.5,
    justifyContent: 'center',
    backgroundColor: '#fff'
  },
  play: {
    position: 'absolute',
    bottom: 14,
    right: 14,
    width: 46,
    height: 46,
    paddingTop: 9,
    paddingLeft: 18,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 23,
    color: '#ed7b66'
  },
  handleText: {
    paddingLeft: 22,
    color: '#333'
  },
  commentIcon: {
    fontSize:22,
    color: '#333'
  },
  loadingMore: {
    marginVertical: 20,
  },
  loadingText: {
    color: '#777',
    textAlign: 'center',
  }
}
module.exports = List;