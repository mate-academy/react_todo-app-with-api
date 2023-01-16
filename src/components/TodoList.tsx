import React, { useState } from 'react';
import '../styles/transition.css';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';
import { TempTodoItem } from './TempTodoItem';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  onTodoDelete: (todoIds: number[]) => void;
  isProcessing: boolean;
  currentTodoId: number[],
  toggleCompletedStatus: (
    todoIds: number[],
    data: Pick<Todo, 'completed'>,
  ) => void;
  handleTitleChanges: (
    todoId: number,
    data: Pick<Todo, 'title'>,
  ) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  onTodoDelete,
  isProcessing,
  currentTodoId,
  toggleCompletedStatus,
  handleTitleChanges,
}) => {
  const [inputSelectedId, setInputSelectedId] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [initialValue, setInitialValue] = useState('');

  const onDoubleClick = (
    event: React.MouseEvent<HTMLSpanElement, MouseEvent>,
    todoId: number,
  ) => {
    const value = event.currentTarget.textContent;

    setInitialValue(value || '');
    setInputValue(value || '');
    setInputSelectedId(todoId);
  };

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const onFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (initialValue === inputValue) {
      setInputSelectedId(0);

      return;
    }

    if (inputValue.length === 0) {
      onTodoDelete([inputSelectedId]);

      setInputSelectedId(0);

      return;
    }

    handleTitleChanges(inputSelectedId, { title: inputValue });

    setInputSelectedId(0);
  };

  const onBlur = (event: React.FormEvent<HTMLFormElement>) => {
    onFormSubmit(event);

    setInputSelectedId(0);
  };

  const handleCancelEditing = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setInputValue(initialValue);
      setInputSelectedId(0);
    }
  };

  return (
    <ul className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {todos.map(todo => (
          <CSSTransition
            key={todo.id}
            timeout={300}
            classNames="item"
          >
            <TodoItem
              todo={todo}
              isInputSelected={inputSelectedId === todo.id}
              onTodoDelete={onTodoDelete}
              onInputChange={onInputChange}
              inputValue={inputValue}
              onDoubleClick={onDoubleClick}
              onBlur={onBlur}
              toggleCompletedStatus={toggleCompletedStatus}
              onFormSubmit={onFormSubmit}
              handleCancelEditing={handleCancelEditing}
              isActive={
                isProcessing && !!currentTodoId.find(
                  todoId => todoId === todo.id,
                )
              }
            />
          </CSSTransition>
        ))}

        {tempTodo && (
          <CSSTransition
            key={0}
            timeout={300}
            classNames="temp-item"
          >
            <TempTodoItem tempTodo={tempTodo} />
          </CSSTransition>
        )}
      </TransitionGroup>
    </ul>
  );
};
