import React, { useEffect, useRef, useState } from 'react';
import { Todo } from './types/Todo';
import { addTodo, deleteTodo, getTodos, updateTodo } from './api/todos';
import { wait } from './utils/fetchClient';
import { Todo as TodoElement } from './components/Todo';
import { Footer } from './components/Footer';
import { ErrorMessage } from './components/ErrorMessage';
import { Header } from './components/Header';

const WAIT_TIME = 500;

// Error messages
// eslint-disable-next-line @typescript-eslint/naming-convention
enum ERROR_MESSAGE {
  serverError = 'Unable to load todos',
  emptyError = 'Title should not be empty',
  addError = 'Unable to add a todo',
  deleteError = 'Unable to delete a todo',
  updateError = 'Unable to update a todo',
}

// Filter status
// eslint-disable-next-line @typescript-eslint/naming-convention
export enum FILTER_STATUS {
  all = 'All',
  active = 'Active',
  completed = 'Completed',
}

export const App: React.FC = () => {
  const [todoData, setTodoData] = useState<Todo[]>([]);
  const [filteredData, setFilteredData] = useState<Todo[]>([]);
  const [filterStatus, setFilterStatus] = useState<FILTER_STATUS>(
    FILTER_STATUS.all,
  );
  const [todoCounter, setTodoCounter] = useState<number>(0);
  const [showErrorBox, setShowErrorBox] = useState(false);
  const [isInputDisabled, setIsInputDisabled] = useState(false);
  const [arrayIdsOfLoading, setArrayIdsOfLoading] = useState<number[]>([]);
  const [textOfError, setTextOfError] = useState<ERROR_MESSAGE | null>(null);
  const [todoInput, setTodoInput] = useState('');

  const isFirstRender = useRef(true);
  const autoFocusRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocusRef.current) {
      autoFocusRef.current.focus();
    }
  }, [isInputDisabled]);

  const handleError = (message: ERROR_MESSAGE) => {
    setShowErrorBox(true);
    setTextOfError(message);
    wait(2000).then(() => {
      setShowErrorBox(false);
      setTextOfError(null);
    });
  };

  useEffect(() => {
    getTodos()
      .then(data => {
        setTodoData(data);
        setTodoCounter(data.filter(el => !el.completed).length);
      })
      .catch(() => {
        handleError(ERROR_MESSAGE.serverError);
      });
  }, []);

  const addPost = async (title: string) => {
    if (!title.trim()) {
      return handleError(ERROR_MESSAGE.emptyError);
    }

    setIsInputDisabled(true);
    const tempTodo: Todo = {
      id: -1,
      userId: 690,
      title: title.trim(),
      completed: false,
    };

    setTodoData(prevData => [...prevData, tempTodo]);
    setArrayIdsOfLoading(prev => [...prev, tempTodo.id]);

    try {
      const data = await addTodo({
        userId: 690,
        title: title.trim(),
        completed: false,
      });

      setTodoData(prevData =>
        prevData.map(todo => (todo.id === tempTodo.id ? data : todo)),
      );
      setArrayIdsOfLoading(prev => prev.filter(id => id !== tempTodo.id));
      setTodoInput('');
    } catch {
      setTodoData(prevData => prevData.filter(todo => todo.id !== tempTodo.id));
      handleError(ERROR_MESSAGE.addError);
    } finally {
      setIsInputDisabled(false);
    }
  };

  const deletePost = async (todoId: number) => {
    setArrayIdsOfLoading(prev => [...prev, todoId]);

    try {
      await deleteTodo(todoId);
      setTodoData(prevData => prevData.filter(el => el.id !== todoId));
    } catch {
      handleError(ERROR_MESSAGE.deleteError);
    } finally {
      setArrayIdsOfLoading(prev => prev.filter(id => id !== todoId));
      autoFocusRef.current?.focus();
    }
  };

  const updatePost = async (todoId: number, info: Todo) => {
    setArrayIdsOfLoading(prevId => [...prevId, todoId]);

    try {
      await wait(WAIT_TIME);
      const data = await updateTodo(todoId, info);

      setTodoData(prevData =>
        prevData.map(el => (el.id === todoId ? data : el) as Todo),
      );
    } catch (err) {
      handleError(ERROR_MESSAGE.updateError);
      throw err;
    } finally {
      setArrayIdsOfLoading(prev => prev.filter(id => id !== todoId));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (todoInput.trim().length > 0) {
      addPost(todoInput);
    } else {
      handleError(ERROR_MESSAGE.emptyError);
    }
  };

  const clearAllCompleted = () => {
    todoData.forEach(el => {
      if (el.completed) {
        deletePost(el.id);
      }
    });
  };

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
    } else {
      wait(WAIT_TIME).then(() => {
        setTodoCounter(todoData.filter(el => !el.completed).length);
      });
    }
  }, [todoData]);

  useEffect(() => {
    switch (filterStatus) {
      case FILTER_STATUS.active:
        setFilteredData(todoData.filter(el => !el.completed));
        break;
      case FILTER_STATUS.completed:
        setFilteredData(todoData.filter(el => el.completed));
        break;
      case FILTER_STATUS.all:
      default:
        setFilteredData(todoData);
        break;
    }
  }, [filterStatus, todoData]);

  const makeAllTasksAsCompleted = () => {
    todoData.forEach(el => {
      if (!el.completed) {
        updatePost(el.id, { ...el, completed: true });
      }
    });
  };

  const makeAllTasksAsActive = () => {
    todoData.forEach(el => {
      if (el.completed) {
        updatePost(el.id, { ...el, completed: false });
      }
    });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todoData={todoData}
          makeAllTaskAsActive={makeAllTasksAsActive}
          makeAllTaskAsComplited={makeAllTasksAsCompleted}
          handleSubmit={handleSubmit}
          isInputDisable={isInputDisabled}
          autoFocusRef={autoFocusRef}
          todoInput={todoInput}
          setTodoInput={setTodoInput}
        />

        <section className="todoapp__main" data-cy="TodoList">
          {filteredData.map(todo => (
            <TodoElement
              arrayIdsOfLoading={arrayIdsOfLoading}
              key={todo.id}
              todo={todo}
              deletePost={deletePost}
              updatePost={updatePost}
            />
          ))}
        </section>

        {todoData.length > 0 && (
          <Footer
            todoCounter={todoCounter}
            setFilterStatus={setFilterStatus}
            fillterStatus={filterStatus}
            todoData={todoData}
            clearAllCopmpleted={clearAllCompleted}
          />
        )}
      </div>

      <ErrorMessage showErrorBox={showErrorBox} textOfError={textOfError} />
    </div>
  );
};
