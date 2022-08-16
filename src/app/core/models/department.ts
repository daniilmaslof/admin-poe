export class Department {
  id: number;
  name: string;
  reception: string;
  idHIS: string;

  idQMS: string;

  qmsSOW: string;
  constructor(data: Department) {
    this.id = data.id;
    this.idHIS = data.idHIS;
    this.idQMS = data.idQMS;
    this.qmsSOW = data.qmsSOW;
    this.name = data.name;
    this.reception = data.reception;
  }
}
