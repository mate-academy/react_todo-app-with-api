import React from 'react';

import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

interface Props {
  todos: Todo[],
  creating: Todo | null
  selectedId: number | null
  editedTodoId: number | null
  newTitle: string
  onChangeTodoTitle: () => void
  onAddNewTitle: (value: string) => void
  onEditedTodoId: (value: number | null) => void
  onDelete: (todoId: number) => void
  onToggle: (todoId: number, check: boolean) => void
}

export const TodoList: React.FC<Props> = ({
  todos,
  creating,
  onDelete,
  selectedId,
  onToggle,
  onEditedTodoId,
  editedTodoId,
  onAddNewTitle,
  onChangeTodoTitle,
  newTitle,
}) => {
  return (
    <section className="todoapp__main">
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
                selectedId={selectedId}
                onToggle={onToggle}
                onEditedTodoId={onEditedTodoId}
                editedTodoId={editedTodoId}
                onAddNewTitle={onAddNewTitle}
                onChangeTodoTitle={onChangeTodoTitle}
                newTitle={newTitle}
              />
            </CSSTransition>
          );
        })}

        {creating !== null
          && (
            <CSSTransition
              key={0}
              timeout={300}
              classNames="temp-item"
            >
              <TodoItem
                todo={creating}
                onDelete={onDelete}
                selectedId={selectedId}
                onToggle={onToggle}
                onEditedTodoId={onEditedTodoId}
                editedTodoId={editedTodoId}
                onAddNewTitle={onAddNewTitle}
                onChangeTodoTitle={onChangeTodoTitle}
                newTitle={newTitle}
              />
            </CSSTransition>
          )}
      </TransitionGroup>
    </section>
  );
};
