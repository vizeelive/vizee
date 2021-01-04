import config from 'config';
import React, { useEffect, useState } from 'react';
import logger from 'logger';
import { Button, notification } from 'antd';

export default function VersionChecker() {
  const [version, setVersion] = useState(null);
  const [didPrintVersion, setDidPrintVersion] = useState(false);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      return;
    }
    let interval = setInterval(async () => {
      let latest = await (await fetch(`${config.ui}/version.txt`)).text();
      if (!didPrintVersion) {
        logger.info(`Latest version: ${latest}`);
        setDidPrintVersion(true);
      }
      setVersion(latest);
      if (!version && version !== latest) {
        notification.open({
          message: `A new version is available!`,
          duration: 0,
          icon: `🎉`,
          btn: (
            <Button
              type="primary"
              size="small"
              onClick={() => window.location.reload()}
            >
              Reload
            </Button>
          )
        });
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [version]);

  return null;
}
