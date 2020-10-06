import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Post} from '../models/post.model';
import {environment} from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(private http: HttpClient) { }

  rootURL = environment.api;

  // tslint:disable-next-line:typedef
  get() {
    return this.http.get<Post[]>(this.rootURL + '/posts');
  }

  // tslint:disable-next-line:typedef
  getById(id: number) {
    return this.http.get<Post>(this.rootURL + '/posts' + id);
  }

  // tslint:disable-next-line:typedef
  add(post: Post) {
    console.log('add the post: ', post);
    return this.http.post<Post>(this.rootURL + '/posts', post);
  }

  // tslint:disable-next-line:typedef
  edit(post: Post) {
    console.log('edit the post: ', post);
    return this.http.post<Post>(this.rootURL + '/posts/update/' + post._id, post);
  }

  // tslint:disable-next-line:typedef
  delete(post: Post) {
    console.log('delete the post: ', post);
    return this.http.get<any>(this.rootURL + '/posts/delete/' + post._id);
  }
}
