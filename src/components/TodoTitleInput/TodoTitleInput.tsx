import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';
// import cn from 'classnames';

type Props = {
  oldTitle: string;
  currentTodoId: number;
  setShouldShowInput: (value: boolean) => void;
  updateTodo: (
    todoId: number,
    fieldsToUpdate: Partial<Pick<Todo, 'title' | 'completed'>>,
  ) => Promise<void>;
  deleteTodo: (todoId: number) => Promise<void>;
};

export const TodoTitleInput: React.FC<Props> = React.memo(
  ({
    oldTitle,
    currentTodoId,
    setShouldShowInput,
    updateTodo,
    deleteTodo,
  }) => {
    const [newTitle, setNewTitle] = useState(oldTitle);

    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, []);

    const cancelEditing = () => {
      setShouldShowInput(false);
    };

    const applyChanges = async () => {
      if (!newTitle.trim()) {
        await deleteTodo(currentTodoId);

        return;
      }

      if (newTitle !== oldTitle) {
        await updateTodo(currentTodoId, { title: newTitle });
      }

      cancelEditing();
    };

    return (
      <form
        onSubmit={(event) => {
          event.preventDefault();
          applyChanges();
        }}
      >
        <input
          data-cy="TodoTitleField"
          type="text"
          className="todo__title-field"
          placeholder="Empty todo will be deleted"
          ref={inputRef}
          value={newTitle}
          onChange={(event) => setNewTitle(event.currentTarget.value)}
          onBlur={applyChanges}
          onKeyDown={(event) => {
            if (event.key === 'Escape') {
              cancelEditing();
            }
          }}
        />
      </form>
    );
  },
);
