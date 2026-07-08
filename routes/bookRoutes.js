const express = require('express');
const router = express.Router();
const Book = require('../models/books');
const { requireAuth } = require("../middleware/authMiddleware");
const Busboy = require('busboy');
const cloudinary = require('../routes/cloudinaryConfig');
const axios = require('axios');
/* =========================
   FEATURED BOOKS API
========================= */
router.get("/api/featured-books", async (req, res) => {
  try {
    const apiRes =
      await axios.get(
        "https://openlibrary.org/search.json?q=harry+potter&limit=8"
      );
    const featuredBooks =
      apiRes.data.docs.map(book => ({
        title:
          book.title,
        author:
          book.author_name?.[0]
          || "Unknown",
        coverImage:
          book.cover_i
            ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`
            : "",
        openLibraryLink:
          `https://openlibrary.org${book.key}`
      }));
    res.json({
      success: true,
      featuredBooks
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}
);
/* =========================
   ADD BOOK
========================= */
router.post("/api/books", requireAuth, async (req, res) => {
  const busboy = Busboy({
    headers: req.headers
  });
  let coverImageUrl = "";
  let coverImagePublicId = "";

  let pdfFileUrl = "";
  let pdfPublicId = "";
  const fields = {};
  const uploads = [];
  busboy.on("file", (fieldname, file) => {
    const uploadPromise = new Promise((resolve, reject) => {
      let cloudinaryStream;
      /* Cover Image */
      if (
        fieldname === "coverImage"
      ) {
        cloudinaryStream = cloudinary.uploader.upload_stream(
          {
            folder: "moodverse/images",
            resource_type: "image"
          },
          (
            error,
            result
          ) => {
            if (error) {
              reject(error);
            } else {
              coverImageUrl = result.secure_url;
              coverImagePublicId = result.public_id;
              resolve();
            }
          }
        );
      }
      /* PDF Upload */
      else if (
        fieldname === "pdfFile"
      ) {
        cloudinaryStream =
          cloudinary.uploader.upload_stream(
            {
              folder: "moodverse/pdfs",
              resource_type: "raw"
            },
            (
              error,
              result
            ) => {
              if (error) {
                reject(error);
              } else {
                console.log("PDF Uploaded:", result.secure_url);

                pdfFileUrl = result.secure_url;
                pdfPublicId = result.public_id;

                resolve();
              }
            }
          );
      }
      else {
        file.resume();
        return resolve();
      }
      file.pipe(
        cloudinaryStream
      );
    }
    );
    uploads.push(
      uploadPromise
    );
  }
  );
  /* Text Fields */
  busboy.on("field", (fieldname, val) => {
    fields[fieldname] =
      val;
  }
  );
  /* Finish Upload */
  busboy.on("finish", async () => {
    try {
      await Promise.all(
        uploads
      );
      const newBook = new Book({
        title: fields.title,
        author: fields.author,
        desc: fields.desc,
        moodtags: fields.moodtags.split(",").map(tag => tag.trim()),
        uploadedBy: req.session.userId,
        coverImage: coverImageUrl,
        coverImagePublicId: coverImagePublicId,
        pdfFile: pdfFileUrl,
        pdfPublicId: pdfPublicId
      });
      await newBook.save();
      res.status(201).json({
        success: true,
        message: "Book added successfully",
        book: newBook
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        success: false,
        message: err.message,
        error: err
      });
    }
  }
  );
  req.pipe(busboy);
}
);
/* =========================
   GET ALL BOOKS
========================= */
router.get("/api/books", async (req, res) => {
  try {
    const books = await Book.find({}).sort({ _id: -1 });
    res.json({
      success: true,
      books
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message:
        "Failed to fetch books"
    });
  }
}
);
/* =========================
   MY BOOKS
========================= */
router.get("/api/my-books", requireAuth, async (req, res) => {
  try {
    const books = await Book.find({
      uploadedBy:
        req.session.userId
    });
    res.json({
      success: true,
      books
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message:
        "Failed to fetch books"
    });
  }
}
);
/* =========================
   SINGLE BOOK
========================= */
router.get("/api/books/:id", async (req, res) => {
  try {
    const book =
      await Book.findById(
        req.params.id
      ).populate("uploadedBy");
    if (!book) {
      return res.status(404).json({
        success: false,
        message:
          "Book not found"
      });
    }
    res.json({
      success: true,
      book
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: err.message,
      error: err
    });
  }
}
);
/* =========================
   UPDATE BOOK
========================= */
router.put("/api/books/:id", requireAuth, async (req, res) => {
  const busboy = Busboy({ headers: req.headers });
  const updates = {};
  const uploads = [];
  let book;
  try {
    book =
      await Book.findById(
        req.params.id
      );
    if (!book) {
      return res.status(404).json({
        success: false,
        message:
          "Book not found"
      });
    }
    if (
      book.uploadedBy.toString()
      !==
      req.session.userId
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Unauthorized"
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message:
        "Server error"
    });
  }
  /* Fields */
  busboy.on("field", (fieldname, val) => {
    if (
      fieldname ===
      "moodtags"
    ) {
      updates.moodtags =
        val.split(",")
          .map(tag =>
            tag.trim()
          );
    }
    else {
      updates[fieldname] =
        val;
    }
  }
  );
  /* Files */
  busboy.on("file", (fieldname, file) => {
    const uploadPromise =
      new Promise((resolve, reject) => {
        let cloudinaryStream;
        if (
          fieldname === "coverImage") {
          cloudinaryStream = cloudinary.uploader.upload_stream(
            {
              folder: "moodverse/images",
              resource_type: "image"
            },
            (
              error,
              result
            ) => {
              if (error) {
                reject(error);
              } else {
                updates.coverImage =
                  result.secure_url;
                resolve();
              }
            }
          );
        }
        else if (
          fieldname === "pdfFile"
        ) {
          cloudinaryStream =
            cloudinary.uploader.upload_stream(
              {
                folder:
                  "moodverse/pdfs",
                resource_type: "raw",
              },
              (
                error,
                result
              ) => {
                if (error) {
                  reject(error);
                } else {
                  updates.pdfFile =
                    result.secure_url;
                  resolve();
                }
              }
            );
        }
        else {
          file.resume();
          return resolve();
        }
        file.pipe(
          cloudinaryStream
        );
      }
      );
    uploads.push(
      uploadPromise
    );
  }
  );
  /* Finish */
  busboy.on("finish", async () => {
    try {
      await Promise.all(
        uploads
      );
      Object.assign(
        book,
        updates
      );
      await book.save();
      res.json({
        success: true,
        message:
          "Book updated",
        book
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        success: false,
        message:
          "Failed to update book"
      });
    }
  }
  );
  req.pipe(busboy);
}
);
/* =========================
   DELETE BOOK
========================= */
router.delete("/api/books/:id", requireAuth, async (req, res) => {
  try {

    const book = await Book.findById(
      req.params.id
    );

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found"
      });
    }

    if (
      book.uploadedBy.toString() !==
      req.session.userId
    ) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized"
      });
    }

    /* Delete Cover Image */
    if (
      book.coverImagePublicId
    ) {

      await cloudinary.uploader.destroy(
        book.coverImagePublicId
      );

    }

    /* Delete PDF */
    if (
      book.pdfPublicId
    ) {

      await cloudinary.uploader.destroy(
        book.pdfPublicId,
        {
          resource_type: "raw"
        }
      );

    }

    /* Delete MongoDB Document */
    await book.deleteOne();

    res.json({
      success: true,
      message: "Book deleted"
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      success: false,
      message: "Failed to delete book"
    });

  }
});
module.exports = router;