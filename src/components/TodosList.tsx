import { FC } from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';
import { useDispatch, useSelector } from '../providers/TodosContext';

type Props = {
  todos: Todo[]
};

export const TodosList: FC<Props> = ({ todos }) => {
  const { tempTodo, inProcess } = useSelector();
  const dispatch = useDispatch();

  const handleDelete = (id: number) => {
    dispatch({ type: 'setInProcess', payload: [...inProcess, id] });

    const updatedTodos = todos.filter(todo => todo.id !== id);

    dispatch({ type: 'setTodos', payload: updatedTodos });
  };

  const handleChange = (todo: Todo): Promise<void> => {
    return new Promise((resolve) => {
      dispatch({ type: 'setInProcess', payload: [...inProcess, todo.id] });

      // Assuming todos is the array of todos in your local state

      const updatedTodos = todos.map(item => (
        item.id === todo.id ? todo : item));

      dispatch({ type: 'setTodos', payload: updatedTodos });

      // Resolve the promise to indicate the operation is successful
      resolve();

      // If there are any further state updates or actions needed based on the change operation, you can do it here

      // Optionally, you can handle any further actions like removing from inProcess or displaying errors
      // handleDeleteFromInProcess(todo.id);
      // setError('Unable to update a todo');
    });
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
