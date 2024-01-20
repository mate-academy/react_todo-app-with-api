import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';
import { deleteTodo, updateTodo } from '../api/todos';
import { useDispatch, useSelector } from '../providers/TodosContext';
import { useError } from '../hooks/useError';
import { ActionType } from '../types/ActionType';
import { Errors } from '../types';

type Props = {
  todos: Todo[]
};

export const TodosList: React.FC<Props> = ({ todos }) => {
  const { updateTodos, tempTodo, inProcess } = useSelector();
  const dispatch = useDispatch();
  const { setError } = useError();

  const handleDeleteFromInProcess = (id: number) => {
    const idx = inProcess.findIndex((todoId) => todoId === id);

    dispatch({
      type: ActionType.SetInProcess,
      payload: [...inProcess].splice(idx, 1),
    });
  };

  const handleDelete = (id: number) => {
    dispatch({
      type: ActionType.SetInProcess,
      payload: [...inProcess, id],
    });

    deleteTodo(id)
      .then(updateTodos)
      .catch(() => setError(Errors.UnableDelete))
      .finally(() => handleDeleteFromInProcess(id));
  };

  const handleChange = (todo: Todo) => {
    dispatch({
      type: ActionType.SetInProcess,
      payload: [...inProcess, todo.id],
    });

    return updateTodo(todo)
      .then(updateTodos)
      .catch(() => setError(Errors.UnableUpdate))
      .finally(() => handleDeleteFromInProcess(todo.id));
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          inProcess={inProcess.includes(todo.id)}
          onDelete={handleDelete}
          onChange={handleChange}
        />
      ))}
      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          inProcess
        />
      )}
    </section>
  );
};
