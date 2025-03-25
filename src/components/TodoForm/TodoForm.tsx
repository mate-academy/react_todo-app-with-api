import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';
import classNames from 'classnames';
import { addTodo, updateTodo, USER_ID } from '../../api/todos';

type Props = {
  todoList: Todo[];
  setLoadingTodos: (todos: Set<number>) => void;
  showErrorMessage: (message: string, delay?: number) => void;
  addNewTodo: (todo: Todo) => void;
  setTempTodo: (todo: Todo | null) => void;
  toggleTodoStatus: (id: number) => void;
};

export const TodoForm: React.FC<Props> = ({
  todoList,
  setLoadingTodos,
  addNewTodo,
  setTempTodo,
  showErrorMessage,
  toggleTodoStatus,
}) => {
  const [todoTitle, setTodoTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const newTodoInputRef = useRef<HTMLInputElement>(null);
  const areAllTodosCompleted = todoList?.every(todo => todo.completed);

  const handlerSubmitForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    if (todoTitle.trim() === '') {
      showErrorMessage('Title should not be empty');
      setIsSubmitting(false);

      return;
    }

    const tempTodo: Todo = {
      id: 0,
      userId: USER_ID,
      title: todoTitle.trim(),
      completed: false,
    };

    setTempTodo(tempTodo);

    const newTodo: Omit<Todo, 'id'> = {
      userId: USER_ID,
      title: todoTitle.trim(),
      completed: false,
    };

    addTodo(newTodo)
      .then(response => {
        addNewTodo(response);
        setTodoTitle('');
      })
      .catch(() => {
        showErrorMessage('Unable to add a todo');
      })
      .finally(() => {
        setIsSubmitting(false);
        setTempTodo(null);
      });
  };

  const handlerToggleAll = () => {
    if (areAllTodosCompleted) {
      setLoadingTodos(new Set(todoList.map(todo => todo.id)));

      todoList.forEach(todo =>
        updateTodo(todo.id, {
          userId: todo.userId,
          completed: false,
        })
          .then(() => {
            toggleTodoStatus(todo.id);
          })
          .catch(() => showErrorMessage('Unable to update a todo'))
          .finally(() => setLoadingTodos(new Set())),
      );
    } else {
      setLoadingTodos(
        new Set(
          // eslint-disable-next-line @typescript-eslint/no-shadow
          todoList.filter(todo => !todo.completed).map(todo => todo.id),
        ),
      );

      todoList.forEach(todo => {
        if (!todo.completed) {
          updateTodo(todo.id, {
            userId: todo.userId,
            completed: true,
          })
            .then(() => {
              toggleTodoStatus(todo.id);
            })
            .catch(() => showErrorMessage('Unable to update a todo'))
            .finally(() => setLoadingTodos(new Set()));
        }
      });
    }
  };

  useEffect(() => {
    if (newTodoInputRef.current) {
      newTodoInputRef.current.focus();
    }
  }, [todoList, isSubmitting]);

  return (
    <header className="todoapp__header">
      {todoList.length !== 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: areAllTodosCompleted,
          })}
          onClick={handlerToggleAll}
          data-cy="ToggleAllButton"
        />
      )}

      <form onSubmit={handlerSubmitForm}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoInputRef}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todoTitle}
          disabled={isSubmitting}
          onChange={e => setTodoTitle(e.target.value)}
        />
      </form>
    </header>
  );
};
