import { Dispatch, SetStateAction } from 'react';

export type NotificationProps = {
  error: string;
  setError: Dispatch<SetStateAction<string>>;
};
