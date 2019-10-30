const express = require("express");
const router = express.Router();
const db = require("./userDb.js");

router.post("/", validateUser, (req, res) => {
  const newPost = req.body;
  db.insert(newPost)
    .then(data => res.status(201).json(newPost))
    .catch(err => {
      res
        .status(500)
        .json({
          message: "There was an error while saving the post to the database."
        });
    });
});

router.post("/:id/posts", validateUserId, (req, res) => {
  const id = req.params.id;
  db.getUserPosts(id).then(posts => {
    db.insert({ ...req.body, ...posts.postedBy }).then(newPost => {
      res.status(200).json(newPost);
    });
  })
  .catch(error => {
    console.log(error);
    res.status(500).json({ message: "There was an error while saving the post to the database" });
  })
});

router.get("/", (req, res) => {
  db.get()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ message: "Error retrieving the users" });
    });
});

router.get("/:id", validateUserId, (req, res) => {
  db.getById(req.params.id)
    .then(user => {
      res.status(200).json(user);
    })
    .catch(error => {
      res.status(500).json({ message: "Error retrieving the user" });
    });
});

router.get("/:id/posts", validateUserId, (req, res) => {
  const id = req.params.id;
  // Check if ID exists
  db.getUserPosts(id)
    .then(post => {
      if (post) {
        res.status(201).json(post);
      } else {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      }
    })
    .catch(error => {
      res.status(500).json({ message: "Error retrieving the user posts" });
    });
});

router.delete("/:id", validateUserId, (req, res) => {
  const id = req.params.id;
  db.remove(id).then(user => {
    res.status(200).json({ message: "User deleted." });
  });
});

router.put("/:id", validateUser, (req, res) => {
  const id = req.params.id;
  const updataUser = req.body;

  db.update(id, updataUser)
    .then(user => {
      res.status(200).json({
        message: "The user was updated",
        post: updataUser
      });
    })
    .catch(err => {
      res.status(500).json({ message: "Error updating the user" });
    });
});

//custom middleware

function validateUserId(req, res, next) {
  //validate user ID here (ID param)
  if (req.params.id) {
    next();
  } else {
    res.status(400).json({ message: "Invalid user ID" });
  }
}

function validateUser(req, res, next) {
  //validate body (name field) on request to create a new user
  if (!req.body.name) {
    res.status(400).json({ message: "Missing user data" });
  } else if (!req.body.name) {
    res.status(400).json({ message: "Missing required name field" });
  } else {
    next();
  }
}

function validatePost(req, res, next) {
  //validate body (text field) of request to create a new post
  if (!req.body) {
    res.status(400).json({ message: "Missing post data" });
  } else if (!req.body.test) {
    res.status(400).json({ message: "Missing required text field" });
  } else {
    next();
  }
}

module.exports = router;
