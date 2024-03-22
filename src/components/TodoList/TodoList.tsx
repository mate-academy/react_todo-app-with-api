import React from 'react';
import { CSSTransition } from 'react-transition-group';

import { TodoItem } from '../TodoItem/TodoItem';
import { Todo } from '../../types/Todo';

interface Props {
  todos: Todo[];
  tempTodo: Todo | null;
  deleteTodoHandler: (todoId: number) => void;
  addTodoId: number | null;
  updateTodoTitleById: (currentTodo: Todo) => void;
  updateCompletedTodoById: (todoId: number) => void;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  setAddTodoId: React.Dispatch<React.SetStateAction<number | null>>;
}

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  deleteTodoHandler,
  addTodoId,
  updateTodoTitleById,
  updateCompletedTodoById,
  setLoading,
  setErrorMessage,
  setAddTodoId,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <>
        {todos.map(todo => (
          <CSSTransition key={todo.id} timeout={300} classNames="item">
            <TodoItem
              todo={todo}
              deleteTodoHandler={() => deleteTodoHandler(todo.id)}
              addTodoId={addTodoId}
              updateTodoTitleById={updateTodoTitleById}
              updateCompletedTodoById={updateCompletedTodoById}
              setLoading={setLoading}
              setErrorMessage={setErrorMessage}
              setAddTodoId={setAddTodoId}
            />
          </CSSTransition>
        ))}

        {tempTodo && (
          <CSSTransition key={0} timeout={300} classNames="temp-item">
            <TodoItem
              todo={tempTodo}
              deleteTodoHandler={() => deleteTodoHandler(tempTodo.id)}
              addTodoId={addTodoId}
              updateTodoTitleById={updateTodoTitleById}
              updateCompletedTodoById={updateCompletedTodoById}
              setLoading={setLoading}
              setErrorMessage={setErrorMessage}
              setAddTodoId={setAddTodoId}
            />
          </CSSTransition>
        )}
      </>
    </section>
  );
};
