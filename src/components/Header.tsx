import { memo } from 'react';

type Props = {
  children: React.ReactNode;
};

export const Header: React.FC<Props> = memo(({ children }) => (
  <header className="todoapp__header">
    {children}
  </header>
));
