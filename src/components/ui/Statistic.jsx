import React from 'react';
import PropTypes from 'prop-types';

export default function Statistic(props) {
  return (
    <div className="bg-gray-900 overflow-hidden shadow rounded-lg">
      <div className="p-6 sm:p-5 xl:p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">{props.icon}</div>
          <div className="ml-6 sm:ml-5 xl:ml-6 w-0 flex-1">
            <dl>
              <dt className="text-base sm:text-sm xl:text-base font-medium text-gray-500 truncate">
                {props.name}
              </dt>
              <dd>
                <div className="text-2xl sm:text-lg xl:text-2xl font-medium text-gray-200">
                  {props.value}
                </div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
      {props.label && (
        <div className="bg-gray-950 px-5 py-3">
          <div className="text-sm">
            <div className="font-medium text-pink-600 hover:text-pink-800">
              {props.label}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

Statistic.propTypes = {
  name: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  label: PropTypes.string,
  icon: PropTypes.object
};
