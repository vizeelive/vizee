import config from 'config';
import React, { useEffect, useState } from 'react';
import logger from 'logger';
import { Button, notification } from 'antd';

let url = `${config.ui}/version.txt`;

export default function VersionChecker() {
  const [version, setVersion] = useState(null);

  useEffect(() => {
    async function getData() {
      let current = await (await fetch(url)).text();
      logger.info(`Latest version: ${current}`);
      setVersion(current);
    }
    getData();
  }, []);

  useEffect(() => {
    var interval;
    async function getData() {
      if (process.env.NODE_ENV === 'development') {
        return;
      }
      interval = setInterval(async () => {
        let latest = await (await fetch(url)).text();
        if (version !== latest) {
          setVersion(latest);
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
    }
    getData();

    return () => clearInterval(interval);
  }, [version]);

  return null;
}
