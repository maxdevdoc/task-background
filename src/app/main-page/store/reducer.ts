import { initialState, MainPageState } from './state';
import { Action, createReducer, on } from '@ngrx/store';
import {
  createFieldActionSuccess,
  createFormActionSuccess,
  loadData,
  loadDataFailure,
  loadDataSuccess,
  saveFormFailure,
  saveFormSuccess
} from './action';

export const _mainPageReducer = createReducer(
  initialState,

  on(loadData, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(loadDataSuccess, (state, { data }) => {
    return {
      ...state,
      loading: false,
      forms: { ...state.forms, ...data }
    };
  }),
  on(createFieldActionSuccess, (state, { data: field, formKey }) => ({
    ...state,
    forms: {
      ...state.forms,
      [formKey]: {
        ...state.forms[formKey],
        fields: [
          ...state.forms[formKey].fields,
          field
        ]
      }
    },
    loading: false,
    error: null
  })),

  on(loadDataFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  on(loadDataFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  on(saveFormSuccess, (state) => ({
    ...state,
    error: null
  })),

  on(saveFormFailure, (state, { error }) => ({
    ...state,
    error
  }))
);

export function mainPageStateReducer(state: MainPageState | undefined, action: Action): MainPageState {
  return _mainPageReducer(state, action);
}
