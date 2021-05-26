const express = require("express");

const connectDb = require("./config/connectDb");

connectDb();

const app = express();

app.use(express.json());

// creating the schema

const User = require("./models/User");

//Create and Save a Record of a Model

app.post("/users", (req, res) => {
  const { name, age, favoriteFoods } = req.body;
  const user = new User({ name, age, favoriteFoods });
  user
    .save()
    .then((newUser) => res.send({ msg: "User added successfully!", newUser }))
    .catch((err) => res.send({ msg: "Adding user failed!", err }));
});

//Create Many Records with model.create()

app.post("/users/many", (req, res) => {
  let newUsers = req.body;
  User.create(newUsers, function (err, result) {
    if (result) {
      res.send({ msg: "New users are added!", result });
    } else {
      res.send({ msg: "Adding new users is failed!", err });
    }
  });
});

//Use model.find() to Search Your Database

app.get("/users", (req, res) => {
  User.find()
    .then((users) => res.send({ msg: "Get users", users }))
    .catch((err) => res.send({ msg: "Cannot get users", err }));
});

//Use model.findOne() to Return a Single Matching Document from Your Database

app.get("/users/:userFavFood", (req, res) => {
  User.findOne({ favoriteFoods: req.params.userFavFood  }).then(
    (contactToFind) => {
      if (contactToFind) {
        res.status(200).send({ msg: "User found", contactToFind });
        console.log(contactToFind);
      } else {
        res.status(400).send({ msg: "Cannot find user loving this food" });
      }
    }
  );
});

//Use model.findById() to Search Your Database By _id

app.get("/users/:userId", (req, res) => {
  const id = req.params.userId;
  User.findById(id)
    .then((user) => res.send({ msg: "User is found", user }))
    .catch((err) => res.status(400).send({ msg: "user is not found", err }));
});

//Perform Classic Updates by Running Find, Edit, then Save

app.put("/users/:userId", (req, res) => {
  const id = req.params.userId;
  User.findByIdAndUpdate(id, req.body, { new: true })
    .then((updatedUser) =>
      res.send({ msg: "the user is updated", updatedUser })
    )
    .catch((err) => res.send({ msg: "edit error", err }));
});

//Perform New Updates on a Document Using model.findOneAndUpdate()

app.put("/users/change-age/:userName", (req, res) =>  {
  const searchable = req.params.userName;
  User.findOneAndUpdate({ name: searchable }, { age: 20 }, { new: true })
    .then((updatedUser) => res.send({ msg: "the user age is 20", updatedUser }))
    .catch((err) => res.send({ msg: "edit error", err }));
});

//Delete One Document Using model.findByIdAndRemove
app.delete("/users/:userId", (req, res) => {
  const id = req.params.userId;
  User.findByIdAndRemove(id)
    .then((user) => {
      if (!user) {
        return res.send({ msg: "user not found" });
      }
      res.send({ msg: "user deleted with success", user });
    })

    .catch((err) => res.status(400).send({ msg: "delete error", err }));
});

//MongoDB and Mongoose - Delete Many Documents with model.remove()
//***************************************/
app.delete("/users/delete/many", (req, res) => {
  User.deleteMany({ name: "Mary" })
    .then(() => res.send({ msg: "Users with the name of Mary were deleted" }))
    .catch((err) => res.send({ msg: "Remove error", err }));
});


app.get("/users-helpers", (req, res, done) => {
  User.find({ favoriteFoods: "Pizza " })
    .sort({ name: "desc" })
    .limit(2)
    .select("name favoriteFoods")
    .exec((err, data) => {
      if (err) {
        done(err);
        res.send({ msg: "Error helpers", err });
      } else {
        done(null, data);
        res.send({ msg: "2 users loving pizza", data });
      }
    });
});

const port = 3001;
app.listen(port, () => console.log(`Server running ${port}`));

