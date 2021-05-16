export class Category {
  id: number;
  name: string;
  editable: boolean;

  constructor(data: Category) {
    this.id = data.id;
    this.name = data.name;
    this.editable = data.editable;
  }
}
