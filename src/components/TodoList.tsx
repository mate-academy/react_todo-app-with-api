type Props = {
  children: React.ReactNode;
};

export const TodoList: React.FC<Props> = ({ children }) => (
  <section className="todoapp__main" data-cy="TodoList">
    {children}
  </section>
);
