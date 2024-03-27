import React, { useState } from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

type Props = {
  todos: Todo[];
  removeTodo: (id: number) => Promise<void>;
  tempTodo: Todo | null;
  isLoading?: boolean;
  renameTodo: (id: number, newTitle: string) => Promise<void>;
  toggleTodo: (id: number) => Promise<void>;
  isToggleAllLoading: boolean;
  isClearCompletedLoading: boolean;
};

export const TodoList: React.FC<Props> = ({
  todos,
  removeTodo,
  tempTodo,
  isLoading,
  renameTodo,
  toggleTodo,
  isToggleAllLoading,
  isClearCompletedLoading,
}) => {
  const [deletingTodoId, setDeletingTodoId] = useState<number | null>(null);
  const [updatingTodoId, setUpdatingTodoId] = useState<number | null>(null);
  const [togglingTodoId, setTogglingTodoId] = useState<number | null>(null);

  const handleRemoveTodo = async (id: number) => {
    setDeletingTodoId(id);
    await removeTodo(id);

    return setDeletingTodoId(null);
  };

  const handleUpdateTodo = async (
    id: number,
    newTitle: string,
  ): Promise<void> => {
    setUpdatingTodoId(id);
    await renameTodo(id, newTitle);

    return setUpdatingTodoId(null);
  };

  const handleToggleTodo = async (id: number) => {
    setTogglingTodoId(id);
    await toggleTodo(id);

    return setTogglingTodoId(null);
  };

  const isAllCompleted = todos.every(todo => todo.completed);

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
                (isLoading && deletingTodoId === todo.id) ||
                (isLoading && updatingTodoId === todo.id) ||
                (isLoading && togglingTodoId === todo.id) ||
                (isToggleAllLoading &&
                  ((isAllCompleted && todo.completed) ||
                    (!isAllCompleted && !todo.completed))) ||
                (isClearCompletedLoading && todo.completed)
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
              isLoading={tempTodo !== null}
              renameTodo={handleUpdateTodo}
              toggleTodo={() => {}}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
