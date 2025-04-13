import { FC } from "react";
import { Spinner } from "@heroui/spinner";

interface LoaderProps {
  message?: string;
}

export const Loader: FC<LoaderProps> = ({ message = "Loading..." }) => {
  return (
    <div className="flex h-full flex-col items-center justify-center space-y-4 p-4 dark:text-slate-300">
      <Spinner variant="wave" color="warning" />
      <p>{message}</p>
    </div>
  );
};
