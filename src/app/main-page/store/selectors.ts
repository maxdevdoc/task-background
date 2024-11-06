import { createFeatureSelector, createSelector } from '@ngrx/store';
import { MainPageState } from './state';

export const selectMainPageState = createFeatureSelector<MainPageState>('mainPage');

export const selectMainPageData = createSelector(
  selectMainPageState,
  (state) => state.forms
);


export const selectMainPageLoading = createSelector(selectMainPageState, (state) => state.loading);
export const selectMainPageError = createSelector(selectMainPageState, (state) => state.error);
