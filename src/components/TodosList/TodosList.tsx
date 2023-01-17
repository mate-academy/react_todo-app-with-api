import React from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';
import '../../styles/todosList.scss';

interface Props {
  todos: Todo[],
  newTodo?: Todo | null,
  isAdding?: boolean,
  handleDelete: (event: React.MouseEvent<HTMLButtonElement>) => void,
  deletedId: number[] | null,
  handleToggle?: (event: React.MouseEvent<HTMLInputElement>) => void,
  updatedTitleId: number | null,
  hanldleCreateTitleForm: (event: React.MouseEvent<HTMLSpanElement>) => void,
  handleChangeTodoTitle: (event: React.ChangeEvent<HTMLInputElement>) => void,
  newTitle: string,
  handlesSubmitNewTitle: (event: React.FormEvent<HTMLFormElement>) => void,
  handleBlur: () => void,
  handleKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void,
}

export const TodosList: React.FC<Props> = ({
  todos,
  newTodo,
  isAdding,
  handleDelete,
  deletedId,
  handleToggle,
  updatedTitleId,
  hanldleCreateTitleForm,
  handleChangeTodoTitle,
  newTitle,
  handlesSubmitNewTitle,
  handleBlur,
  handleKeyDown,
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
              key={todo.id}
              handleDelete={handleDelete}
              deletedId={deletedId}
              handleToggle={handleToggle}
              updatedTitleId={updatedTitleId}
              hanldleCreateTitleForm={hanldleCreateTitleForm}
              handleChangeTodoTitle={handleChangeTodoTitle}
              newTitle={newTitle}
              handlesSubmitNewTitle={handlesSubmitNewTitle}
              handleBlur={handleBlur}
              handleKeyDown={handleKeyDown}
            />
          </CSSTransition>
        ))}
        {newTodo && (
          <CSSTransition
            key={0}
            timeout={300}
            classNames="temp-item"
          >
            <TodoItem
              todo={newTodo}
              isAdding={isAdding}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
