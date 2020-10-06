export class Post {
  constructor(
              public title: string,
              public description: string,
              // tslint:disable-next-line:variable-name
              public _id: string = null,
              public createdAt: string = null,
              public updatedAt: string = null,
              // tslint:disable-next-line:variable-name
              public __v: number = null,
  ) {}
}
