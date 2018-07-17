import { common, mappings } from './mappings';

export default class Comment {
  constructor(comment) {
    common.forEach(
      field =>
        field in comment && Object.assign(this, { [field]: comment[field] })
    );
    Object.entries(mappings).forEach(
      ([key, value]) =>
        value in comment && Object.assign(this, { [key]: comment[value] })
    );
  }
}
