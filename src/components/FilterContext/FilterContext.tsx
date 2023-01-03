import React from 'react';
import { FilterOptions as Options } from '../../types/FilterOptions';

export const filterByContext = React.createContext<Options>(Options.All);
