import React, { useEffect, useState } from 'react';
import cn from 'classnames';

import { useApiErrorContext } from '../../hooks/getContextHooks';
import { RequestMethod } from '../../types/requestMethod';
import { EmptyInputErrorType } from '../../types/apiErrorsType';

type ResponseErrors = {
  [key in RequestMethod | EmptyInputErrorType]: string;
};

const responseErrors: ResponseErrors = {
  GET: 'Unable to load todos',
  POST: 'Unable to add a todo',
  PATCH: 'Unable to update a todo',
  DELETE: 'Unable to delete a todo',
  REQUIRED: 'Title should not be empty',
};

export const ApiError: React.FC = () => {
  const { apiError } = useApiErrorContext();
  const [addClassName, setAddClassName] = useState(true);

  useEffect(() => {
    let timeOutId: ReturnType<typeof setTimeout>;

    if (apiError) {
      setAddClassName(false);

      timeOutId = setTimeout(() => {
        setAddClassName(true);
      }, 3000);
    }

    return () => {
      clearTimeout(timeOutId);
    };
  }, [apiError]);

  const errorMessage = apiError?.message as RequestMethod;

  return (
    <div
      data-cy="ErrorNotification"
      className={cn('notification', 'is-danger', 'is-light',
        ' has-text-weight-normal', {
          hidden: addClassName,
        })}
    >
      <button
        data-cy="HideErrorButton"
        aria-label="Close error window"
        type="button"
        className="delete"
        onClick={() => setAddClassName(true)}
      />
      {responseErrors[errorMessage]}
    </div>
  );
};
