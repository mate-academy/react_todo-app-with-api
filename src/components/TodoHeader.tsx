import React from 'react';
import { TodoForm } from './TodoForm/TodoForm';
import { Todo } from '../types/Todo';

type Props = {
  activeTodos: Todo[],
  setTodoTitle: (value: string) => void,
  todoTitle: string,
  addNewTodo: (title: string) => void,
  onUpdateAllTodos: (completed: boolean) => void,
};

export const TodoHeader: React.FC<Props> = ({
  activeTodos,
  setTodoTitle,
  todoTitle,
  addNewTodo,
  onUpdateAllTodos,
}) => (
  <header className="todoapp__header">
    {activeTodos.length > 0
      && (
        <button
          type="button"
          className="todoapp__toggle-all active"
          onClick={() => onUpdateAllTodos}
          aria-label="toggle-all-todos"
        />
      )}

    <TodoForm
      setTodoTitle={setTodoTitle}
      todoTitle={todoTitle}
      onAdd={addNewTodo}
    />
  </header>
);
