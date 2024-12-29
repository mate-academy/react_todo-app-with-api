/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect } from 'react';
import { Todo } from '../../types/Todo';
import classNames from 'classnames';
import { TodoComponent } from '../TodoComponent/TodoComponent';

type Props = {
  todos: Todo[];
  onDeleteTodo: (todoId: number | null) => void;
  onCompletedTodo: (todo: Todo) => void;
  onDoubleClickTodo: (todo: Todo) => void;
  onSubmitEdit: (
    titleEdit: string,
    event: React.FormEvent<HTMLFormElement> | null,
  ) => Promise<void>;
  tempTodo: Todo | null;
  todoChangedTitle: Todo | null;
  inputEditRef: React.RefObject<HTMLInputElement> | null;
  onCancelEdit: () => void;
  handleBlurEdit: (titleEdit: string) => void;
  loadingTodoIds: number[];
};

export const TodoList: React.FC<Props> = (props: Props) => {
  const {
    todos,
    onDeleteTodo,
    onCompletedTodo,
    onDoubleClickTodo,
    onSubmitEdit,
    tempTodo,
    todoChangedTitle,
    inputEditRef,
    onCancelEdit,
    handleBlurEdit,
    loadingTodoIds,
  } = props;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onCancelEdit();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onCancelEdit]);

  useEffect(() => {
    if (inputEditRef?.current) {
      inputEditRef.current.focus();
    }
  }, [todoChangedTitle, inputEditRef]);

  return (
    <section className={classNames('todoapp__main')} data-cy="TodoList">
      {todos.map(todo => {
        return (
          <TodoComponent
            key={todo.id}
            onDoubleClickTodo={onDoubleClickTodo}
            todo={todo}
            onCompletedTodo={onCompletedTodo}
            todoChangedTitle={todoChangedTitle}
            onSubmitEdit={onSubmitEdit}
            inputEditRef={inputEditRef}
            handleBlurEdit={handleBlurEdit}
            onDeleteTodo={onDeleteTodo}
            loadingTodoIds={loadingTodoIds}
          />
        );
      })}

      {tempTodo && (
        <TodoComponent
          onDoubleClickTodo={onDoubleClickTodo}
          todo={tempTodo}
          onCompletedTodo={onCompletedTodo}
          todoChangedTitle={todoChangedTitle}
          onSubmitEdit={onSubmitEdit}
          inputEditRef={inputEditRef}
          handleBlurEdit={handleBlurEdit}
          onDeleteTodo={onDeleteTodo}
          loadingTodoIds={loadingTodoIds}
        />
      )}
    </section>
  );
};
