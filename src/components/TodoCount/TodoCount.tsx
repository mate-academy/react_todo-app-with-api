interface Props {
  count: number;
}

export const TodoCount: React.FC<Props> = ({ count }) => {
  return (
    <span className="todo-count">
      {`${count} items left`}
    </span>
  );
};
