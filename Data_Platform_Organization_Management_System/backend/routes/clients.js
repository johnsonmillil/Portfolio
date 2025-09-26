// This file stores all the API endpoints for making calls to the "clients" collection in the MongoDB database

// Import functionalities
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ dest: "uploads/", storage: storage });

// Middleware for authorization. For API calls that require authorization, this middleware checks if the header of API calls have a valid security token. If no security token or invalid security token, then the API call is not made.
const authMiddleWare = require("../auth/authMiddleWare");

// importing data model schemas
const { clients, events } = require("../models/models");
const { ObjectId } = require("mongodb");

// reading the org id from the environment variable
const org = process.env.ORG_ID;

// API Endpoint to Get all clients
router.get("/", authMiddleWare, async (req, res) => {
  try {
    const cli = await clients.find({});
    res.json(cli);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// API endpoint to GET single client by ID
router.get("/id/:id", authMiddleWare, (req, res, next) => {
  clients.findOne({ _id: req.params.id, orgs: org }, (error, data) => {
    if (error) {
      return next(error);
    } else if (!data) {
      res.status(400).send("Client not found");
    } else {
      // Get client profile picture from uploads folder
      if (data.profilePicture) {
        data.profilePicture =
          req.protocol + "://" + req.get("host") + "/" + data.profilePicture;
      }
      res.json(data);
    }
  });
});

// API endpoint to GET entries based on search query
// Ex: '...?firstName=Bob&lastName=&searchBy=name'
router.get("/search", authMiddleWare, (req, res, next) => {
  const dbQuery = { orgs: org };
  let queryArray = [];
  let regexOptions = "i";

  switch (req.query.searchBy) {
    case "name":
      if (req.query.firstName) {
        const firstNameRegex = new RegExp(
          `.*${req.query.firstName}.*`,
          regexOptions
        );
        queryArray.push({ firstName: { $regex: firstNameRegex } });
      }
      if (req.query.lastName) {
        const lastNameRegex = new RegExp(
          `.*${req.query.lastName}.*`,
          regexOptions
        );
        queryArray.push({ lastName: { $regex: lastNameRegex } });
      }
      break;
    case "number":
      if (req.query.phoneNumber) {
        const phoneNumberRegex = new RegExp(
          `.*${req.query.phoneNumber}.*`,
          regexOptions
        );
        queryArray.push({
          "phoneNumber.primary": { $regex: phoneNumberRegex },
        });
      }
      break;
    default:
      return res.status(400).send("invalid searchBy");
  }

  dbQuery["$and"] = queryArray;
  clients.find(dbQuery, (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.json(data);
    }
  });
});

// Set up static directory to serve uploaded files
router.use("/uploads", express.static(path.join(__dirname, "uploads")));

// POST create new client
router.post(
  "/",
  authMiddleWare,
  upload.single("profilePicture"),
  (req, res, next) => {
    const newClient = req.body;
    newClient.profilePicture = req.file ? `uploads/${req.file.filename}` : null;
    newClient.orgs = [org];
    clients.create(newClient, (error, data) => {
      if (error) {
        return next(error);
      } else {
        res.status(200).send("New client created successfully");
      }
    });
  }
);

// API endpoint to PUT update client
router.put("/update/:id", authMiddleWare, (req, res, next) => {
  const clientData = req.body;
  clientData.profilePicture = req.file ? `uploads/${req.file.filename}` : null;
  clients.findByIdAndUpdate(req.params.id, req.body, (error, data) => {
    if (error) {
      return next(error);
    } else {
      if (!data) res.status(400).send("Client not found.");
      else res.status(201).send("Client updated successfully");
    }
  });
});

// API endpoint to hard delete client by ID, can be only be done if client is not signed up for events
router.delete("/:id", authMiddleWare, (req, res, next) => {
  clients.findOne({ _id: req.params.id, orgs: org }, (error, data) => {
    if (error) {
      return next(error);
    } else if (!data) {
      res.status(400).send("Client not found");
    } else {
      events.find({ attendees: req.params.id, org: org }, (error, data) => {
        if (error) {
          return next(error);
        } else {
          // only delete event if no client is not signed up for any event
          if (data.length === 0)
            clients.findByIdAndDelete(req.params.id, (error, data) => {
              if (error) {
                return next(error);
              } else if (!data) {
                res.status(400).send("Client not found");
              } else {
                res.status(200).send("Client deleted successfully");
              }
            });
          else
            res
              .status(406)
              .send("Client is signed up for events and can't be deleted.");
        }
      });
    }
  });
});

// GET clients by zip code for dashboard
router.get("/byzip", (req, res, next) => {
  clients.aggregate(
    [
      {
        $match: {
          "address.zip": { $exists: true, $ne: "" },
        },
      },
      {
        $group: {
          _id: "$address.zip",
          count: { $sum: 1 },
        },
      },
    ],
    (error, data) => {
      if (error) {
        return next(error);
      } else {
        return res.json(data);
      }
    }
  );
});

// GET client data in async fashion.
async function getClientData(id) {
  const clnt = await clients.findOne({ _id: id, orgs: org });
  return clnt;
}
// GET client events data in async fashion.
async function getClientEvents(id) {
  const evnts = await events.find({ attendees: id, org: org });
  return evnts;
}
// GET non client data in async fashion.
async function getNonClientEvents(id) {
  const eventsNotRegistered = await events.find({
    attendees: { $nin: [id] },
    org: org,
  });
  return eventsNotRegistered;
}

// API endpoint to GET all details of a client by ID
router.get("/client/:id", authMiddleWare, async (req, res, next) => {
  resultData = {};
  resultData.clientData = await getClientData(req.params.id);
  resultData.clientEvents = await getClientEvents(req.params.id);
  resultData.nonClientEvents = await getNonClientEvents(req.params.id);
  res.json(resultData);
});

module.exports = router;
