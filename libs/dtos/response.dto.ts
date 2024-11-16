import { TypeErrors } from '../constants/errors';

export interface ResponseDto {
  status: number;
  data: any;
  errorMessage: TypeErrors;
}
