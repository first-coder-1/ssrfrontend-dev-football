// import { useMst } from "@/store";
// import { useEffect } from "react";

// const ADS_INTERVAL = +(process.env.NEXT_PUBLIC_ADS_REFRESH_INTERVAL || 600000);

export const useAdvertisement = (id: string) => {
  /**
	 * TODO: implement mobx store;
	 * 
	 *  const { auth, settings } = useMst();
			const visible = settings.thirdPartyCookies && !auth.hasReferrals;

			useEffect(() => {
				if (visible) {
					const interval = setInterval(() => {
						import("react-dfp/lib/manager").then((module) => {
							module.default.refresh(id);
						});
					}, ADS_INTERVAL);

					return () => clearInterval(interval);
				}
			}, [id, visible]);

			return visible;
	 */

  return true;
};
