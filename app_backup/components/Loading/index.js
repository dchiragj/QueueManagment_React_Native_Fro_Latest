import React from 'react';
import { View, SafeAreaView, StyleSheet, ActivityIndicator } from 'react-native';
import { scale } from 'react-native-size-matters';
import { colors } from '../../styles';
import Typography from '../../styles/Typography';
import { indent } from '../../styles/dimensions';
import AppStyles from '../../styles/AppStyles';
import TextView from '../TextView/TextView';

const Loading = ({ isTransparent, text = 'Loading...' }) => {
  if (isTransparent) {
    return (
      <View style={s.overlayContainer}>
        <View style={s.loadingBox}>
          <ActivityIndicator size="large" color={colors.primary} />
          <TextView style={[s.textStyle, { color: colors.white }]} text={text} />
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={AppStyles.root}>
      <View style={s.container}>
        <ActivityIndicator size="large" color={colors.primary} />
        <TextView style={[s.textStyle]} text={text} />
      </View>
    </SafeAreaView>
  );
};

const s = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.3)',
    zIndex: 999
  },
  overlayContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 9999
  },
  loadingBox: {
    backgroundColor: 'rgba(0,0,0,0.8)',
    padding: scale(20),
    borderRadius: scale(15),
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: scale(120)
  },
  textStyle: {
    marginVertical: indent,
    color: colors.dustRodeo,
    ...Typography.bodyOne
  }
});

export default Loading;
