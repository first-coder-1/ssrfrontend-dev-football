import { RootStore } from "@/store";
import { isLocalhost } from "./common";
import { Alert, AlertSeverity } from "@/models/Alert";
import { useIntl } from "@/hooks/useIntl";

const firebaseConfig = {
  apiKey: "AIzaSyAPcbrBe5POpGDYanBxbICRwHZNAziGhf8",
  appId: "1:1021457340710:android:ba70e0be5d5f37d573c9e7",
  messagingSenderId: "1021457340710",
  projectId: "penalty-app---ga4-3f8dc",
};

export class PushNotifications {
  static async init() {
    const alerts = RootStore.getInstance().alerts;
    // TODO: add firebase
    const [firebaseApp, firebaseMessaging] = await Promise.all([import("firebase/app"), import("firebase/messaging")]);
    const app = firebaseApp.initializeApp(firebaseConfig);
    if (!isLocalhost()) {
      const messaging = firebaseMessaging.getMessaging(app);
      firebaseMessaging.onMessage(messaging, (payload) => {
        alerts.addAlert(
          new Alert(payload.notification?.body ?? "", AlertSeverity.success, payload.notification?.title ?? "")
        );
      });
    }
    window.addEventListener("offline", () => {
      alerts.addAlert(new Alert("Network connection is lost", AlertSeverity.error));
    });
  }

  static async getToken(serviceWorkerRegistration?: ServiceWorkerRegistration) {
    const firebaseApp = await import("firebase/messaging");
    const isSupported = await firebaseApp.isSupported();
    if (isSupported) {
      const messaging = firebaseApp.getMessaging();
      return await firebaseApp.getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_VAPID_KEY,
        serviceWorkerRegistration,
      });
    }
  }
}
