import React, { useEffect, useState } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Filter } from '../../types/Filter';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type Props = {
  todos: Todo[]
  selectedFilter: string
  newTitleTodo: string
  userId: number | null
  isAdding: boolean
  isDeletedComplete: boolean
  onSetIsError: React.Dispatch<React.SetStateAction<boolean>>
  onSetTypeError: React.Dispatch<React.SetStateAction<string>>
  toLoad:() => Promise<void>
};

export const TodoList: React.FC<Props> = ({
  todos,
  selectedFilter,
  newTitleTodo,
  userId,
  isAdding,
  isDeletedComplete,
  onSetIsError,
  onSetTypeError,
  toLoad,
}) => {
  const [visibleTodos, setVisibleTodos] = useState<Todo[]>([]);

  useEffect(() => {
    const filteredTodos = todos.filter(todo => {
      switch (selectedFilter) {
        case Filter.COMPLETED:
          return todo.completed;
        case Filter.ACTIVE:
          return !todo.completed;
        case Filter.ALL:
        default:
          return todo;
      }
    });

    setVisibleTodos(filteredTodos);
  }, [selectedFilter, todos]);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {visibleTodos.map(todo => (
          <CSSTransition
            key={todo.id}
            timeout={300}
            classNames="item"
          >
            <TodoItem
              key={todo.id}
              todo={todo}
              isAdding={false}
              onSetIsError={onSetIsError}
              onSetTypeError={onSetTypeError}
              toLoad={toLoad}
              isDeletedComplete={isDeletedComplete}
            />
          </CSSTransition>
        ))}
        {isAdding && userId
      && (
        <CSSTransition
          key={0}
          timeout={300}
          classNames="temp-item"
        >
          <TodoItem
            todo={{
              id: 0,
              userId,
              title: newTitleTodo,
              completed: false,
            }}
            isAdding={isAdding}
            onSetIsError={onSetIsError}
            onSetTypeError={onSetTypeError}
            toLoad={toLoad}
            isDeletedComplete={isDeletedComplete}
          />
        </CSSTransition>
      )}

      </TransitionGroup>
    </section>
  );
};
