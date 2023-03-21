const express = require("express");
const router = express.Router();
const User = require("../models/user");
const PitchDeck = require("../models/user");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const fs = require('fs-extra');
const document = require("file-convert");
const { ImageMagick } = require('pdf-images');
const path = require('path');

const {
  getToken,
  COOKIE_OPTIONS,
  getRefreshToken,
  verifyUser,
} = require("../authenticate");

router.post("/signup", (req, res, next) => {
  // Verify that first name is not empty
  if (!req.body.firstName || !req.body.lastName || !req.body.username || !req.body.password || !req.body.companyName  ) {
    res.statusCode = 500;
    res.send({
      name: "EmptyFieldError",
      message: "All fields are required.",
    });
  } else {
    User.register(
      new User({ username: req.body.username }),
      req.body.password,
      (err, user) => {
        if (err) {
          res.statusCode = 500;
          res.send(err);
        } else {
          user.firstName = req.body.firstName;
          user.lastName = req.body.lastName || "";
          user.companyName = req.body.companyName || "";
          const token = getToken({ _id: user._id });
          const refreshToken = getRefreshToken({ _id: user._id });
          user.refreshToken.push({ refreshToken });
          user.save((err, user) => {
            if (err) {
              res.statusCode = 500;
              res.send(err);
            } else {
              res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);
              res.send({ success: true, token });
            }
          });
        }
      }
    );
  }
});

router.post("/login", passport.authenticate("local"), (req, res, next) => {
  const token = getToken({ _id: req.user._id });
  const refreshToken = getRefreshToken({ _id: req.user._id });
  User.findById(req.user._id).then(
    (user) => {
      user.refreshToken.push({ refreshToken });
      user.save((err, user) => {
        if (err) {
          res.statusCode = 500;
          res.send(err);
        } else {
          res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);
          res.send({ success: true, token });
        }
      });
    },
    (err) => next(err)
  );
});

router.post("/refreshToken", (req, res, next) => {
  const { signedCookies = {} } = req;
  const { refreshToken } = signedCookies;

  if (refreshToken) {
    try {
      const payload = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );
      const userId = payload._id;
      User.findOne({ _id: userId }).then(
        (user) => {
          if (user) {
            // Find the refresh token against the user record in database
            const tokenIndex = user.refreshToken.findIndex(
              (item) => item.refreshToken === refreshToken
            );

            if (tokenIndex === -1) {
              res.statusCode = 401;
              res.send("Unauthorized");
            } else {
              const token = getToken({ _id: userId });
              // If the refresh token exists, then create new one and replace it.
              const newRefreshToken = getRefreshToken({ _id: userId });
              user.refreshToken[tokenIndex] = { refreshToken: newRefreshToken };
              user.save((err, user) => {
                if (err) {
                  res.statusCode = 500;
                  res.send(err);
                } else {
                  res.cookie("refreshToken", newRefreshToken, COOKIE_OPTIONS);
                  res.send({ success: true, token });
                }
              });
            }
          } else {
            res.statusCode = 401;
            res.send("Unauthorized");
          }
        },
        (err) => next(err)
      );
    } catch (err) {
      res.statusCode = 401;
      res.send("Unauthorized");
    }
  } else {
    res.statusCode = 401;
    res.send("Unauthorized");
  }
});

router.get("/me", verifyUser, (req, res) => {
  res.send(req.user);
});

router.get("/logout", verifyUser, (req, res, next) => {
  const { signedCookies = {} } = req;
  const { refreshToken } = signedCookies;
  User.findById(req.user._id).then(
    (user) => {
      const tokenIndex = user.refreshToken.findIndex(
        (item) => item.refreshToken === refreshToken
      );

      if (tokenIndex !== -1) {
        user.refreshToken.id(user.refreshToken[tokenIndex]._id).remove();
      }

      user.save((err, user) => {
        if (err) {
          res.statusCode = 500;
          res.send(err);
        } else {
          res.clearCookie("refreshToken", COOKIE_OPTIONS);
          res.send({ success: true });
        }
      });
    },
    (err) => next(err)
  );
});

router.post('/uploadDeck', verifyUser, (req, res, next) => {
  // Check if file was uploaded. If empty return error.
  if (req.files === null) {
    return res.status(400).json({ msg: 'No file uploaded' });
  }
  const apiProtocol = req.protocol + '://';
  const apiHost = req.get('host') + '/';
  const pitchDeckFile = req.files.file;
  const pitchDeckFileName = pitchDeckFile.name;
  const pitchDeckTitle = req.body.pitchDeckTitle;
  const filePath = 'uploads/decks/' + req.user._id + '/';
  const directory = process.cwd() + '/public/' + filePath;
  const pitchDeckPDFFile = filePath + pitchDeckFileName.substr(0, pitchDeckFileName.lastIndexOf(".")).concat('.pdf');
  const pitchDeckImageArray = [];

  // Lets make sure its only a pdf getting uploaded
  if (pitchDeckFile.mimetype !== 'application/pdf' 
    && pitchDeckFile.mimetype !== 'application/ppt'
    && pitchDeckFile.mimetype !== 'application/vnd.openxmlformats-officedocument.presentationml.presentation')
  {
    return res.status(400).json({ msg: 'Sorry only PPT & PDF\'s allowed at this time.' });
  }

  const pptConversionOptions = {
    libreofficeBin: process.env.LIBRE_OFFICE_PATH,
    sourceFile: directory + pitchDeckFile.name, // .ppt, .pptx, .odp, .key and .pdf
    outputDir: directory,
    img: true,
    imgExt: "jpg", // Optional and default value png
    density: 120, //  Optional and default density value is 120
    disableExtensionCheck: true, // convert any files to pdf or/and image
  };

  // Make sure directory exists or you'll get error
  fs.ensureDir(directory)
  .then(() => {
    // read the directory for existing uploads
    fs.readdir(directory, function (err, files) {
      if (err) {
        console.log(err)
      }
      files.map(
        (file) => {
          // Lets remove any previously uploaded files before uploading new deck
          if (pitchDeckFile.name !== file) {
            fs.remove(directory + file)
            .then(() => {
              console.log('removed ' + file)
            })
          }
        }
      )
    })
    // if it exists lets move the uploaded pdf there
    pitchDeckFile.mv(directory + pitchDeckFile.name, err => {
      // whoops we got a problem
      if (err) {
        console.error(err);
        return res.status(500).send(err);
      }
      // Great Success! The Presentation file was moved. Lets do some fun stuff with it.
      document
      .convert(pptConversionOptions)
      .then((converstion_response) => {
        // The library used to convert from ppt & pdf to images doesnt return the images in its response
        // so lets get all the images in the directory as an array for saving to the users profile.
        fs.readdir(directory, function (err, files) {
          if (err) {
            console.log(err)
          }
          files.map(
            (file) => { 
              // Lets not add the PDF and PPT(X) Files to the array so check for those before pushing the new images to array.
              if (
                path.extname(file) !== '.pdf'
                && path.extname(file) !== '.ppt'
                && path.extname(file) !== '.pptx'
              ) 
              {
                // Make sure to include protocol + host + path to files to make things easy on frontend
                pitchDeckImageArray.push(apiProtocol + apiHost + filePath + file);
              }
            }
          )
          // Lets sort the array so it retuns in correct order even if Numbers exist in filename. example file-10.jpg should come after file-9.jpg and not file-1.jpg 
          pitchDeckImageArray.sort((a, b) => isFinite(a[0]) - isFinite(b[0])
              || a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' })
          );
        });
        // Lets create the new pitchdeck object
        const updatedPitchDeckData = {
          title: pitchDeckTitle, 
          images: pitchDeckImageArray,
          pdf: pitchDeckPDFFile
        }
        // Find the user
        User.findById(req.user._id).then(
          (user) => {
            user.pitchDeck = updatedPitchDeckData;
            // Save updated user
            user.save((err, response) => {
              if (err) {
                res.statusCode = 500;
                res.send(err);
              } else {
                res.statusCode = 200;
                return res.status(200).send({ success: true, user });
              }
            });
          },
          (err) => next(err)
        );
      })
      .catch((e) => {
        console.log("e", e);
      });
    });
  })
  .catch(err => {
    console.error(err)
  })
});

router.get('/', (req, res) => {
  // Find all user Profiles with an uploaded deck. Ignore profiles thata havent added one yet.
  User.find({"pitchDeck.pdf":{$ne:""}}, function(err, users) {
    res.send({users: users});
 });
});
router.get('/:id', (req, res) => {
  // Find all user Profiles with an uploaded deck. Ignore profiles thata havent added one yet.
  User.findOne({ _id: req.params.id}, function(err, user) {
    res.send({profile: user});
  });
});


module.exports = router;
