import { Category } from './category';

export class Location {
  archId: string;
  archId2: string;
  name: string;
  description: string;
  floor: number;
  photo: string;
  area: string;
  isExpanded: boolean;
  category: string;
  locations: Location[];
  active: boolean;
  poi: boolean;

  public get type(): 'Loc' | 'POI' {
    return this.poi ? 'POI' : 'Loc';
  }

  public get isEnableExpanded(): boolean {
    return !!this.locations.length;
  }
  constructor(data: Partial<Location>) {
    this.photo = data.photo;
    this.archId = data.archId;
    this.archId2 = data.archId2;
    this.name = data.name;
    this.description = data.description;
    this.floor = data.floor;
    this.category = data.category;
    this.area = data.area;
    this.locations = (data.locations ?? []).map(loc => new Location(loc));
    this.active = data.active;
    this.poi = data.poi;

  }
}
