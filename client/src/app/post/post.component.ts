import { Component, OnInit } from '@angular/core';
import {PostService} from '../services/post.service';
import {Post} from '../models/post.model';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {

  posts: Post[] = [];
  post: Post = null;
  isLoading: boolean;
  savechanged: boolean;
  constructor(private postService: PostService) { }

  // tslint:disable-next-line:typedef
  async ngOnInit() {
    await this.initPost();
  }

  // tslint:disable-next-line:typedef
  async addPost(e) {
    this.isLoading = true;
    this.savechanged = false;
    if (e) {
      e.preventDefault();
    }

    try {
      if (this.post.title && this.post.description) {
        if (this.post._id){
          const post = await this.postService.edit(this.post).toPromise();
         // console.log('-----------------------------------------------------------------------------------------');
        } else {
          const post = await this.postService.add(this.post).toPromise();
        }
        await this.initPost();
        this.savechanged = true;
        return ;
      }
      alert('titre et la description du post sont obligatoire');
    } catch (e) {
      console.log(e);
    } finally {
      this.isLoading = false;
    }

  }


  // tslint:disable-next-line:typedef
  async setPost(e, post: Post) {
   if (e) {
     e.preventDefault();
   }
   this.post = post;
  }


  // tslint:disable-next-line:typedef
  async deletePost(e, post: Post) {

    if (e) {
      e.preventDefault();
      if (!confirm('Voulez-vous vraiment supprimer ce post ?')) { return ; }
    }


    const item = await this.postService.delete(post).toPromise();
    // console.log('result delete :', item);
    await this.initPost();

    if (!e) {
      this.posts = this.posts.filter(f => f._id !== post._id);
    }
  }


  // tslint:disable-next-line:typedef
  async initPost(){
    this.post = new Post(null, null);
    await this.refresh();
  }

  // tslint:disable-next-line:typedef
  async refresh() {
    this.posts = await this.postService.get().toPromise();
  }

}
