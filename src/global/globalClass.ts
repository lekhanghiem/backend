export class ResponseData<D> {
  data: D | D[];  // Data có thể là đối tượng D hoặc mảng của D
  statusCode: number;
  message: string;

  constructor(data: D | D[], statusCode: number, message: string) {
    this.data = data;
    this.statusCode = statusCode;
    this.message = message;
  }
}
