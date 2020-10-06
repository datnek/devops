import { Post } from './post.model';

describe('Post', () => {
  it('should create an instance', () => {
    expect(new Post('Problème de configuration ', 'Mise en place...')).toBeTruthy();
  });
});
