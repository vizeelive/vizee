import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

const Uppy = require('@uppy/core');
const Dashboard = require('@uppy/dashboard');
const Transloadit = require('@uppy/transloadit');

require('@uppy/core/dist/style.css');
require('@uppy/dashboard/dist/style.css');

function FileUpload(props) {
  let options = {
    allowedFileTypes: [],
    ...props.options
  };

  useEffect(() => {
    // https://uppy.io/docs/uppy/
    let uppy = Uppy({
      autoProceed: true,
      restrictions: {
        allowedFileTypes: options.allowedFileTypes,
        maxNumberOfFiles: 1
      }
    });
    uppy
      .use(Dashboard, {
        proudlyDisplayPoweredByUppy: false,
        inline: true,
        height: 300,
        target: `#${props.id}`
      })
      .use(Transloadit, {
        waitForEncoding: true,
        params: {
          auth: {
            key: '8bdbe3f0094411e8b3d39d32ebb2adcd'
          },
          template_id: '501179da5d274eb8ae42379c61bdd1e5'
        }
      })
      .on('transloadit:complete', (stepName) => {
        props.success(stepName);
      })
      .on('upload-error', (stepName) => {
        props.error(stepName);
      });
    return () => uppy.close();
  }, [options.allowedFileTypes, props]);

  return <div id={props.id} className="dashboard" />;
}

FileUpload.propTypes = {
  success: PropTypes.func.isRequired,
  error: PropTypes.func.isRequired
};

export default React.memo(FileUpload);
