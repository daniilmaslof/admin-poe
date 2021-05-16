export class Location {
  archId: string;
  name: string;
  description: string;
  floor: number;
  area: string;
  category: any;
  locations: Location[];
  active: boolean;
  poi: boolean;

  public get type(): 'Loc' | 'POI' {
    return this.poi ? 'POI' : 'Loc';
  }

  constructor(data: Partial<Location>) {
    this.archId = data.archId;
    this.name = data.name;
    this.description = data.description;
    this.floor = data.floor;
    this.category = data.category;
    this.area = data.area;
    this.locations = data.locations;
    this.active = data.active;
    this.poi = data.poi;

  }
}
