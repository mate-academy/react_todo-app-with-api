/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable no-mixed-operators */
import {
  useEffect, useMemo, useRef, useState,
} from 'react';
import { Errors, SortBy, Todo } from '../types';
import { deleteTodo, updateTodo } from '../api/todos';
import { TempTodo } from './TempTodo';

type Props = {
  todos: Todo[],
  tempTodo: Todo | null,
  sortBy: SortBy,
  handleDeleteTodo: (value: number) => void,
  isLoading: boolean,
  selectedTodo: number[]
  handleUpdateCheckTodo: (value: number) => void;
  handleSelectedTodo: (todoID: number[]) => void;
  handleError: (value: Errors) => void;
  userId: number,
  handleSetMakeAnyChange: (value: boolean) => void;
  makeAnyChange: boolean,
  isDeleteUpdateTodo: boolean
  handleDeleteUptadeTodo: (value: boolean) => void;
};

export const Todos: React.FC<Props> = ({
  todos,
  tempTodo,
  sortBy,
  handleDeleteTodo,
  isLoading,
  selectedTodo,
  handleUpdateCheckTodo,
  handleSelectedTodo,
  handleError,
  userId,
  handleSetMakeAnyChange,
  makeAnyChange,
  isDeleteUpdateTodo,
  handleDeleteUptadeTodo,
}) => {
  const [isTodoEdit, setIsTodoEdit] = useState<number | null>(null);
  const [inputValue, setInputValue] = useState<string>('');
  const filteredTodos = useMemo(() => {
    if (sortBy === SortBy.all) {
      return todos;
    }

    const isCompleted = sortBy === SortBy.completed;

    return todos.filter(({ completed }) => completed === isCompleted);
  }, [sortBy, todos]);

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (inputRef.current && isTodoEdit !== null) {
      inputRef.current.focus();
    }
  }, [isTodoEdit]);

  const handleKeyDown = async (
    e: { key: string; }, todoId:number, todoTitle:string,
  ) => {
    handleDeleteUptadeTodo(true);
    if (e.key === 'Enter') {
      let updatedTodo: Todo | undefined = todos.find(
        todo => todo.id === todoId,
      );

      if (todoTitle === '' && updatedTodo) {
        try {
          setIsTodoEdit(null);
          handleSelectedTodo([...selectedTodo, todoId]);
          await deleteTodo(userId, todoId);
        } catch (error) {
          handleError(Errors.delete);
        } finally {
          handleSelectedTodo([]);
        }
      } else if (updatedTodo && todoTitle !== updatedTodo.title) {
        updatedTodo
          ? updatedTodo = { ...updatedTodo, title: todoTitle }
          : null;

        try {
          setIsTodoEdit(null);
          handleSelectedTodo([...selectedTodo, todoId]);
          await updateTodo(userId, updatedTodo, todoId);
        } catch (error) {
          handleError(Errors.update);
        } finally {
          handleSelectedTodo([]);
        }
      } else {
        setIsTodoEdit(null);
      }

      handleDeleteUptadeTodo(false);
      handleSetMakeAnyChange(!makeAnyChange);
    }

    if (e.key === 'Escape') {
      setInputValue('');
      setIsTodoEdit(null);
    }
  };

  const checkIsLoading = (todo: Todo) => (
    isLoading || (isDeleteUpdateTodo && selectedTodo.includes(todo.id))
  );

  return (
    <section className="todoapp__main">
      <ul>
        {filteredTodos.map(todo => (
          <li
            className={todo.completed ? 'todo completed' : 'todo'}
            key={todo.id}
          >
            <label className="todo__status-label">
              <input
                type="checkbox"
                className="todo__status"
                checked={todo.completed}
                onClick={() => {
                  handleUpdateCheckTodo(todo.id);
                }}
              />
            </label>

            {todo.id === isTodoEdit
              ? (
                <form>
                  <input
                    type="text"
                    ref={inputRef}
                    className="todo__title-field"
                    value={inputValue}
                    onChange={(e) => {
                      setInputValue(e.target.value);
                    }}
                    onKeyDown={(e) => {
                      handleKeyDown(e, todo.id, inputValue);
                    }}
                    onBlur={() => {
                      handleKeyDown({ key: 'Enter' }, todo.id, inputValue);
                    }}
                  />
                </form>
              ) : (
                <>
                  <span
                    className="todo__title"
                    onDoubleClick={() => {
                      setIsTodoEdit(todo.id);
                      setInputValue(todo.title);
                    }}
                  >
                    {todo.title}
                  </span>

                  <button
                    type="button"
                    className="todo__remove"
                    onClick={() => {
                      handleDeleteTodo(todo.id);
                    }}
                  >
                    ×
                  </button>
                </>
              )}

            <div
              className={checkIsLoading(todo)
                ? 'modal overlay is-active'
                : 'modal overlay'}
            >
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </li>
        ))}
        {tempTodo && (
          <TempTodo
            tempTodo={tempTodo}
            handleDeleteTodo={handleDeleteTodo}
          />
        )}
      </ul>
    </section>
  );
};
