import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import classNames from 'classnames';
import { TodoType } from '../../types/TodoType';
import { Form } from '../Form';
import { TodoCard } from '../TodoCard';
import { DispatchContext, StateContext } from '../StateProvider';
import { StatusToggler } from '../StatusToggler';
import * as todoService from '../../api/todos';

type Props = {
  todo: TodoType
};

export const Todo: React.FC<Props> = ({
  todo: { id, title, completed },
}) => {
  const { loading, selectedTodoIds, todos } = useContext(StateContext);
  const dispatch = useContext(DispatchContext);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const input = useRef<HTMLInputElement>(null);

  const isSelected = selectedTodoIds.includes(id);

  useEffect(() => {
    if (isEditing && input.current) {
      input.current.focus();
    }
  }, [isEditing]);
  const onDoubleClick = () => {
    setIsEditing(true);
    input.current?.focus();
  };

  const deleteTodo = async (todoId: number) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: '' });
    dispatch({ type: 'SET_SELECTED', payload: todoId });

    try {
      await todoService.deleteTodo(todoId);

      dispatch({ type: 'DELETE_TODO', payload: todoId });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Unable to delete a todo' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
      dispatch({ type: 'CLEAR_SELECTED' });
    }
  };

  const editTodo = async (newTitle: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: '' });
    dispatch({ type: 'SET_SELECTED', payload: id });

    try {
      if (!newTitle) {
        await deleteTodo(id);

        return;
      }

      dispatch({ type: 'EDIT_TODO', payload: { id, title: newTitle } });

      await todoService.updateTodo(
        {
          id,
          title: newTitle,
        },
      );
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Unable to edit a todo' });
      dispatch({ type: 'SET_TODOS', payload: todos });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
      dispatch({ type: 'CLEAR_SELECTED' });
    }
  };

  const toggleTodoStatus = async (todoId: number) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: '' });
    dispatch({ type: 'SET_SELECTED', payload: todoId });

    try {
      dispatch({ type: 'TOGGLE_TODO', payload: todoId });

      await todoService.updateTodo({
        id: todoId,
        completed: !completed,
      });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Unable to toggle a todo' });
      dispatch({ type: 'SET_TODOS', payload: todos });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
      dispatch({ type: 'CLEAR_SELECTED' });
    }
  };

  return (
    <div className={classNames('todo', {
      completed,
    })}
    >
      <StatusToggler
        completed={completed}
        onToggle={() => toggleTodoStatus(id)}
      />
      {!isEditing ? (
        <TodoCard
          todoTitle={title}
          deleteTodo={() => deleteTodo(id)}
          onDoubleClick={onDoubleClick}
          loading={loading}
          isSelected={isSelected}
        />
      ) : (
        <Form
          ref={input}
          todoTitle={title}
          onSubmit={editTodo}
          setIsEditing={setIsEditing}
        />
      )}
    </div>
  );
};
