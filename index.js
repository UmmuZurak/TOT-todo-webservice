require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const TodoModel = require("./schema/todo_schema");

const app = express();
const port = 3000 || process.env.PORT;

app.use(express.json());

const db = process.env.DB_URL;

mongoose
  .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("mongodb connected");
  })
  .catch((err) => {
    console.log(err);
  });

  

app.get("/", (req, res) => {
  return res.status(200).json({
    message: "Welcome to the todo API.",
  });
});

///get all todos
app.get("/todos", async (req, res) => {
  const todoModel = await TodoModel.find({});
  if (todoModel) {
    return res.status(200).json({
      status: true,
      message: "Todos fetched successfully",
      data: todoModel,
    });
  } else {
    return res.status(400).json({
      status: false,
      message: "Todos not found",
    });
  }
});

///get one todo (:id)
app.get("/todos/:id", async (req, res) => {
  const { id } = req.params;

  const todoModel = await TodoModel.findById(id);
  if (todoModel) {
    return res.status(200).json({
      status: true,
      message: "Todos fetched successfully",
      data: todoModel,
    });
  } else {
    return res.status(400).json({
      status: false,
      message: "Todos not found",
    });
  }
});

///create a todo
app.post("/todo", async (req, res) => {
  const { title, description, date_time } = req.body;

  const todoModel = await TodoModel.create({
    title,
    description,
    date_time,
  });

  if (todoModel) {
    return res.status(201).json({
      status: true,
      message: "Todos created",
      data: todoModel,
    });
  } else {
    return res.status(400).json({
      status: false,
      message: "Todos failed to create",
    });
  }
});

app.patch("/todos/:id", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const todoModel = await TodoModel.updateOne({ status: status }).where({ _id: id });

  if (todoModel) {
    return res.status(200).json({
      status: true,
      message: "Todos marked as completed!",
      data: todoModel,
    });
  } else {
    return res.status(400).json({
      status: false,
      message: "Todos failed to update",
    });
  }
});

///delete a todo
app.delete("/todos/:id", async (req, res) => {
  const todoModel = await TodoModel.findByIdAndDelete(req.params.id);

  if (todoModel) {
    return res.status(200).json({
      status: true,
      message: "Todo deleted!",
      data: todoModel,
    });
  } else {
    return res.status(400).json({
      status: false,
      message: "Todos failed to delete",
    });
  }
});

app.listen(port, () => console.log(`Listening on port ${port}...`));

// const http = require("http");

// const server = http.createServer((request, response) => {
//   //   console.log("hello world");
//   //   response.end(`${request.url}\n${request.method}\n${request.httpVersion}`);
//   response.end("Hello world");
// });

// // console.log("yellow");

// server.listen(3011, () => {
//   console.log("listening on port 3011");
// });
