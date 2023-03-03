import { Error } from '../../enums/Error';

export type Props = {
  setIsError: (value: Error) => void;
  isError: Error
};
