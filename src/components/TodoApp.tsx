import { useState } from 'react';
import TodoItem from './TodoItem';
import { Todo } from '../types/Todo';
import { updateTodo, updateTodoApi, removeTodo } from '../api/todos';

interface TodoAppProps {
  todos: Todo[];
  isEdit: number | null;
  isLoader: boolean;
  setIsLoader: React.Dispatch<React.SetStateAction<boolean>>;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setIsEdit: React.Dispatch<React.SetStateAction<number | null>>;
  setErr: React.Dispatch<React.SetStateAction<string>>;
  clickOut: React.RefObject<HTMLDivElement>;
}

const TodoApp = ({
  todos,
  isEdit,
  setIsEdit,
  isLoader,
  setIsLoader,
  setTodos,
  setErr,
  clickOut,
}: TodoAppProps) => {
  const [inputValue] = useState('');
  const [editValue, setEditValue] = useState(inputValue);
  const handleDelete = async (id: number) => {
    try {
      setIsLoader(true);
      const newTodos = todos.filter(todo => {
        return todo.id !== id;
      });

      await removeTodo(id);

      setTodos(newTodos);
    } catch (error) {
      /* eslint-disable-next-line no-console */
      console.error(error);
      setErr('Unable to delete a todo');
    } finally {
      setIsLoader(false);
    }
  };

  const handleUpdate = async (id: number) => {
    const todo = todos.find(t => t.id === id);

    if (!todo) {
      return;
    }

    try {
      setIsLoader(true);
      await updateTodoApi(id, { title: editValue });

      setTodos(prevTodos =>
        prevTodos.map(t => (t.id === id ? { ...t, title: editValue } : t)),
      );
    } catch (error) {
      /* eslint-disable-next-line no-console */
      console.error(error);
      setErr('Unable to update todo');
    } finally {
      setIsLoader(false);
    }
  };

  const checkTodo = async (id: number) => {
    const todo = todos.find(t => t.id === id);

    if (!todo) {
      return;
    }

    const completed = !todo?.completed;

    try {
      setIsLoader(true);
      await updateTodo(id, { completed });

      setTodos(prevTodos =>
        prevTodos.map(t => (t.id === id ? { ...t, completed } : t)),
      );
    } catch (error) {
      /* eslint-disable-next-line no-console */
      console.error(error);
      setErr('Unable to update todo');
    } finally {
      setIsLoader(false);
    }
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {/* This is a completed todo */}
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          isEdit={isEdit}
          isLoader={isLoader}
          handleDelete={handleDelete}
          handleUpdate={handleUpdate}
          setEditValue={setEditValue}
          setIsEdit={setIsEdit}
          checkTodo={checkTodo}
          editValue={editValue}
          clickOut={clickOut}
        />
      ))}
    </section>
  );
};

export default TodoApp;
