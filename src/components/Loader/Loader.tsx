import { Hearts } from 'react-loader-spinner';

export const Loader = () => {
  return (
    <Hearts
      height="80"
      width="80"
      color="#f3e0e0"
      ariaLabel="hearts-loading"
      visible
    />
  );
};
