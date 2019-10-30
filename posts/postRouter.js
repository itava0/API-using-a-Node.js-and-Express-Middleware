const express = require('express');

const router = express.Router();

const db = require('./postDb.js')

router.get('/', (req, res) => {
  db.get()
    .then(post => {
      res.status(200).json(post)
    })
    .catch(err => {
      console.log("GET to root failed:", err)
      res.status(500).json({ error: "The posts information could not be retrieved." })
  })
});

router.get('/:id', (req, res) => {
  const id = req.params.id
 db.getById(id)
  .then(post => {
    post.id
    ? res.status(200).json(post)
    : res.status(404).json({ message: "The post with the specified ID does not exist." })
  })
  .catch(err => {
    console.log("GET to root failed:", err)
    res.status(500).json({ error: "The post information could not be retrieved." })
})
});

router.delete('/:id', (req, res) => {
  const id = req.params.id;
  db.remove(id)
  .then(deleted => {
      deleted > 0
      ? res.status(200).json(deleted)
      : res.status(404).json({ message: "The post with the specified ID does not exist." })
  })
  .catch(err => {
      console.log("DELETE on post failed:", err)
      res.status(500).json({ error: "The post could not be removed." })
  })
});

router.put('/:id', (req, res) => {
  const post = req.body;
  const id = req.params.id; 
  console.log(id, post)
  if (!post.text || !post.user_id) {
     return res.status(400).json({ errorMessage: "Please provide text and user id for the post." })
  }
  db.update(id, post)
  .then(updated => {
      // If updated exists, find that post by it's ID
      if (updated > 0) {
          db.findById(id)
          .then(post => res.status(200).json(post))
          .catch(err => res.status(500).json({ errorMessage: "The post with the specified ID does not exist." }))
      } else res.status(404).json({ errorMessage: "The post with the specified ID does not exist." })
  })
  .catch(err => {
      console.log("PUT request on post failed:", err)
      res.status(500).json({ error: "The post information could not be modified." })
  })
});

// custom middleware

function validatePostId(req, res, next) {
  const body = req.body;
 if(!body) {
   return res.status(400).json({  message: "missing post data" })
 }
 if(!body.text) {
   return res.status(400).json({  message: "missing required text field" })
 }
 next();
};
module.exports = validatePostId;
module.exports = router;