import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { verticalScale, scale } from 'react-native-size-matters';
import { borderRadius } from '../styles/dimensions';
import { colors } from '../styles';
import Typography from '../styles/Typography';
import Icon from './Icon';
import TextView from './TextView/TextView';
import moment from 'moment';

const DatePicker = ({
  containerStyle,
  selectedDate = new Date(),
  placeholder = "Select Date",
  onDateChange,
  label,
  isLabel = true,
  format = 'DD MMM YYYY',
  disabled = false,
  ...props
}) => {
  const [show, setShow] = useState(false);

  const onChange = (event, date) => {
    setShow(Platform.OS === 'ios');
    if (date) {
      onDateChange(date);
    }
  };

  const displayText = selectedDate
    ? moment(selectedDate).format(format)
    : placeholder;

  return (
    <View style={[s.datePickerWrap, containerStyle]}>
      {isLabel && label && (
        <TextView text={label} type="body-one" style={{ marginBottom: verticalScale(8) }} />
      )}

      <TouchableOpacity
        style={[s.datePicker, disabled && s.disabled]}
        onPress={() => !disabled && setShow(true)}
        disabled={disabled}
        activeOpacity={0.7}
      >
        <TextView
          text={displayText}
          type="body-one"
          style={{
            color: selectedDate ? colors.white : colors.lightWhite,
          }}
        />
        <Icon
          name="calendar"
          size={24}
          color={colors.primary}
          isFeather={true}
          style={s.datePickerIcon}
        />
      </TouchableOpacity>

      {show && (
        <DateTimePicker
          value={selectedDate || new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onChange}
          {...props}
        />
      )}
    </View>
  );
};

const s = StyleSheet.create({
  datePickerWrap: {
    marginVertical: verticalScale(10),
  },
  datePicker: {
    height: scale(50),
    backgroundColor: colors.inputBackgroundColor,
    borderRadius: borderRadius,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale(15),
  },
  datePickerIcon: {
    opacity: 0.7,
  },
  disabled: {
    opacity: 0.6,
  },
});

export default DatePicker;