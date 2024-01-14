import {
  FormEvent, KeyboardEventHandler, useEffect, useRef, useState,
} from 'react';
import classNames from 'classnames';
import { deleteTodo, updateTodo } from '../../api/todos';
import { useTodos } from '../../context/TodoProvider';
import { Todo } from '../../types/Todo';

export const TodoList = () => {
  const [isEditable, setIsEditable] = useState<number | null>(null);
  const [procesing, setProcesing] = useState<(number | null)[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const {
    visibleTodos, tempTodo, todos, setTodos, setErrorMessage,
  } = useTodos();

  const handleDeleteTodo = (todoId: number) => {
    setProcesing(prev => [
      ...prev,
      todoId,
    ]);

    deleteTodo(todoId)
      .then(() => {
        setTodos((prevTodos: Todo[]) => prevTodos
          .filter(todo => todo.id !== todoId));
      })
      .catch(() => setErrorMessage('Unable to delete a todo'))
      .finally(() => setProcesing(prev => prev
        .filter(id => id !== todoId)));
  };

  const handleSaveTodo = (event: FormEvent) => {
    event.preventDefault();
    setProcesing(prev => [
      ...prev,
      isEditable,
    ]);

    const editableTodo = todos.find(todo => todo.id === isEditable);
    const currentValue = inputRef.current?.value;

    if (currentValue === editableTodo?.title) {
      setProcesing(prev => prev.filter(id => id !== isEditable));
      setIsEditable(null);

      return;
    }

    if (currentValue === '' && isEditable) {
      handleDeleteTodo(isEditable);
    }

    if (currentValue !== '' && isEditable) {
      updateTodo(isEditable, {
        title: inputRef?.current?.value.trim(),
      }).then((value) => {
        const copy = [...todos];
        const index = todos.findIndex(el => el.id === isEditable);

        copy[index] = value;

        setTodos(copy);
      })
        .then(() => setProcesing(prev => prev
          .filter(id => id !== isEditable)))
        .then(() => setIsEditable(null))
        .catch(() => {
          setErrorMessage('Unable to update a todo');
          setProcesing(prev => prev
            .filter(id => id !== isEditable));
        });
    }
  };

  const handleSetStatus = (id: number, completed: boolean) => () => {
    setProcesing(prev => [
      ...prev,
      id,
    ]);
    updateTodo(id, {
      completed,
    })
      .then((todo: Todo) => {
        const copy = [...todos];
        const index = todos.findIndex(el => el.id === id);

        copy[index] = todo;
        setTodos(copy);
      })
      .catch(() => setErrorMessage('Unable to update a todo'))

      .finally(() => {
        setProcesing(prev => prev
          .filter(todoId => todoId !== id));
        setIsEditable(null);
      });
  };

  const handleDoubleClick = (id: number) => () => {
    setIsEditable(id);
  };

  const handleEscapeKey: KeyboardEventHandler = (event) => {
    if (event.key === 'Escape') {
      setIsEditable(null);
    }
  };

  useEffect(() => {
    if (isEditable && inputRef.current) {
      inputRef.current.focus();
    }
  });

  return (
    <>
      {todos.length === 0
        ? <></>
        : visibleTodos.map(todo => (
          <div
            key={todo.id}
            data-cy="Todo"
            className={todo.completed
              ? 'todo completed'
              : 'todo'}
          >
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className={todo.completed
                  ? 'todo__status checked'
                  : 'todo__status'}
                checked={todo.completed}
                onClick={handleSetStatus(todo.id, !todo.completed)}
              />
            </label>
            {isEditable === todo.id
              ? (
                <form
                  onSubmit={handleSaveTodo}
                >
                  <input
                    data-cy="TodoTitleField"
                    type="text"
                    className="todo__title todo__title-field"
                    placeholder="Empty todo will be deleted"
                    defaultValue={todo.title}
                    onBlur={handleSaveTodo}
                    ref={inputRef}
                    onKeyDown={handleEscapeKey}
                  />
                </form>
              )
              : (
                <>
                  <span
                    data-cy="TodoTitle"
                    className="todo__title"
                    onDoubleClick={handleDoubleClick(todo.id)}
                  >
                    {todo.title}
                  </span>

                  <button
                    type="button"
                    className="todo__remove"
                    data-cy="TodoDelete"
                    onClick={() => handleDeleteTodo(todo.id)}
                  >
                    ×
                  </button>
                </>
              )}

            <div
              data-cy="TodoLoader"
              className={classNames('modal overlay', {
                'is-active': procesing.includes(todo.id),
              })}
            >
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        ))}

      {tempTodo && (
        <div
          data-cy="Todo"
          className="todo is-active"
        >
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
            />
          </label>

          <span data-cy="TodoTitle" className="todo__title">
            {tempTodo.title}
          </span>

          <button type="button" className="todo__remove" data-cy="TodoDelete">
            ×
          </button>
          <div data-cy="TodoLoader" className="modal overlay is-active">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </>
  );
};
