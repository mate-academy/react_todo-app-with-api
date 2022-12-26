import React, { useContext } from 'react';
import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group';

import { AuthContext } from '../Auth/AuthContext';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[];
  isAdding: boolean;
  onDelete: (id: number) => void;
  onRename: (todo: Todo, newTitle: string) => Promise<void>;
  onUpdate: (todo: Todo) => void;
  loadingTodoIds: number[];
  currentTitle: string;
};

export const TodoList: React.FC<Props> = ({
  todos,
  isAdding,
  onDelete,
  onRename,
  onUpdate,
  loadingTodoIds,
  currentTitle,
}) => {
  const user = useContext(AuthContext);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {todos.map(todo => (
          <CSSTransition
            key={todo.id}
            timeout={300}
            classNames="item"
          >
            <TodoItem
              todo={todo}
              onDelete={onDelete}
              onRename={onRename}
              onUpdate={onUpdate}
              isLoading={loadingTodoIds.includes(todo.id)}
            />
          </CSSTransition>
        ))}

        {isAdding && user && (
          <CSSTransition
            key={0}
            timeout={300}
            classNames="temp-item"
          >
            <TodoItem
              todo={{
                id: 0,
                title: currentTitle,
                completed: false,
                userId: user?.id,
              }}
              onDelete={onDelete}
              onRename={onRename}
              onUpdate={onUpdate}
              isLoading
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
