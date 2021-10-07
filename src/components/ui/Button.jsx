import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import Spinner from './Spinner';

function Button(props) {
  const {
    block,
    disabled,
    ghost,
    icon,
    offset,
    loading,
    size,
    type,
    onClick,
    children,
    disableFocus,
    ...other
  } = props;

  const display = block ? 'flex' : 'inline-flex';
  const focusClasses = !disableFocus
    ? `focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-${offset} focus:ring-pink-600`
    : '';

  const className = `${display} items-center border shadow-sm font-sans font-medium ${focusClasses} ${props?.classes}`;

  const typeClasses = {
    default: `border-gray-700 text-gray-300 bg-${offset} hover:bg-white-5`,
    primary: 'border-transparent text-white bg-pink-600 hover:bg-pink-700'
  };

  const ghostClasses = {
    default: `border-white text-white bg-transparent hover:border-primary hover:text-primary`,
    primary:
      'border-pink-600 text-pink-600 bg-transparent hover:border-pink-700 hover:text-pink-700'
  };

  const sizeClasses = {
    small: 'text-xs rounded px-2.5 py-1.5',
    medium: 'text-sm rounded-md px-4 py-2',
    default: 'text-base rounded-md px-4 py-2',
    large: 'text-base px-6 py-3',
    responsive: 'text-sm lg:text-base rounded-md px-4 py-2'
  };

  const disabledClasses = 'opacity-25 pointer-events-none cursor-not-allowed';

  const spinnerStyle =
    size === 'small'
      ? {
          size: 1,
          classes: cn({
            'mr-3': icon,
            'mr-2': !icon
          })
        }
      : size === 'medium'
      ? {
          size: 1.25,
          classes: cn({
            'mr-5': icon,
            'mr-4': !icon
          })
        }
      : {
          size: 1.33,
          classes: cn({
            'mr-5': icon,
            'mr-4': !icon
          })
        };

  return (
    <button
      type="button"
      className={cn(className, {
        [typeClasses.default]: type === 'default' && !ghost,
        [typeClasses.primary]: type === 'primary' && !ghost,
        [ghostClasses.default]: type === 'default' && ghost,
        [ghostClasses.primary]: type === 'primary' && ghost,
        [sizeClasses.small]: size === 'small',
        [sizeClasses.medium]: size === 'medium',
        [sizeClasses.default]: size === 'default',
        [sizeClasses.large]: size === 'large',
        [sizeClasses.responsive]: size === 'responsive',
        [disabledClasses]: disabled
      })}
      onClick={onClick}
      {...other}
    >
      {loading && (
        <Spinner
          className={spinnerStyle.classes}
          size={spinnerStyle.size}
          color="white"
        />
      )}
      {icon && React.cloneElement(icon, { className: '-ml-1 mr-2' })}
      {children}
    </button>
  );
}

Button.propTypes = {
  block: PropTypes.bool,
  disabled: PropTypes.bool,
  ghost: PropTypes.bool,
  icon: PropTypes.element,
  loading: PropTypes.bool,
  offset: PropTypes.string,
  size: PropTypes.oneOf(['small', 'medium', 'default', 'large', 'responsive']),
  type: PropTypes.oneOf(['default', 'primary']),
  onClick: PropTypes.func,
  children: PropTypes.node.isRequired
};

Button.defaultProps = {
  block: false,
  disabled: false,
  ghost: false,
  loading: false,
  offset: 'black',
  size: 'default',
  type: 'default',
  onClick: () => {}
};

export default Button;
