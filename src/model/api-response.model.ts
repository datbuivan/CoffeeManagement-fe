// app/models/api-response.model.ts
export interface ApiResponse<T> {
  data: T;
  message?: string;
  statusCode: number;
}
