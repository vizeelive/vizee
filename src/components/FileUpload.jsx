import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

const Uppy = require('@uppy/core');
const Dashboard = require('@uppy/dashboard');
const Transloadit = require('@uppy/transloadit');
const ImageEditor = require('@uppy/image-editor');
const GoogleDrive = require('@uppy/google-drive');

require('@uppy/core/dist/style.css');
require('@uppy/dashboard/dist/style.css');
import '@uppy/image-editor/dist/style.css';

function FileUpload(props) {
  let options = {
    allowedFileTypes: [],
    aspectRatio: props.aspectRatio || null,
    autoOpenFileEditor: props.autoOpenFileEditor || false,
    ...props.options
  };

  useEffect(() => {
    // https://uppy.io/docs/uppy/
    let uppy = Uppy({
      autoProceed: false,
      restrictions: {
        allowedFileTypes: options.allowedFileTypes,
        maxNumberOfFiles: 1
      }
    });
    uppy
      .use(Dashboard, {
        theme: 'dark',
        proudlyDisplayPoweredByUppy: false,
        inline: true,
        height: 300,
        target: `#${props.id}`,
        autoOpenFileEditor: options.autoOpenFileEditor
      })
      .use(GoogleDrive, {
        target: Dashboard,
        companionUrl: Transloadit.COMPANION,
        companionAllowedHosts: Transloadit.COMPANION_PATTERN
      })
      .use(ImageEditor, {
        target: Dashboard,
        quality: 0.8,
        cropperOptions: {
          aspectRatio: options.aspectRatio,
          viewMode: 1,
          background: false,
          autoCropArea: 1,
          responsive: true
        },
        actions: {
          cropSquare: false,
          cropWidescreen: false,
          cropWidescreenVertical: false
        }
      })
      .use(Transloadit, {
        waitForEncoding: true,
        params: {
          auth: {
            key: '8bdbe3f0094411e8b3d39d32ebb2adcd'
          },
          template_id: process.env.REACT_APP_TRANSLOADIT_TEMPLATE
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
