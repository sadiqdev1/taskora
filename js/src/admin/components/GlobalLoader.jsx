import React from "react";

import {
  MemesManagerSkeleton,
  UsersManagerSkeleton,
  ReportsManagerSkeleton,
  SettingsViewSkeleton
} from "./Skeleton";

/* Global Loader Map */

const loaderMap = {
  dashboard: <MemesManagerSkeleton />,
  memes: <MemesManagerSkeleton />,
  users: <UsersManagerSkeleton />,
  reports: <ReportsManagerSkeleton />,
  settings: <SettingsViewSkeleton />,
  trending: <MemesManagerSkeleton />,
  notifications: <MemesManagerSkeleton />,
  feedback: <MemesManagerSkeleton />,
  help: <MemesManagerSkeleton />,
};

const GlobalLoader = ({ tab }) => {
  return loaderMap[tab] || <MemesManagerSkeleton />;
};

export default GlobalLoader;