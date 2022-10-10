import React from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[];
  selectedTodosIds: number[];
  isAdding: boolean;
  title: string;
  errorNotification: string | null;
  handleOnChange: (id: number, data: Partial<Todo>) => Promise<void>;
  setErrorNotification: React.Dispatch<React.SetStateAction<string | null>>;
  setSelectTodosIds: React.Dispatch<React.SetStateAction<number[]>>;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
};

export const TodosList: React.FC<Props> = ({
  todos,
  selectedTodosIds,
  isAdding,
  title,
  errorNotification,
  handleOnChange,
  setErrorNotification,
  setSelectTodosIds,
  setTodos,
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
              selectedTodosIds={selectedTodosIds}
              errorNotification={errorNotification}
              isAdding={isAdding}
              handleOnChange={handleOnChange}
              setErrorNotification={setErrorNotification}
              setSelectedTodosIds={setSelectTodosIds}
              setTodos={setTodos}
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
              todos={todos}
              selectedTodosIds={selectedTodosIds}
              errorNotification={errorNotification}
              isAdding={isAdding}
              handleOnChange={handleOnChange}
              setErrorNotification={setErrorNotification}
              setSelectedTodosIds={setSelectTodosIds}
              setTodos={setTodos}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
