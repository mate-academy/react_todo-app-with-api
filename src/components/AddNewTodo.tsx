import React, { useState } from 'react';
import { postTodos } from '../api/todos';
import { Todo } from '../types/Todo';
import { USER_ID } from '../api/userId';
import { ErrorType } from '../types/ErrorType';

type AddNewTodoProps = {
  showErrorNotification: (error: string) => void,
  setIsAddingNewTodo: React.Dispatch<React.SetStateAction<boolean>>,
  isAddingNewTodo: boolean,
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  todos: Todo[],
  setLoadingActiveTodoId: React.Dispatch<React.SetStateAction<number[]>>,
};

const findMaxId = (todos: Todo[]): number => {
  return Math.max(...todos.map(todo => todo.id));
};

export const AddNewTodo: React.FC<AddNewTodoProps> = ({
  showErrorNotification,
  setIsAddingNewTodo,
  isAddingNewTodo,
  setTodos,
  setLoading,
  todos,
  setLoadingActiveTodoId,
}) => {
  const [newTodoTitle, setNewTodoTitle] = useState<string>('');

  const handleNewTodoSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newTodoTitle) {
      showErrorNotification(ErrorType.TitleTodoError);

      return;
    }

    const prevTodos = [...todos];

    try {
      setLoading(true);
      setIsAddingNewTodo(true);
      const tempTodo: Todo = {
        id: 0,
        userId: USER_ID,
        title: newTodoTitle,
        completed: false,
      };

      setLoadingActiveTodoId(prev => [...prev, findMaxId(todos) + 1]);
      setTodos(prev => [...prev, {
        id: findMaxId(todos) + 1,
        userId: USER_ID,
        title: newTodoTitle,
        completed: false,
      }]);

      await postTodos(USER_ID, tempTodo);
    } catch (error) {
      showErrorNotification(ErrorType.AddTodosError);
      setTodos(prevTodos);
    } finally {
      setIsAddingNewTodo(false);
      setLoading(false);
      setLoadingActiveTodoId([]);
      setNewTodoTitle('');
    }
  };

  return (
    <form onSubmit={handleNewTodoSubmit}>
      <input
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={newTodoTitle}
        onChange={(e) => setNewTodoTitle(e.target.value)}
        disabled={isAddingNewTodo}
      />
    </form>
  );
};
