import React from 'react';
import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

interface Props {
  isAdding: boolean;
  tempTodo: Todo;
  todoIdsLoading: number[];
  filtredTodos: Todo[];
  removeTodoFromServer: (id: number) => void;
  toggleTodoServerStatus: (todoId: number, status: boolean) => Promise<void>;
  sendNewTodoTitleToServer: (todoId: number, newTitle: string) => Promise<void>;
}

export const TodoList: React.FC<Props> = React.memo(({
  filtredTodos,
  isAdding,
  tempTodo,
  todoIdsLoading,
  removeTodoFromServer,
  toggleTodoServerStatus,
  sendNewTodoTitleToServer,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    <TransitionGroup>
      {filtredTodos.map((todo) => (
        <CSSTransition
          key={todo.id}
          timeout={300}
          classNames="item"
        >
          <TodoItem
            todo={todo}
            key={todo.id}
            isLoading={todoIdsLoading.includes(todo.id)}
            removeTodoFromServer={removeTodoFromServer}
            toggleTodoServerStatus={toggleTodoServerStatus}
            sendNewTodoTitleToServer={sendNewTodoTitleToServer}
          />
        </CSSTransition>
      ))}
      {isAdding && (
        <CSSTransition
          key={tempTodo.id}
          timeout={300}
          classNames="item"
        >
          <TodoItem
            todo={tempTodo}
            isLoading={isAdding}
            removeTodoFromServer={removeTodoFromServer}
            toggleTodoServerStatus={toggleTodoServerStatus}
            sendNewTodoTitleToServer={sendNewTodoTitleToServer}
          />
        </CSSTransition>
      )}
    </TransitionGroup>
  </section>
));
