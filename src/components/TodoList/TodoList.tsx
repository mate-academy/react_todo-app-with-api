import React, { useState } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

import '../../styles/transitiongroup.scss';

type Props = {
  todos: Todo[];
  isAdding: boolean;
  selectedTodosIds: number[];
  newTitle: string,
  onDelete: (id: number[]) => void;
  onUpdate: (
    name: string,
    type: string,
    value: string | boolean,
    id: number[],
  ) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  isAdding,
  selectedTodosIds,
  newTitle,
  onDelete,
  onUpdate,
}) => {
  const [selectedTodoId, setSelectedTodoId] = useState(0);

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
              todos={todos}
              selectedTodosIds={selectedTodosIds}
              selectedTodoId={selectedTodoId}
              onDelete={onDelete}
              onUpdate={onUpdate}
              setSelectedTodoId={setSelectedTodoId}
            />
          </CSSTransition>
        ))}
        {isAdding && (
          <CSSTransition
            key={0}
            timeout={300}
            classNames="temp-item"
          >
            <TodoItem
              todo={{
                id: Math.random(),
                title: newTitle,
                completed: false,
                userId: Math.random(),
              }}
              isAdding={isAdding}
              onDelete={() => {}}
              onUpdate={() => {}}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
