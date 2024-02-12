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

  const handleDelete = async (id: number) => {
    try {
      dispatch({ type: 'setInProcess', payload: [...inProcess, id] });

      // Make API call to delete todo
      await fetch(`your-api-url/todos/${id}`, {
        method: 'DELETE',
      });

      // If successful, update local state
      const updatedTodos = todos.filter(todo => todo.id !== id);

      dispatch({ type: 'setTodos', payload: updatedTodos });
    } catch (error) {
      // Handle error
      /*eslint-disable*/
      console.error('Error deleting todo:', error);
    }
  };

  const handleChange = async (todo: Todo): Promise<void> => {
    try {
      dispatch({ type: 'setInProcess', payload: [...inProcess, todo.id] });

      // Make API call to update todo
      await fetch(`your-api-url/todos/${todo.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(todo),
      });

      // If successful, update local state
      const updatedTodos = todos
        .map((item) => (item.id === todo.id ? todo : item));

      dispatch({ type: 'setTodos', payload: updatedTodos });
    } catch (error) {
      // Handle error
      console.error('Error updating todo:', error);
    }
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          inProcess={inProcess.includes(todo.id)}
          onDelete={() => handleDelete(todo.id)}
          onChange={handleChange}
        />
      ))}
      {tempTodo && <TodoItem todo={tempTodo} inProcess />}
    </section>
  );
};
