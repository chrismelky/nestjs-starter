export class QueryParams {
  constructor(
    public columns?: string,
    public page?: number,
    public size?: number,
    public sortField?: string,
    public sortOrder?: string,
    public search?: any,
  ) {}
}
