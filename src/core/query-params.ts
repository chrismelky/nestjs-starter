export class QueryOption {
  constructor(
    public columns?: string,
    public page?: number,
    public perPage?: number,
    public sortField?: string,
    public sortOrder?: string,
  ) {}
}
