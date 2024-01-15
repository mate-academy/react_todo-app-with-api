import { UserWarning } from './UserWarning';
import { AppContainer } from './AppContainer';

const USER_ID = 12121;

export const App = () => {
  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <AppContainer />
  );
};
