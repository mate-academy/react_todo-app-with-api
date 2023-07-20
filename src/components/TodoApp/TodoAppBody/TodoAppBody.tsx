/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';

import { Todo } from '../../../types/Todo';
import { Todo as TodoItem } from '../Todo/Todo';

type Props = {
  todos: Todo[],
  onDelete: (todoId: number) => void,
  isUpdatingTodoId: number,
  handleUpdateTodo: (
    title: string,
    todoId: number,
    completed: boolean,
  ) => void,
  isClicked: boolean,
  setIsClicked: (param: boolean) => void,
  isBeingEdited: number,
  setIsBeingEdited: (param: number) => void,
  handleEditedTodoFormSubmit: (
    title: string,
    todoId: number,
    completed: boolean,
  ) => void,
};

export const TodoAppBody: React.FC<Props> = ({
  todos,
  onDelete,
  isUpdatingTodoId,
  handleUpdateTodo,
  isClicked,
  setIsClicked,
  isBeingEdited,
  setIsBeingEdited,
  handleEditedTodoFormSubmit,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map(({ title, id, completed }: Todo) => (
        <TodoItem
          key={id}
          title={title}
          id={id}
          completed={completed}
          onDelete={onDelete}
          isUpdatingTodoId={isUpdatingTodoId}
          handleUpdateTodo={handleUpdateTodo}
          isClicked={isClicked}
          setIsClicked={setIsClicked}
          isBeingEdited={isBeingEdited}
          setIsBeingEdited={setIsBeingEdited}
          handleEditedTodoFormSubmit={handleEditedTodoFormSubmit}
        />
      ))}
    </section>
  );
};
