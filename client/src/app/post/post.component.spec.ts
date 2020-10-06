import {async, ComponentFixture, fakeAsync, inject, TestBed, tick} from '@angular/core/testing';

import { PostComponent } from './post.component';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {PostService} from '../services/post.service';
import {Post} from '../models/post.model';
import {delay} from 'rxjs/operators';
import {of} from 'rxjs';

// https://codecraft.tv/courses/angular/unit-testing/mocks-and-spies/
// https://guide-angular.wishtack.io/angular/testing/unit-testing/unit-test-asynchrone
// https://levelup.gitconnected.com/test-angular-components-and-services-with-http-mocks-e143d90fa27d
// https://codehandbook.org/how-to-unit-test-angular-component-with-service/
describe('PostComponent', () => {
  let component: PostComponent;
  let fixture: ComponentFixture<PostComponent>;
  const newPost = new Post('Authentification jwt', 'Mise en place d\'un code d\'authentification avec python et jwt');
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

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ PostComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('refresh posts',  fakeAsync(inject( [PostService, HttpTestingController],
    async (postService: PostService, httpMock: HttpTestingController) => {

      const spy = spyOn(postService, 'get').and.returnValue(of(postsDump));

      await component.refresh();

      tick(1000);


      expect(component.posts.length).toEqual(3);

    })));


  it('set post',  fakeAsync(inject( [PostService, HttpTestingController],
    async (postService: PostService, httpMock: HttpTestingController) => {

      component.setPost(null, postsDump[0]);

      tick(1000);


      expect(component.post).toEqual(postsDump[0]);

    })));

  it('init posts',  fakeAsync(inject( [PostService, HttpTestingController],
    async (postService: PostService, httpMock: HttpTestingController) => {

      const spy = spyOn(postService, 'get').and.returnValue(of(postsDump));

      await component.initPost();

      tick(1000);


      expect(component.posts.length).toEqual(3);
      expect(component.post).not.toBeNull();

  })));

  it('delete a post',  fakeAsync(inject( [PostService, HttpTestingController],
    async (postService: PostService, httpMock: HttpTestingController) => {

      const spy1 = spyOn(postService, 'get').and.returnValue(of(postsDump));
      await component.ngOnInit();
      tick(1000);

      expect(component.posts.length).toEqual(3, 'the posts contains 3 items');

      const spy3 = spyOn(postService, 'delete').and.returnValue(of( {message: 'post deleted successfully!'}));

      await component.deletePost(null, postsDump[0]);

      tick(1000);


      expect(component.posts.length).toEqual(2, 'the posts contains 2 items');
      expect(component.post).not.toBeNull();

    })));


  it('create a new post',  fakeAsync(inject( [PostService, HttpTestingController],
    async (postService: PostService, httpMock: HttpTestingController) => {

      const spy1 = spyOn(postService, 'get').and.returnValue(of(postsDump));
      await component.ngOnInit();

      tick(2000);

     // const spy3 = spyOn(postService, 'add').and.returnValue(of( postsDump[0]));
      expect(component.savechanged).toBeUndefined();
      const spy3 = spyOn(postService, 'add').and.returnValue(of(postsDump[0]));
      component.post = newPost;
      await component.addPost(null);

      tick(5000);


      expect(component.savechanged).toBeTrue();
      expect(component.isLoading).toBeFalse();
      expect(component.post).toEqual(new Post(null, null));

    })));

  it('update a  post',  fakeAsync(inject( [PostService, HttpTestingController],
    async (postService: PostService, httpMock: HttpTestingController) => {

      const spy1 = spyOn(postService, 'get').and.returnValue(of(postsDump));
      await component.ngOnInit();
      tick(2000);

      // const spy3 = spyOn(postService, 'add').and.returnValue(of( postsDump[0]));
      expect(component.savechanged).toBeUndefined();
      const spy3 = spyOn(postService, 'edit').and.returnValue(of(postsDump[0]));
      component.post = newPost;
      component.post._id = postsDump[0]._id;
      component.post.title = postsDump[0].title;
      await component.addPost(null);

      tick(5000);


      expect(component.savechanged).toBeTrue();
      expect(component.isLoading).toBeFalse();
      expect(component.post).toEqual(new Post(null, null));

    })));

});
