import React, { useEffect, useState } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Filter } from '../../types/Filter';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';
import { Errors } from '../../types/Errors';

type Props = {
  todos: Todo[]
  selectedFilter: string
  newTitleTodo: string
  userId: number | null
  isAdding: boolean
  isDeleting: boolean
  onSetTypeError: React.Dispatch<React.SetStateAction<Errors>>
  toLoad:() => Promise<void>
};

export const TodoList: React.FC<Props> = ({
  todos,
  selectedFilter,
  newTitleTodo,
  userId,
  isAdding,
  isDeleting,
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
              onSetTypeError={onSetTypeError}
              toLoad={toLoad}
              isDeleting={isDeleting}
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
            onSetTypeError={onSetTypeError}
            toLoad={toLoad}
            isDeleting={isDeleting}
          />
        </CSSTransition>
      )}

      </TransitionGroup>
    </section>
  );
};
