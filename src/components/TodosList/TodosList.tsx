import React from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import '../../styles/animation.scss';
import { TodoElement } from '../TodoElement';

import { Todo } from '../../types/Todo';

interface Props {
  todos: Todo[]
  handleRemove: (id: number) => void;
  handleToggle: (id: number, completed: boolean) => void;
  handleInputRename: (id: number, title: string) => void;
  handleInputBlur: () => void;
  handleCancelEditing: (e: React.KeyboardEvent) => void;
  isEditingFinished: boolean;
  inputTitle: string;
  setInputTitle: (inputTitle: string) => void;
  tempTodo: Todo | null;
  currTodoId: number | null;
  processedIds: number[];
}

export const TodosList: React.FC<Props> = ({
  todos,
  handleRemove,
  handleToggle,
  handleInputRename,
  handleInputBlur,
  inputTitle,
  isEditingFinished,
  setInputTitle,
  handleCancelEditing,
  currTodoId,
  tempTodo,
  processedIds,
}) => {
  return (
    <ul className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {todos?.map(todo => (
          <CSSTransition
            key={todo.id}
            timeout={300}
            classNames="item"
          >
            <TodoElement
              todo={todo}
              key={todo.id}
              handleRemove={handleRemove}
              handleToggle={handleToggle}
              handleInputRename={handleInputRename}
              handleCancelEditing={handleCancelEditing}
              handleInputBlur={handleInputBlur}
              isEditingFinished={isEditingFinished}
              inputTitle={inputTitle}
              setInputTitle={setInputTitle}
              processedIds={processedIds}
              currTodoId={currTodoId}
            />
          </CSSTransition>
        ))}

        {tempTodo && (
          <CSSTransition
            key={0}
            timeout={300}
            classNames="temp-item"
          >
            <TodoElement
              todo={tempTodo}
              handleRemove={handleRemove}
              handleToggle={handleToggle}
              handleInputRename={handleInputRename}
              handleInputBlur={handleInputBlur}
              isEditingFinished={isEditingFinished}
              inputTitle={inputTitle}
              handleCancelEditing={handleCancelEditing}
              setInputTitle={setInputTitle}
              processedIds={processedIds}
              currTodoId={currTodoId}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </ul>
  );
};
