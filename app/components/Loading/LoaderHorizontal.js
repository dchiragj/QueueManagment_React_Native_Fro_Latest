import React, { Component } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { colors } from '../../styles';
import { DotIndicator } from 'react-native-indicators';

class LoaderHorizontal extends Component {
  constructor(props) {
    super(props);
    this.state = { spinAnim: new Animated.Value(0) };
  }

  render() {
    const { spinnerColor = colors.borderColor, spinnerDotSize = 8, containerStyle = {} } = this.props;
    return (
      <View style={[s.container, containerStyle]}>
        <DotIndicator color={spinnerColor || 'rgb(255, 255, 255)'} size={spinnerDotSize} count={4} {...this.props} />
      </View>
    );
  }
}

const s = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.3)',
    zIndex: 999,
    minHeight: 15
  }
});

export default LoaderHorizontal;
