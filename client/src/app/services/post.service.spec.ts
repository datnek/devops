import {fakeAsync, inject, TestBed, tick} from '@angular/core/testing';

import { PostService } from './post.service';
import {environment} from '../../environments/environment.prod';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {Post} from '../models/post.model';
import {HttpResponse} from '@angular/common/http';

// https://www.youtube.com/watch?v=-p6q9aShdwM
// https://guide-angular.wishtack.io/angular/testing/unit-testing/unit-test-et-httpclient
// https://www.concretepage.com/angular/angular-test-http-post
// https://www.concretepage.com/angular/angular-test-http-post
// https://guide-angular.wishtack.io/angular/testing/unit-testing/unit-test-asynchrone
// https://levelup.gitconnected.com/test-angular-components-and-services-with-http-mocks-e143d90fa27d
const post = new Post('Authentification jwt update', 'Mise en place d\'un code d\'authentification avec python et jwt');


describe('PostService', () => {

  const resources = `${environment.api}`;
  // let httpMock: HttpTestingController;
  // let postService: PostService;

  beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [PostService]
      });

      // httpMock = TestBed.get(HttpTestingController);
    }
  );


  it('should be initialized', inject( [PostService], (postService: PostService) => {
    expect(postService).toBeTruthy();
  }));


  it('should be get all post',  fakeAsync(inject( [PostService, HttpTestingController],
    (postService: PostService, httpMock: HttpTestingController) => {
      // arange
      const postsDump = [
        {
          _id: '5f08939fe7fc9931cbf0f6e7',
          title: 'Authentification jwt update',
          description: 'Mise en place d\'un code d\'authentification avec python et jwt',
          createdAt: '2020-07-10T16:13:19.919Z',
          updatedAt: '2020-07-10T16:14:00.143Z',
          __v: 0
        },
        {
          _id: '5f08c4a45ea4800ed2609364',
          title: 'deployement devops',
          description: 'exemple de déployement',
          createdAt: '2020-07-10T19:42:28.687Z',
          updatedAt: '2020-07-10T19:42:28.687Z',
          __v: 0
        },
        {
          _id: '5f0b532d581c9f71650f181e',
          title: 'tutoriel Specialisation devops',
          description: 'Ceci est un excellent tutoriel',
          createdAt: '2020-07-12T18:15:09.480Z',
          updatedAt: '2020-07-12T18:15:09.480Z',
          __v: 0
        }
      ];

      let posts: Post[] = [];

      // act
      postService.get().subscribe(res => posts = res);

      // http mock
      const req = httpMock.expectOne(postService.rootURL + '/posts');
      req.flush(postsDump);

      // Assert
      expect(req.request.method).toBe('GET');
      expect(posts.length).toBe(3);
      expect(posts).toEqual(postsDump);

    })));


  it('should be add a new post',  fakeAsync(inject( [PostService, HttpTestingController],
    (postService: PostService, httpMock: HttpTestingController) => {

      // arange
      const postDumpResponse = {
        _id: '5f08939fe7fc9931cbf0f6e7',
        title: 'Authentification jwt',
        description: 'Mise en place d\'un code d\'authentification avec python et jwt',
        createdAt: '2020-07-10T16:13:19.919Z',
        updatedAt: '2020-07-10T16:14:00.143Z',
        __v: 0
      };

      const postDump = new Post('Authentification jwt',
        'Mise en place d\'un code d\'authentification avec python et jwt');

      // tslint:disable-next-line:no-shadowed-variable
      let post: Post = null;

      // act
      postService.add(postDump).subscribe(res => post = res);

      // http mock
      const req = httpMock.expectOne(postService.rootURL + '/posts');

      // Expect server to return the employee after POST
      const expectedResponse = new HttpResponse({ status: 201, statusText: 'Created', body: postDumpResponse });
      req.event(expectedResponse);

      // Assert
      expect(req.request.method).toBe('POST');
      expect(post._id).not.toBeNull();
      expect(post.title).toEqual(postDump.title);
      expect(post.description).toEqual(postDump.description);

    })));


  it('should be update a  post',  fakeAsync(inject( [PostService, HttpTestingController],
    (postService: PostService, httpMock: HttpTestingController) => {

      // arange
      const postDumpResponse = {
        _id: '5f08939fe7fc9931cbf0f6e7',
        title: 'Authentification jwt update',
        description: 'Mise en place d\'un code d\'authentification avec python et jwt update',
        createdAt: '2020-07-10T16:13:19.919Z',
        updatedAt: '2020-07-10T16:14:00.143Z',
        __v: 0
      };

      const postDump = new Post(
        'Authentification jwt update',
        'Mise en place d\'un code d\'authentification avec python et jwt update',
         '5f08939fe7fc9931cbf0f6e7');

      // tslint:disable-next-line:no-shadowed-variable
      let post: Post = null;

      // act
      postService.edit(postDump).subscribe(res => post = res);

      // http mock
      const req = httpMock.expectOne(postService.rootURL + '/posts/update/' + postDump._id);

      // Expect server to return the employee after POST
      const expectedResponse = new HttpResponse({ status: 200, statusText: 'Updated', body: postDumpResponse });
      req.event(expectedResponse);

      // Assert
      expect(req.request.method).toBe('POST');
      expect(post._id).not.toBeNull();
      expect(post.title).toEqual(postDump.title);
      expect(post.description).toEqual(postDump.description);

    })));


  it('should be delete a  post',  fakeAsync(inject( [PostService, HttpTestingController],
    (postService: PostService, httpMock: HttpTestingController) => {

      // arange
      const messageResponse = {message: 'post deleted successfully!'};

      const postDump = new Post(
        'Authentification jwt update',
        'Mise en place d\'un code d\'authentification avec python et jwt update',
        '5f08939fe7fc9931cbf0f6e7');

      // tslint:disable-next-line:no-shadowed-variable
      let response: any = null;

      // act
      postService.delete(postDump).subscribe(res => response = res);

      // http mock
      const req = httpMock.expectOne(postService.rootURL + '/posts/delete/' + postDump._id);

      // Expect server to return the employee after POST
      const expectedResponse = new HttpResponse({ status: 200, statusText: 'delete', body: messageResponse });
      req.event(expectedResponse);

      // Assert
      expect(req.request.method).toBe('GET');
      expect(response).toBe(messageResponse);

    })));


  /*
  it('should be initialized', inject( [PostService], (postService: PostService) => {
    expect(postService).toBeTruthy();
  }));


  it('should be get all post',  inject( [PostService, HttpTestingController],
    (postService: PostService, httpMock: HttpTestingController) => {
    // arange
   const posts = [
     {
       _id: '5f08939fe7fc9931cbf0f6e7',
       title: 'Authentification jwt update',
       description: 'Mise en place d\'un code d\'authentification avec python et jwt',
       createdAt: '2020-07-10T16:13:19.919Z',
       updatedAt: '2020-07-10T16:14:00.143Z',
       __v: 0
     },
     {
       _id: '5f08c4a45ea4800ed2609364',
       title: 'deployement devops',
       description: 'exemple de déployement',
       createdAt: '2020-07-10T19:42:28.687Z',
       updatedAt: '2020-07-10T19:42:28.687Z',
       __v: 0
     },
     {
       _id: '5f0b532d581c9f71650f181e',
       title: 'tutoriel Specialisation devops',
       description: 'Ceci est un excellent tutoriel',
       createdAt: '2020-07-12T18:15:09.480Z',
       updatedAt: '2020-07-12T18:15:09.480Z',
       __v: 0
     }
   ];

    // act
   postService.get().subscribe(res => {
      expect(res.length).toBe(3);
      expect(res).toEqual(posts);
    });

   // http mock
   const req = httpMock.expectOne(postService.rootURL + '/posts');

    // Assert
   expect(req.request.method).toBe('GET');
   req.flush(posts);

  }));
  */

});
