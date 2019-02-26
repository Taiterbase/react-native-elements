import React from 'react';
import PropTypes from 'prop-types';
import {
  Text,
  View,
  TextInput,
  Animated,
  Easing,
  Platform,
  StyleSheet,
} from 'react-native';

import { nodeType, renderNode } from '../helpers';
import { fonts, withTheme, ViewPropTypes, TextPropTypes } from '../config';

import Icon from '../icons/Icon';

class Input extends React.Component {

  floatAnimationValue = new Animated.Value(this.props.value === '' ? 0 : 3);

  shakeAnimationValue = new Animated.Value(0);

  focus() {
    this.input.focus();
  }

  blur() {
    this.input.blur();
  }

  clear() {
    this.input.clear();
  }

  isFocused() {
    return this.input.isFocused();
  }

  isEmpty() {
    this.props.value === '';
  }

  shake = () => {
    const { shakeAnimationValue } = this;

    shakeAnimationValue.setValue(0);
    // Animation duration based on Material Design
    // https://material.io/guidelines/motion/duration-easing.html#duration-easing-common-durations
    Animated.timing(shakeAnimationValue, {
      duration: 375,
      toValue: 3,
      ease: Easing.bounce,
    }).start();
  };

  float = () => {
    const {floatAnimationValue} = this;
    Animated.timing(floatAnimationValue, {
      toValue: (this.isFocused() || this.props.value !== '') ? 4 : 0,
      duration: 275,
    }).start();
  };

  componentDidUpdate(){
    if(!this.isEmpty()) {
      this.float();
    }
  }

  render() {
    const {
      containerStyle,
      inputContainerStyle,
      leftIcon,
      leftIconContainerStyle,
      rightIcon,
      rightIconContainerStyle,
      inputComponent: InputComponent = TextInput,
      inputStyle,
      errorProps,
      errorStyle,
      errorMessage,
      label,
      labelStyle,
      labelProps,
      theme,
      ...attributes
    } = this.props;

    const translateX = this.shakeAnimationValue.interpolate({
      inputRange: [0, 0.5, 1, 1.5, 2, 2.5, 3],
      outputRange: [0, -15, 0, 15, 0, -15, 0],
    });

    const floatLabelStyle = theme => ({
      position: 'absolute',
      left: 0,
      marginLeft: 10,
      bottom: this.floatAnimationValue.interpolate({
        inputRange: [0, 4],
        outputRange: [-12,12]
      }),
      left: this.floatAnimationValue.interpolate({
        inputRange: [0,0.5,1,1.5,2,2.5,3,3.5,4],
        outputRange: [0,7,15,25,17.5,10,-5,-15,-30]
      }),
      fontSize: this.floatAnimationValue.interpolate({
        inputRange: [0, 4],
        outputRange: [18, 12],
      }),
      color: this.floatAnimationValue.interpolate({
        inputRange: [0, 4],
        outputRange: [theme.colors.grey3, theme.colors.grey0],
      }),
    });
    return (
      <View style={StyleSheet.flatten([{ width: '90%' }, containerStyle])}>

      <Animated.View
    style={StyleSheet.flatten([
          styles.inputContainer(theme),
          inputContainerStyle,
          { transform: [{ translateX }] },
        ])}
      >
      {leftIcon && (
      <View
    style={StyleSheet.flatten([
          styles.iconContainer,
          leftIconContainerStyle,
        ])}
      >
      {renderNode(Icon, leftIcon)}
      </View>
  )}

    {label && (
    <View>
    <Animated.Text
      {...labelProps}
      style={StyleSheet.flatten([
            floatLabelStyle(theme),
            labelStyle,
          ])}
        >
        {label}
        </Animated.Text>
        </View>
    )}

  <InputComponent
    underlineColorAndroid="transparent"
    {...attributes}
    ref={ref => (this.input = ref)}
    style={StyleSheet.flatten([styles.input, inputStyle])}
    />

    {rightIcon && (
    <View
      style={StyleSheet.flatten([
            styles.iconContainer,
            rightIconContainerStyle,
          ])}
        >
        {renderNode(Icon, rightIcon)}
        </View>
    )}
  </Animated.View>

    {!!errorMessage && (
    <Text
      {...errorProps}
      style={StyleSheet.flatten([
            styles.error(theme),
            errorStyle && errorStyle,
          ])}
        >
        {errorMessage}
        </Text>
    )}
  </View>
  );
  }
}

Input.propTypes = {
  containerStyle: ViewPropTypes.style,
  inputContainerStyle: ViewPropTypes.style,
  leftIcon: nodeType,
  leftIconContainerStyle: ViewPropTypes.style,
  rightIcon: nodeType,
  rightIconContainerStyle: ViewPropTypes.style,
  inputStyle: TextPropTypes.style,
  inputComponent: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  shake: PropTypes.any,
  errorProps: PropTypes.object,
  errorStyle: TextPropTypes.style,
  errorMessage: PropTypes.string,
  label: PropTypes.string,
  float: PropTypes.any,
  labelStyle: TextPropTypes.style,
  labelProps: PropTypes.object,
  theme: PropTypes.object,
};

const styles = {
  inputContainer: theme => ({
    flexDirection: 'row',
    borderBottomWidth: 1,
    alignItems: 'center',
    borderColor: theme.colors.grey5,
  }),
  iconContainer: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 15,
  },
  input: {
    alignSelf: 'center',
    color: 'black',
    fontSize: 18,
    marginLeft: 10,
    flex: 1,
    height: 40,
  },
  error: theme => ({
    margin: 5,
    fontSize: 12,
    color: theme.colors.error,
  }),
};

export { Input };
export default withTheme(Input, 'Input');