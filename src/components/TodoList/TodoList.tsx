import React from 'react';
import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

interface Props {
  todos: Todo[],
  creating: Todo | null,
  onDelete: (todoId: number) => void,
  inProcessing: number[],
  updateTodo: (todoId: number [], data: boolean) => void,
  onChangeTitle: (id: number, title: string) => void,
}

export const TodoList: React.FC<Props> = React.memo(
  ({
    todos,
    creating,
    onDelete,
    inProcessing,
    updateTodo,
    onChangeTitle,
  }) => {
    return (
      <section className="todoapp__main" data-cy="TodoList">
        <TransitionGroup>
          {todos.map(todo => {
            return (
              <CSSTransition
                key={todo.id}
                timeout={300}
                classNames="item"
              >
                <TodoItem
                  todo={todo}
                  onDelete={onDelete}
                  isProcessing={inProcessing.includes(todo.id)}
                  updateTodo={updateTodo}
                  onChangeTitle={onChangeTitle}
                />
              </CSSTransition>
            );
          })}

          {creating && (
            <CSSTransition
              key={0}
              timeout={300}
              classNames="temp-item"
            >
              <TodoItem
                todo={creating}
                onDelete={onDelete}
                updateTodo={updateTodo}
                isProcessing
                onChangeTitle={onChangeTitle}
              />
            </CSSTransition>
          )}
        </TransitionGroup>
      </section>
    );
  },
);
