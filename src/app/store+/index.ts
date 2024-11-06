import { ActionReducerMap } from '@ngrx/store';
import {AppState} from './app.state';
import {mainPageStateReducer} from '../main-page/store/reducer';

export const reducers: ActionReducerMap<AppState> = {
  mainPage: mainPageStateReducer,
};
