import { TransitionGroup, CSSTransition } from 'react-transition-group';
import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

import '../../styles/transistiongroup.scss';

type Props = {
  todos: Todo[];
  removeTodo: (TodoId: number) => void;
  selectedId: number[];
  isAdding: boolean;
  title: string;
  handleChange: (updateId: number, data: Partial<Todo>) => Promise<void>;
  selectedTodo: number;
  setSelectedTodo: (value: number) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  removeTodo,
  selectedId,
  isAdding,
  title,
  handleChange,
  selectedTodo,
  setSelectedTodo,
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
              isAdding={isAdding}
              handleChange={handleChange}
              todos={todos}
              selectedTodo={selectedTodo}
              setSelectedTodo={setSelectedTodo}
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
                title,
                completed: false,
                userId: Math.random(),
              }}
              removeTodo={removeTodo}
              selectedId={selectedId}
              isAdding={isAdding}
              handleChange={handleChange}
              todos={todos}
              selectedTodo={selectedTodo}
              setSelectedTodo={setSelectedTodo}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
