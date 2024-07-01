// import intl from "react-intl-universal";
import { useEffect } from "react";

const INIT_DELAY = 1000; // 10 sec

export const useDelayedInit = () => {
  /**
   * TODO: rewrite
   */
  useEffect(() => {
    setTimeout(() => {
      Promise.all([
        import("@/utils/wss"),
        import("@/utils/pushNotifications"),
        // import("@/serviceWorkerRegistration"),
      ]).then(
        ([
          { WebSocketClient },
          { PushNotifications },
          // serviceWorkerRegistration
        ]) => {
          WebSocketClient.init();
          PushNotifications.init();
          // serviceWorkerRegistration.register({
          //   onUpdate: () => {
          //     if (window.confirm(`${intl.get(`pwa-update`)}`)) {
          //       window.location.reload();
          //     }
          //   },
          // });
        }
      );
    }, INIT_DELAY);
  }, []);
};
