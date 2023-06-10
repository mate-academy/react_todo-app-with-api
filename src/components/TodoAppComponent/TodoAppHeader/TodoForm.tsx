import { useTodosContext } from '../../../Context/TodosContext';

export const TodoForm = () => {
  const {
    createNewTodo, tempTodo, value, setValue,
  } = useTodosContext();

  return (
    <form
      onSubmit={createNewTodo}
    >
      <input
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        disabled={!!tempTodo}
      />
    </form>
  );
};
