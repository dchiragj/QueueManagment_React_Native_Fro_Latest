import React, { Component } from 'react';
import { StyleSheet, Image } from 'react-native';
import { isEmpty } from '../../global/Helpers';
import images from '../../assets/images';

class Avatar extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  getComponentSize = (size) => {
    if (size === 'tiny') {
      return 24;
    } else if (size === 'small') {
      return 32;
    } else if (size === 'medium') {
      return 45;
    } else if (size === 'large') {
      return 48;
    } else if (size === 'giant') {
      return 80;
    } else {
      return 45;
    }
  };

  render() {
    const { size, source, style, alt } = this.props;
    const ImgSize = this.getComponentSize(size);
    return (
      <Image
        style={[
          {
            width: ImgSize,
            height: ImgSize,
            borderRadius: style && style.width ? style.width / 2 : ImgSize / 2
          },
          s.image,
          style
        ]}
        size={ImgSize}
        alt={alt}
        source={!isEmpty(source) ? { uri: source, cache: 'force-cache' } : images.noAvatar}
      />
    );
  }
}

const s = StyleSheet.create({
  image: {
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export default Avatar;
