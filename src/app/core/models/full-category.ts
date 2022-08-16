import { Location } from './location';

export class FullCategory {
  id: number;
  name: string;
  quickSearch: boolean;
  locations: Location[];

  constructor(data: FullCategory) {
    this.id = data.id;
    this.name = data.name;
    this.quickSearch = data.quickSearch;
    this.locations = data.locations;
  }
}
