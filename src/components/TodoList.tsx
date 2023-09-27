import { memo } from 'react';

type Props = {
  children: React.ReactNode;
};

export const TodoList: React.FC<Props> = memo(({ children }) => (
  <section className="todoapp__main" data-cy="TodoList">
    {children}
  </section>
));
