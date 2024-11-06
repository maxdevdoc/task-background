import { Form } from './interface';

export interface MainPageState {
  forms: { [key: string]: Form };
  loading: boolean;
  error: any;
}

export const initialState: MainPageState = {
  forms: {},
  loading: false,
  error: null,
};
