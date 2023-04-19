import React from 'react';
import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group';
import './TodoList.scss';

import { TodoItem } from '../TodoItem';

import { TodoWithMode } from '../../types/TodoWithMode';
import { TodoDataToUpdate } from '../../types/TodoDataToUpdate';
import { TodoMode } from '../../types/TodoMode';

type Props = {
  todos: TodoWithMode[];
  tempTodo: TodoWithMode | null;
  onTodoDelete: (todoId: number) => Promise<void>;
  onTodoUpdate: (
    todoId: number,
    updatedData: TodoDataToUpdate
  ) => Promise<void>;
  onTodoUpdateMode: (todoId: number, mode: TodoMode) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  onTodoDelete,
  onTodoUpdate,
  onTodoUpdateMode,
}) => (
  <section className="todoapp__main">
    <TransitionGroup>
      {todos.map(todo => (
        <CSSTransition
          key={todo.id}
          timeout={300}
          classNames="item"
        >
          <TodoItem
            todo={todo}
            onTodoDelete={onTodoDelete}
            onTodoUpdate={onTodoUpdate}
            onTodoUpdateMode={onTodoUpdateMode}
          />
        </CSSTransition>
      ))}

      {tempTodo && (
        <CSSTransition
          key={tempTodo.id}
          timeout={300}
          classNames="temp-item"
        >
          <TodoItem todo={tempTodo} />
        </CSSTransition>
      )}
    </TransitionGroup>
  </section>
);
