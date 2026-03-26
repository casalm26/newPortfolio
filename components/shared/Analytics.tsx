import { Analytics as VercelAnalytics } from "@vercel/analytics/react";

import { siteConfig } from "@/data/config/site.settings";

export const AnalyticsWrapper = () => {
  if (siteConfig.disableAnalytics) {
    return <></>;
  }

  return <VercelAnalytics />;
};
