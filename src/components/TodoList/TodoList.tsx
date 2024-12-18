import React from 'react';

import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';
import { TempTodoItem } from '../TempTodoItem/TempTodoItem';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

type Props = {
  todos: Todo[];
  onDelete: (id: number) => void;
  tempTodo: Todo | null;
  isLoadingTodo: number[];
  onUpdateTodo: (updatedTodo: Todo) => void;
  updateToggle: (toggleTodo: Todo) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  onDelete,
  tempTodo,
  isLoadingTodo,
  onUpdateTodo,
  updateToggle,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {todos.map(todo => {
          const isIncludesId = isLoadingTodo.includes(todo.id);

          return (
            <CSSTransition key={todo.id} timeout={300} classNames="item">
              <TodoItem
                todo={todo}
                onDelete={onDelete}
                isLoading={isIncludesId}
                onUpdateTodo={onUpdateTodo}
                updateToggle={updateToggle}
              />
            </CSSTransition>
          );
        })}

        {tempTodo && (
          <CSSTransition key={tempTodo.id} timeout={300} classNames="item">
            <TempTodoItem todo={tempTodo} />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
