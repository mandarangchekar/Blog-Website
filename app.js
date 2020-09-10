//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");


const homeStartingContent = "The daily log is when you journal about your day-to-day: what you did, what you ate, who you saw and spoke with. Whatever you want. It’s a working way to log your life. The best part about this journaling habit is that you literally have a hand-written record of what you’ve done on any given day… And believe me when I tell you that it comes in handy.";
const aboutContent = "Not only can a journal be a place where we store important information, record quotes or sayings that move us, but it’s also a wonderful tool to help us analyze where we are at and where we want to go.A journal can be used in a number of different ways. Personally, I do quite a few different things in my journal. Below, I will give you an excerpt from my own personal journal, but first I want to jump into five reasons why you should consider keeping a journal.";
const contactContent = "Now yo can communicate with yourself, especially by speaking or writing to them regularly.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));


mongoose.connect("mongodb://localhost:27017/blogDB", {useNewUrlParser: true, useUnifiedTopology: true});

const postSchema = {
    title: String,
    content: String
};

const Post = mongoose.model("Post", postSchema);



app.get("/", function(req, res){

  Post.find({}, function(err, posts){
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts
      });
  });

});



app.get("/contact", function(req, res) {
    res.render("contact", {
        contact: contactContent

    });
});


app.get("/about", function(req, res) {
    res.render("about", {
        about: aboutContent

    });
});

app.get("/compose", function(req, res) {




    res.render('compose');

});

app.post('/compose', function(req, res) {

    const post = new Post({
        title:req.body.postTitle,
        content: req.body.postBody
    });

    // const post = {
    //     title: req.body.postTitle,
    //     content: req.body.postBody
    // };
    post.save(function(err){
        if(!err){
            res.redirect('/');
        }
    });

});









app.get("/posts/:postId", function(req, res){

const requestedPostId = req.params.postId;

  Post.findOne({_id: requestedPostId}, function(err, post){
    res.render("post", {
      title: post.title,
      content: post.content
    });
  });

});

//     posts.forEach(function(post) {
//         const storedTitle = _.lowerCase(post.title);
//
//         if (storedTitle === requestedTitle) {
//
//             res.render('post',{
//                 postPageTitle: post.title,
//                 postPageContent: post.content
//
//         })
//     }
//
//     });
// });




app.listen(3000, function() {
    console.log("Server started on port 3000");
});
