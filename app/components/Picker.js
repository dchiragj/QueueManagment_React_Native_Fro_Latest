import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types'
import { StyleSheet, View, Picker as RPicker, ViewPropTypes, Platform, Modal } from 'react-native';
import TextView from './TextView/TextView';
import { indent, borderWidth, lessIndent, borderRadius } from '../styles/dimensions';
import { colors } from '../styles';
import { Touchable } from './Button';
import Icon from './Icon';
import { verticalScale } from 'react-native-size-matters';

class Picker extends Component {
  constructor(props) {
    super(props);
    this.isBorderBottom = this.props.isBorderBottom || true;
    this.state = {
      isVisibleModal: false
    };
  }
  componentDidMount() {
    const { selectedValue, data = [], itemKeyField, itemValueField } = this.props;
    if (Platform.OS == 'ios') {
      if (selectedValue && data) {
        //Get object by id to show its details
        let item = data.find((x) => x[itemKeyField] == selectedValue);
        if (item) this.setPickerLabelIOS(item[itemValueField]);
        else this.setPickerLabelIOS();
      } else this.setPickerLabelIOS();
    }
  }
  onToggleModal = () => {
    this.setState({ isVisibleModal: !this.state.isVisibleModal });
  };
  setPickerLabelIOS = (value) => {
    this.setState({ selecedValueLabelIOS: value });
  };
  render() {
    const {
      data = [],
      label,
      labelStyle,
      pickerInputStyle,
      enabled = true,
      isLeftIcon = false,
      leftIconName = 'search'
    } = this.props;

    if (Platform.OS == 'android') {
      return (
        <View style={[s.wrapper, this.props.containerStyle]}>
          {isLeftIcon && <Icon name={leftIconName} color={colors.primary} size={20} style={s.leftIconStyle} />}
          {!!label && <TextView style={labelStyle} text={label} type={'body-one'} color={colors.white} />}
          <RPicker
            enabled={enabled}
            selectedValue={this.props.selectedValue}
            style={s.androidPicker}
            onValueChange={this.props.onValueChange}
            {...this.props}>
            {data.map((item, index) => {
              return (
                <RPicker.Item
                  key={`${item[this.props.itemKeyField]}_${index}`}
                  label={item[this.props.itemValueField]}
                  value={item[this.props.itemKeyField]}
                />
              );
            })}
          </RPicker>
        </View>
      );
    } else {
      return (
        <View style={this.props.containerStyle}>
          <View style={[s.inputWrapper, this.props.style, pickerInputStyle]}>
            {!!label && <TextView style={labelStyle} text={label} type={'body-one'} />}
            <Touchable onPress={this.onToggleModal} disabled={!enabled}>
              <View style={s.SelectButton}>
                {!this.state.selecedValueLabelIOS ? (
                  <TextView type={'body'} text={this.props.label} style={s.IOSPlaceholder} />
                ) : null}
                <TextView
                  text={this.state.selecedValueLabelIOS}
                  numberOfLines={1}
                  type={'body'}
                  style={s.selectedValue}
                />
                <Icon name={'chevron-down'} color={colors.gray} size={20} style={s.pickerArrow} />
              </View>
            </Touchable>
          </View>
          <Modal
            animationType='fade'
            transparent={true}
            visible={this.state.isVisibleModal}
            onRequestClose={this.onToggleModal}>
            <View
              style={{
                flex: 1,
                backgroundColor: 'rgba(0,0,0,0.5)'
              }}>
              <Touchable onPress={this.onToggleModal} style={s.IOSCloseBtn} />
              <View
                style={{
                  backgroundColor: colors.white,
                  width: '100%',
                  zIndex: 99,
                  marginTop: 'auto'
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-end'
                  }}>
                  <Touchable
                    style={{
                      padding: 0
                    }}
                    onPress={() => {
                      //show selected value in label
                      if (this.props.selectedValue && this.props.data) {
                        //Get object by id to show its details
                        let item = this.props.data.find((x) => x[this.props.itemKeyField] == this.props.selectedValue);
                        if (item) this.setPickerLabelIOS(item[this.props.itemValueField]);
                        else this.setPickerLabelIOS();
                      } else this.setPickerLabelIOS();

                      this.onToggleModal();
                    }}>
                    <TextView text={'Select'} type={'body'} style={s.selectText} />
                  </Touchable>
                </View>
                <RPicker
                  selectedValue={this.props.selectedValue}
                  onValueChange={this.props.onValueChange}
                  {...this.props}>
                  {this.props.data.map((item) => {
                    return (
                      <RPicker.Item
                        key={item[this.props.itemKeyField]}
                        label={item[this.props.itemValueField]}
                        value={item[this.props.itemKeyField]}
                      />
                    );
                  })}
                </RPicker>
              </View>
            </View>
          </Modal>
        </View>
      );
    }
  }
}
Picker.propTypes = {
  containerStyle: ViewPropTypes.object,
  style: ViewPropTypes.object,
  selectedValue: PropTypes.any,
  onValueChange: PropTypes.func.isRequired,
  data: PropTypes.any.isRequired,
  itemKeyField: PropTypes.string.isRequired,
  itemValueField: PropTypes.string.isRequired,
  isVisibleModal: PropTypes.bool,
  onToggleModal: PropTypes.func,
  onSelectIOS: PropTypes.func,
  selecedValueLabelIOS: PropTypes.string
};

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, {})(Picker);

const s = StyleSheet.create({
  wrapper: {
    flex: 0,
    backgroundColor: colors.inputBackgroundColor,
    borderRadius: borderRadius,
    paddingLeft: 40
  },
  androidPicker: {
    height: 65,
    color: colors.white
  },
  leftIconStyle: {
    position: 'absolute',
    left: 20,
    top: 23
  },
  labelStyle: {
    left: 10
  },
  buttonSelect: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center'
  },
  inputWrapper: {
    borderBottomWidth: borderWidth,
    borderBottomColor: colors.borderColor,
    marginVertical: lessIndent,
    ...Platform.select({
      ios: {
        flex: 0
      }
    })
  },
  pickerArrow: {
    ...Platform.select({
      ios: {
        marginTop: 4,
        marginLeft: 'auto'
      }
    })
  },
  SelectButton: {
    flex: 0,
    paddingVertical: lessIndent,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  selectedValue: {
    marginRight: 'auto'
  },
  selectText: {
    paddingTop: indent,
    paddingRight: indent,
    color: colors.primary
  },
  IOSCloseBtn: {
    flexBasis: '100%',
    flexGrow: 0,
    flexShrink: 0
  },
  IOSPlaceholder: {
    color: colors.gray
  }
});
