import { IsNotEmpty } from 'class-validator';

export class CreateMenuDto {
  @IsNotEmpty()
  public label: string;
  public routerLink?: string;
  public icon?: string;
  public parentId?: number;
}
