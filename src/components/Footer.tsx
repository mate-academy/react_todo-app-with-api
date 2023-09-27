import { memo } from 'react';

type Props = {
  children: React.ReactNode;
};

export const Footer: React.FC<Props> = memo(({ children }) => (
  <footer className="todoapp__footer" data-cy="Footer">
    {children}
  </footer>
));
