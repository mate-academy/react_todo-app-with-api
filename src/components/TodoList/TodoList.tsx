import React, { useState } from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

type Props = {
  todos: Todo[];
  removeTodo: (id: number) => Promise<void>;
  tempTodo: Todo | null;
  isLoading?: boolean | string;
  renameTodo: (id: number, newTitle: string) => Promise<void>;
  toggleTodo: (id: number) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  removeTodo,
  tempTodo,
  isLoading,
  renameTodo,
  toggleTodo,
}) => {
  const [deletingTodoId, setDeletingTodoId] = useState<number | null>(null);
  const [updatingTodoId, setUpdatingTodoId] = useState<number | null>(null);
  const [togglingTodoId, setTogglingTodoId] = useState<number | null>(null);

  const handleRemoveTodo = (id: number) => {
    setDeletingTodoId(id);

    return removeTodo(id);
  };

  const handleUpdateTodo = (id: number, newTitle: string): Promise<void> => {
    setUpdatingTodoId(id);

    return renameTodo(id, newTitle);
  };

  const handleToggleTodo = (id: number) => {
    setTogglingTodoId(id);
    toggleTodo(id);
  };

  const allCompleted = todos.every(todo => todo.completed);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {todos.map(todo => (
          <CSSTransition key={todo.id} timeout={300} classNames="item">
            <TodoItem
              key={todo.id}
              todo={todo}
              removeTodo={handleRemoveTodo}
              isLoading={
                (isLoading === 'deleting' && deletingTodoId === todo.id) ||
                (isLoading === 'completed' && !todo.completed) ||
                (isLoading === 'updating' && updatingTodoId === todo.id) ||
                (isLoading === 'togglingAll' &&
                  ((allCompleted && todo.completed) ||
                    (!allCompleted && !todo.completed))) ||
                (isLoading === 'toggling' && togglingTodoId === todo.id)
              }
              renameTodo={handleUpdateTodo}
              toggleTodo={handleToggleTodo}
            />
          </CSSTransition>
        ))}
        {tempTodo && (
          <CSSTransition key={tempTodo.id} timeout={300} classNames="item">
            <TodoItem
              todo={tempTodo}
              removeTodo={handleRemoveTodo}
              isLoading={isLoading === 'adding'}
              renameTodo={handleUpdateTodo}
              toggleTodo={() => {}}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
