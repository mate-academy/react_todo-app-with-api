export const ToDoCounter:React.FC<{ active:number }> = ({ active }) => (
  <span className="todo-count" data-cy="TodosCounter">
    {`${active} items left`}
  </span>
);
