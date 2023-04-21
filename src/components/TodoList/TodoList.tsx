import React from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import '../../styles/transitions.scss';
import { Todo, PathchingTodo } from '../../types/Todo';
import TodoItem from '../TodoItem';
import { ErrorMessage } from '../../types/ErrorMessage'

type Props = {
  todos: Todo[];
  tempTodo: Todo | null,
  loading: boolean,
  loadingTodoId: number[],
  removeTodo: (id: number) => Promise<void>,
  updateTodo: (id: number, data: PathchingTodo) => Promise<void>,
  setErrorText: (errorText : ErrorMessage) => void,
};

export const TodoList: React.FC<Props> = ({
  todos, tempTodo, loading, loadingTodoId, removeTodo, updateTodo, setErrorText,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {todos.map(todo => (
          <CSSTransition
            key={todo.id}
            timeout={200}
            classNames="item"
          >
            <TodoItem
              key={todo.id}
              todo={todo}
              loading={false}
              removeTodo={removeTodo}
              loadingTodoId={loadingTodoId}
              updateTodo={updateTodo}
              setErrorText={setErrorText}
            />
          </CSSTransition>
        ))}
        {tempTodo && (
          <CSSTransition
            key={0}
            timeout={200}
            classNames="temp-item"
          >
            <TodoItem
              key={tempTodo.id}
              todo={tempTodo}
              loading={loading}
              removeTodo={removeTodo}
              loadingTodoId={loadingTodoId}
              updateTodo={updateTodo}
              setErrorText={setErrorText}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
