export interface RepositoryResponse<T> {
  data: T | null;
  errorMessage: string | null;
  errorRaw: Error | null;
}
