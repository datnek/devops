const mongoose = require('mongoose');
const supertest = require('supertest');

const dbHandler = require('./db-handler');

const app = require('../server.test');

const request = supertest(app);


beforeAll(async () => await dbHandler.connect());


afterEach(async () => await dbHandler.clearDatabase());


afterAll(async () => await dbHandler.closeDatabase());



describe('add post ', () => {

    it('can be created correctly', async () => {

        const response = await request.post('/api/posts').send(postComplete);

        //console.log('response', response);
        expect(response.status).toBe(200);
        expect(response.body.title).toBe(postComplete.title);

    });
});

describe('edit post',  () => {


    it('can be edit correctly', async () => {

        const response = await request.post('/api/posts').send(postComplete);

        expect(response.status).toBe(200);
        expect(response.body.title).toBe(postComplete.title);

        const newPost = response.body;

        newPost.title = 'Tutoriel sur le Devops';
        newPost.description = 'Nouveau tutoriel nodejs + angular 10.';

        const response2 = await request.post('/api/posts/update/'+ newPost._id).send(newPost);

        expect(response2.status).toBe(200);
        expect(response2.body.title).toBe(newPost.title);
        expect(response2.body.description).toBe(newPost.description);
    });
});

describe('all post ',  () => {


    it('can be get all correctly', async () => {

        const response = await request.post('/api/posts').send(postComplete);

        expect(response.status).toBe(200);
        expect(response.body.title).toBe(postComplete.title);

        //const newPost = response.body;

        const response2 = await request.get('/api/posts').send();

        expect(response2.status).toBe(200);
        expect(response2.body[0].title).toBe(postComplete.title);

    });
});


describe('find post by id',  () => {


    it('can be find by id correctly', async () => {

        const response = await request.post('/api/posts').send(postComplete);

        expect(response.status).toBe(200);
        expect(response.body.title).toBe(postComplete.title);

        const newPost = response.body;

        const response2 = await request.get('/api/posts/'+ newPost._id).send();

        expect(response2.status).toBe(200);
        expect(response2.body.title).toBe(postComplete.title);

    });
});

describe('delete post ',  () => {


    it('can be delete correctly', async () => {

        const response = await request.post('/api/posts').send(postComplete);

        expect(response.status).toBe(200);
        expect(response.body.title).toBe(postComplete.title);

        const newPost = response.body;

        const response2 = await request.get('/api/posts/delete/'+ newPost._id).send();
        expect(response2.status).toBe(200);

        //console.log(newPost);
        const response3 = await request.get('/api/posts/'+ newPost._id).send();

        expect(response3.status).toBe(400);

    });
});


const postComplete = {
    title: 'Configuration du serveur de déployement',
    description: 'La configuration du serveur de déploiement dépend de plusieurs paramètres'
};


/*



describe('findby id ',  () => {

    it('can be findbyid correctly', async () => {
        const newPost = await postService.create(postComplete);
        const request = {
            body : newPost
        };
        expect(async () => await postService.findOne(request))
            .not
            .toThrow();
    });
});

describe('find all ',  () => {

    it('can be findall correctly', async () => {
        const newPost = await postService.create(postComplete);
        const request = {
            body : newPost
        };
        expect(async () => await postService.findAll(request))
            .not
            .toThrow();
    });
});

describe('delete all ',  () => {

    it('can be findall correctly', async () => {
        const newPost = await postService.create(postComplete);
        const request = {
            body : newPost
        };
        expect(async () => await postService.delete(request))
            .not
            .toThrow();
    });
});
*/
