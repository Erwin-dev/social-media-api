const request = require("supertest");
const app = require("../index");
const Post = require("../models/Post");
const User = require("../models/User");

describe("POST /api/posts", () => {
    let post;
    beforeEach(async () => {
        post = {
            desc: "sampledata"
            , userId: new User({
                username: "testuser"
            })
        }
    });

    afterEach(async () => {
        await Post.deleteMany();
    });

    it("should create and save new post", async () => {
        const response = await request(app)
            .post("/api/posts")
            .send(post);
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Post created successfully')
    });

    it("should return a 500 error if the post isn't created", async () => {
        delete post['userId'];
        const response = await request(app)
            .post("/api/posts")
            .send(post);
        expect(response.status).toBe(500);
    });
});

describe("PUT /api/posts/:id", () => {
    let post;

    beforeEach(async () => {
        post = new Post({
            desc: "sampledata"
            , userId: "erwin"
        });
        await post.save();
    });

    afterEach(async () => {
        await Post.deleteMany({});
    });

    it('should update post if userId matches', async () => {
        const res = await request(app)
            .put(`/api/posts/${post._id}`)
            .send({
                desc: "newsampledata"
                , userId: "erwin"
            });
        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toEqual("Post has been updated");
    });

    it('should return 403 if userId doesnt match', async () => {
        const res = await request(app)
            .put(`/api/posts/${post._id}`)
            .send({
                desc: "test"
                , userId: "kuba"
            });
        expect(res.statusCode).toEqual(403);
        expect(res.body).toEqual("This is not your post");
    });

});

describe('GET /api/posts/:id/like', () => {
    let post;

    beforeEach(async () => {
        post = new Post({
            desc: "test"
            , userId: "erwin"
            , likes: []
        });
        await post.save();
    });

    afterEach(async () => {
        await Post.deleteMany({});
    });

    it('should like post if userId not in likes array', async () => {
        const res = await request(app)
            .get(`/api/posts/${post._id}/like`)
            .send({
                userId: "erwin"
            });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual("the post has been liked");
    });

    it('should dislike post if userId in likes array', async () => {
        post.likes.push("kuba");
        await post.save();
        const res = await request(app)
            .get(`/api/posts/${post._id}/like`)
            .send({
                userId: "kuba"
            });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual("the post has been disliked");
    });
});

describe('DELETE /api/posts/:id', () => {
    let postId;
    beforeEach(async () => {
        const post = new Post({
            desc: 'test'
            , userId: 'erwin'
        });
        await post.save();
        postId = post._id;
    });

    it('should delete a post', async () => {
        const res = await request(app)
            .delete(`/api/posts/${postId}`)
            .send({
                userId: 'erwin'
            });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual('Post has been deleted');
    });

    it('should return 403 if userId doesnt match', async () => {
        const res = await request(app)
            .delete(`/api/posts/${postId}`)
            .send({
                userId: 'kuba'
            });

        expect(res.statusCode).toEqual(403);
        expect(res.body).toEqual('This is not your post');
    });
});

describe('GET /api/posts/:id', () => {
    let post;

    beforeEach(async () => {
        post = await new Post({
            desc: 'test'
            , userId: '123'
        }).save();
    });

    it('should get a post by id', async () => {
        const res = await request(app)
            .get(`/api/posts/${post._id}`);

        expect(res.statusCode).toEqual(200);
    });
});
