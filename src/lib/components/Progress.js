import React, { Component } from 'react';
import styled, { keyframes } from 'styled-components';

const rotate = strokeDashoffset => keyframes`
  0% {
    transform: rotate(${strokeDashoffset}deg);
  }
  50% {
    transform: rotate(${strokeDashoffset * 1.5}deg);
  }
  100% {
    transform: rotate(${strokeDashoffset * 2}deg);
  }
`;

const dash = strokeDashoffset => keyframes`
0% {
    stroke-dashoffset: ${strokeDashoffset};
}
50% {
    stroke-dashoffset: ${strokeDashoffset * 1.5};
}
100% {
    stroke-dashoffset: ${strokeDashoffset};
}
`;

const Svg = styled.svg`
  &.animate {
    animation: ${props => rotate(props.strokeDashoffset)}
      ${props => props.loadingDuration} linear infinite;
  }

  circle {
    fill: none;
    &.animate {
      animation: ${props => dash(props.strokeDashoffset)}
        ${props => props.loadingDuration} ease-in-out infinite;
    }
  }
`;

const Text = styled.text`
  text-anchor: middle;
  dominant-baseline: central;
  fill: ${props => props.theme.colors.primary};
  font-size: 5rem;
  font-size: ${props => props.size};
`;

const BackgroundCircle = styled.circle`
  stroke: ${props => props.theme.colors.grey};
`;

const ProgressCircle = styled.circle`
  stroke: ${props => props.theme.colors.primary};
  stroke-dasharray: 1100;
  stroke-dashoffset: ${props => props.strokeDashoffset || '110'};
  transition: ${props =>
    `stroke-dashoffset ${props.animationDuration} ease-out`};
`;

const radius = 175;
const diameter = Math.round(Math.PI * radius * 2);
const getOffset = (val = 0) => Math.round(((100 - val) / 100) * diameter);

class Progress extends Component {
  constructor(props) {
    super(props);
    this.state = {
      progress: 0,
    };
    if (props.progress) {
      setTimeout(() => {
        this.setState({ progress: props.progress });
      }, 200);
    }
  }

  text() {
    const {
      size,
      progress,
      showPercentage,
      textColor,
      textStyle,
      percentSpacing,
      showPercentageSymbol,
    } = this.props;
    if (!showPercentage || !progress) return;

    return (
      <Text size={size} style={textStyle} x={radius} y={radius}>
        {progress}
        {showPercentageSymbol ? '%' : ''}
      </Text>
    );
  }

  render() {
    const text = this.text();
    const {
      progress,
      size,
      bgColor,
      progressColor,
      lineWidth,
      animate,
      animationDuration,
      loadingDuration,
      roundedStroke,
      responsive,
      onAnimationEnd,
      style,
      className,
    } = this.props;
    const strokeDashoffset = getOffset(this.state.progress || 0);
    const transition = animate
      ? `stroke-dashoffset ${animationDuration} ease-out`
      : null;
    const strokeLinecap = roundedStroke ? 'round' : 'butt';
    const svgSize = responsive ? '100%' : size;

    console.log(progress);

    return (
      <Svg
        width={svgSize}
        height={svgSize}
        viewBox="-25 -25 400 400"
        strokeDashoffset={strokeDashoffset}
        loadingDuration={loadingDuration}
        className={progress === undefined ? 'animate' : 'progress'}
        style={style}
      >
        <BackgroundCircle cx="175" cy="175" r="175" strokeWidth={lineWidth} />
        <ProgressCircle
          transform="rotate(-90 175 175)"
          cx="175"
          cy="175"
          r="175"
          strokeWidth={lineWidth}
          strokeLinecap={strokeLinecap}
          onTransitionEnd={onAnimationEnd}
          className={progress === undefined ? 'animate' : 'progress'}
          animationDuration={animationDuration}
          strokeDashoffset={strokeDashoffset}
        />
        {text}
      </Svg>
    );
  }
}

Progress.defaultProps = {
  animate: true,
  animationDuration: '1s',
  loadingDuration: '3s',
  showPercentage: true,
  showPercentageSymbol: true,
  size: 100,
  lineWidth: 30,
  percentSpacing: 10,
  roundedStroke: true,
};

export default Progress;