export class Area {
  id: number;
  name: string;
  floor: number;
  visible: boolean;
  constructor(data: Partial<Area>) {
    this.id = data.id;
    this.name = data.name;
    this.floor = data.floor;
    this.visible = data.visible;
  }
}
