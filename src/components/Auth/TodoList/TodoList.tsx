import React from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { Todo } from '../../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';
import '../../../styles/transitiongroup.scss';

type Props = {
  todos: Todo[];
  removeTodo: (TodoId: number) => void;
  selectedId: number[];
  isAdded: boolean;
  title: string;
  handleChange: (updateId: number, data: Partial<Todo>)
  => Promise<void>;
};

export const TodoList: React.FC<Props> = ({
  todos,
  removeTodo,
  selectedId,
  isAdded,
  title,
  handleChange,
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
              key={todo.id}
              todo={todo}
              removeTodo={removeTodo}
              selectedId={selectedId}
              isAdded={isAdded}
              handleChange={handleChange}
              todos={todos}
            />
          </CSSTransition>
        ))}

        {isAdded && (
          <CSSTransition
            key={0}
            timeout={300}
            classNames="temp-item"
          >
            <TodoItem
              key={Math.random()}
              todo={{
                id: 0,
                title,
                completed: false,
                userId: Math.random(),
              }}
              removeTodo={removeTodo}
              selectedId={selectedId}
              isAdded={isAdded}
              handleChange={handleChange}
              todos={todos}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
