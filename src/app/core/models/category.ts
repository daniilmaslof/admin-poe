export class Category {
  id: number;
  name: string;
  editable: boolean;
  quickSearch: boolean;

  constructor(data: Category) {
    this.id = data.id;
    this.quickSearch = data.quickSearch;
    this.name = data.name;
    this.editable = data.editable;
  }
}
