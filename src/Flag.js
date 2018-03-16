export default class Flag {
  constructor(flag) {
    this.id = flag.id;
    this.name = flag.name;
    this.typeId = flag.type_id;
    this.created = flag.creation_date;
    this.modified = flag.modification_date;
    this.status = flag.status;
    this.setter = flag.setter;
    this.requestee = flag.requestee;
  }
}
