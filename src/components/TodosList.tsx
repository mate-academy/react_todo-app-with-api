import { FC } from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';
import { deleteTodo, updateTodo } from '../api/todos';
import { useDispatch, useSelector } from '../providers/TodosContext';
import { useError } from '../hooks/useError';

type Props = {
  todos: Todo[]
};

export const TodosList: FC<Props> = ({ todos }) => {
  const { updateTodos, tempTodo, inProcess } = useSelector();
  const dispatch = useDispatch();
  const { setError } = useError();

  const handleDeleteFromInProcess = (id: number) => {
    const idx = inProcess.findIndex((todoId) => todoId === id);

    dispatch({
      type: 'setInProcess',
      payload: [...inProcess].splice(idx, 1),
    });
  };

  const handleDelete = (id: number) => {
    dispatch({ type: 'setInProcess', payload: [...inProcess, id] });

    deleteTodo(id)
      .then(updateTodos)
      .catch(() => setError('Unable to delete a todo'))
      .finally(() => handleDeleteFromInProcess(id));
  };

  const handleChange = (todo: Todo) => {
    dispatch({ type: 'setInProcess', payload: [...inProcess, todo.id] });

    updateTodo(todo)
      .then(updateTodos)
      .catch(() => setError('Unable to update a todo'))
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
