import React from 'react';
import { Filter } from '../types/Filter';
import { Todo } from '../types/Todo';
import { SingleTodo } from './SingleTodo';
import { TempTodo } from './TempTodo';
import { Errors } from '../types/Errors';

type TodoListProps = {
  filter: Filter;
  todos: Todo[];
  handleRemove: (todoId: number) => void;
  tempTodo: Todo | null;
  deletedTodoId: number | null;
  deletedTodosId: number[];
  isAddingTodo: boolean;
  handleToggleCompleted: (id: number) => void,
  setError: (err: Errors | null) => void,
  onSubmit: () => void;
};

export const TodoList: React.FC<TodoListProps>
= ({
  filter, todos, handleRemove, setError, onSubmit,
  tempTodo, deletedTodoId, isAddingTodo, handleToggleCompleted, deletedTodosId,
}) => {
  const visibleTodos = () => {
    if (filter === 'active') {
      return todos.filter((todo) => !todo.completed);
    }

    if (filter === 'completed') {
      return todos.filter((todo) => todo.completed);
    }

    return todos;
  };

  const todosToShow = visibleTodos();

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todosToShow.map(todo => {
        return (
          <SingleTodo
            key={todo.id}
            todo={todo}
            handleRemove={handleRemove}
            deletedTodosId={deletedTodosId}
            deletedTodoId={deletedTodoId}
            handleToggleCompleted={handleToggleCompleted}
            setError={setError}
            onSubmit={onSubmit}
          />
        );
      })}

      {tempTodo
      && (
        <TempTodo
          handleRemove={handleRemove}
          tempTodo={tempTodo}
          deletedTodoId={deletedTodoId}
          isAddingTodo={isAddingTodo}
        />
      )}
    </section>
  );
};
