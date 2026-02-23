
import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import NetInfo from 'react-native-netinfo';
import TextView from './TextView/TextView';
import { colors } from '../styles';
import { WIN_WIDTH } from '../constants/constant';

class OfflineNotice extends Component {
  sub;
  constructor(props) {
    super(props);
    this.state = {
      isConnected: true
    };
  }

  componentDidMount() {
    this.sub = NetInfo.addEventListener((stateInfo) => {
      const { isConnected } = stateInfo;
      this.setState({ isConnected });
    });
  }

  componentWillUnmount() {
    if (this.sub) this.sub();
  }

  render() {
    if (!this.state.isConnected) {
      return (
        <View style={styles.offlineContainer}>
          <TextView type={'title-one'} text={'No Internet Connection'} style={styles.offlineText} />
        </View>
      );
    }
    return null;
  }
}

const styles = StyleSheet.create({
  offlineContainer: {
    backgroundColor: colors.strongRed,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    width: WIN_WIDTH,
    position: 'absolute',
    bottom: 0
  },
  offlineText: {
    color: colors.white,
    textAlign: 'center',
    textAlignVertical: 'center'
  }
});
export default OfflineNotice;
