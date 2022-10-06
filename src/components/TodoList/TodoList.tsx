import React from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[];
  selectedTodosIds: number[];
  newTitle: string;
  isAdding: boolean;
  completedTodosIds: number[];
  handleOnChange: (id: number, data: Partial<Todo>) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
};

export const TodosList: React.FC<Props> = ({
  todos,
  selectedTodosIds,
  newTitle,
  isAdding,
  completedTodosIds,
  handleOnChange,
  onDelete,
}) => {
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
              key={todo.id}
              isAdding={isAdding}
              handleOnChange={handleOnChange}
              selectedTodosIds={selectedTodosIds}
              onDelete={onDelete}
              completedTodosIds={completedTodosIds}
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
              key={Math.random()}
              todo={{
                id: 0,
                title: newTitle,
                completed: false,
                userId: Math.random(),
              }}
              todos={todos}
              selectedTodosIds={selectedTodosIds}
              handleOnChange={handleOnChange}
              completedTodosIds={completedTodosIds}
              isAdding={isAdding}
              onDelete={onDelete}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
