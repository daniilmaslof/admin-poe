export class FloorModel {
  id: number;
  number: number;
  visible: boolean;

  constructor(data: FloorModel) {
    this.id = data.id;
    this.number = data.number;
    this.visible = data.visible;
  }
}
