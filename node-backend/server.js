// const express = require('express');
// const mongoose = require('mongoose');
// const multer = require('multer');
// const { GridFSBucket } = require('mongodb'); // Import GridFSBucket directly from mongodb
// const Grid = require('gridfs-stream');
// const cors = require('cors');
// const crypto = require('crypto'); // Import crypto for unique filenames
// const path = require('path');     // Import path for file extensions
// const { Readable } = require('stream'); // Import Readable stream for piping buffer

// const app = express();
// const port = 3000;

// // MongoDB URI (replace with your actual URI from MongoDB Atlas)
// // *** IMPORTANT CHANGE HERE: Added /Book to the URI path to specify the database ***
// const mongoURI = 'mongodb+srv://ongamohamed89:Bondok23@cluster0.mzgdznh.mongodb.net/Book?retryWrites=true&w=majority&appName=Cluster0';

// // Connect to MongoDB
// const conn = mongoose.createConnection(mongoURI);

// // Init gfs
// let gfs;
// let bucket; // Declare GridFSBucket here to make it accessible globally
// conn.once('open', () => {
//   gfs = Grid(conn.db, mongoose.mongo);
//   gfs.collection('uploads'); // Collection name for GridFS files
//   bucket = new GridFSBucket(conn.db, { bucketName: 'uploads' }); // Initialize GridFSBucket
//   console.log('MongoDB Connected and GridFSBucket initialized...');
// });

// // Configure Multer to store files in memory
// const upload = multer({ storage: multer.memoryStorage() });

// // Middleware
// app.use(cors()); // Enable CORS for your Angular app
// app.use(express.json()); // For parsing application/json
// app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded

// // @route GET /api/files
// // @desc Get all files metadata
// app.get('/api/files', (req, res) => {
//   console.log('GET /api/files endpoint hit!');
//   if (!gfs) {
//     console.error('GridFS not initialized yet for GET /api/files.');
//     return res.status(500).json({ err: 'GridFS not ready' });
//   }
//   gfs.files.find().toArray((err, files) => {
//     if (err) {
//       console.error('Error fetching files from GridFS:', err);
//       return res.status(500).json({ err: 'Error fetching files' });
//     }
//     if (!files || files.length === 0) {
//       console.log('No files found in GridFS.');
//       return res.status(200).json([]); // Return empty array if no files, not 404
//     }
//     return res.json(files.map(file => ({
//       _id: file._id,
//       fileName: file.filename,
//       // Prioritize file.contentType, then metadata.contentType, then default
//       fileType: file.contentType || file.metadata?.contentType || 'application/octet-stream',
//       size: file.length,
//       uploadDate: file.uploadDate,
//       url: `/api/files/download/${file._id}` // Example download URL
//     })));
//   });
// });

// // @route POST /api/files/upload
// // @desc Upload single file using GridFSBucket directly
// app.post('/api/files/upload', upload.single('file'), (req, res) => {
//   console.log('POST /api/files/upload endpoint hit!');
//   console.log('req.file:', req.file); // Log the file object received by multer

//   if (!req.file) {
//     console.error('No file uploaded via multer.');
//     return res.status(400).json({ msg: 'No file uploaded' });
//   }

//   if (!bucket) { // Ensure GridFSBucket is initialized
//     console.error('GridFSBucket not initialized yet for upload.');
//     return res.status(500).json({ err: 'GridFS not ready for upload' });
//   }

//   try {
//     // Generate a unique filename for GridFS
//     const uniqueFilename = crypto.randomBytes(16).toString('hex') + path.extname(req.file.originalname);

//     // Open an upload stream to GridFS
//     const uploadStream = bucket.openUploadStream(uniqueFilename, {
//       chunkSizeBytes: 1024 * 255, // Default chunk size for GridFS
//       metadata: {
//         originalName: req.file.originalname,
//         contentType: req.file.mimetype,
//         uploadDate: new Date() // Store upload date in metadata
//       }
//     });

//     // Create a readable stream from the file buffer
//     const readableStream = new Readable();
//     readableStream.push(req.file.buffer); // Push the file buffer
//     readableStream.push(null); // Indicate end of stream

//     // Pipe the readable stream into the GridFS upload stream
//     readableStream.pipe(uploadStream)
//       .on('error', (err) => {
//         console.error('Error during GridFS upload stream:', err);
//         // Attempt to delete the partially uploaded file if an error occurs
//         if (uploadStream.id) {
//           bucket.delete(uploadStream.id, (deleteErr) => {
//             if (deleteErr) console.error('Error deleting partial upload:', deleteErr);
//           });
//         }
//         return res.status(500).json({ msg: 'File upload failed', error: err.message });
//       })
//       .on('finish', (file) => {
//         // 'file' object here is the GridFS file document that was just saved
//         console.log('File uploaded to GridFS successfully:', file);
//         res.status(201).json({
//           _id: file._id,
//           fileName: file.filename,
//           fileType: file.metadata.contentType, // Get content type from metadata
//           size: file.length,
//           uploadDate: file.uploadDate,
//           msg: 'File uploaded successfully'
//         });
//       });
//   } catch (error) {
//     console.error('Unhandled error in POST /api/files/upload:', error);
//     res.status(500).json({ msg: 'Server error during upload process', error: error.message });
//   }
// });

// // @route GET /api/files/download/:id
// // @desc Download a single file by ID
// app.get('/api/files/download/:id', (req, res) => {
//   console.log(`GET /api/files/download/${req.params.id} endpoint hit!`);
//   if (!bucket) { // Use bucket for download
//     console.error('GridFSBucket not initialized yet for download.');
//     return res.status(500).json({ err: 'GridFS not ready for download' });
//   }

//   try {
//     const fileId = new mongoose.Types.ObjectId(req.params.id);
//     bucket.find({ _id: fileId }).toArray((err, files) => {
//       if (err) {
//         console.error('Error finding file for download:', err);
//         return res.status(500).json({ err: 'Error finding file' });
//       }
//       const file = files[0];
//       if (!file) {
//         console.log(`File with ID ${req.params.id} not found.`);
//         return res.status(404).json({ err: 'No file exists' });
//       }

//       // Set content type header
//       res.set('Content-Type', file.contentType || file.metadata?.contentType || 'application/octet-stream');
//       res.set('Content-Disposition', `inline; filename="${file.filename}"`); // 'inline' to view in browser, 'attachment' to download

//       const downloadStream = bucket.openDownloadStream(file._id);
//       downloadStream.on('error', (streamErr) => {
//         console.error('Error in download stream:', streamErr);
//         res.status(500).json({ err: 'Error streaming file' });
//       });
//       downloadStream.pipe(res);
//     });
//   } catch (error) {
//     console.error('Unhandled error in GET /api/files/download:', error);
//     res.status(500).json({ msg: 'Server error during download process', error: error.message });
//   }
// });

// // @route DELETE /api/files/:id
// // @desc Delete a file by ID
// app.delete('/api/files/:id', (req, res) => {
//   console.log(`DELETE /api/files/${req.params.id} endpointhit!`);
//   if (!bucket) { // Use bucket for delete
//     console.error('GridFSBucket not initialized yet for delete.');
//     return res.status(500).json({ err: 'GridFS not ready for delete' });
//   }

//   try {
//     const fileId = new mongoose.Types.ObjectId(req.params.id);
//     bucket.delete(fileId, (err) => {
//       if (err) {
//         console.error('Error deleting file from GridFS:', err);
//         // Check if the error is due to file not found (e.g., CastError for invalid ID format)
//         if (err.name === 'MongoError' && err.message.includes('file not found')) {
//           return res.status(404).json({ msg: 'File not found for deletion' });
//         }
//         return res.status(500).json({ err: err.message });
//       }
//       res.json({ msg: 'File deleted successfully' });
//     });
//   } catch (error) {
//     console.error('Unhandled error in DELETE /api/files/:id:', error);
//     res.status(500).json({ msg: 'Server error during delete process', error: error.message });
//   }
// });

// app.listen(port, () => console.log(`Server started on port ${port}`));

const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const { GridFSBucket } = require("mongodb");
const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:4200', // Your Angular dev server port
  credentials: true
}));
const crypto = require("crypto");
const path = require("path");
const { Readable } = require("stream");

const app = express();
const port = 3000;

// MongoDB URI
const mongoURI =
  "mongodb+srv://ongamohamed89:Bondok23@cluster0.mzgdznh.mongodb.net/Book?retryWrites=true&w=majority&appName=Cluster0";

// Connect to MongoDB
const conn = mongoose.createConnection(mongoURI);

// Init GridFS bucket
let bucket;
conn.once("open", () => {
  bucket = new GridFSBucket(conn.db, { bucketName: "uploads" });
  console.log("MongoDB Connected and GridFSBucket initialized...");
});

// Configure Multer to store files in memory
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// @route GET /api/files
// @desc Get all files metadata
app.get("/api/files", async (req, res) => {
  console.log("GET /api/files endpoint hit!");

  if (!bucket) {
    console.error("GridFSBucket not initialized yet for GET /api/files.");
    return res.status(500).json({ err: "GridFS not ready" });
  }

  try {
    const files = await bucket.find().toArray();

    if (!files || files.length === 0) {
      console.log("No files found in GridFS.");
      return res.status(200).json([]);
    }

    const fileList = files.map((file) => ({
      _id: file._id,
      fileName: file.filename,
      fileType:
        file.contentType ||
        file.metadata?.contentType ||
        "application/octet-stream",
      size: file.length,
      uploadDate: file.uploadDate,
      url: `/api/files/download/${file._id}`,
    }));

    return res.json(fileList);
  } catch (err) {
    console.error("Error fetching files from GridFS:", err);
    return res.status(500).json({ err: "Error fetching files" });
  }
});

// @route POST /api/files/upload
// @desc Upload single file using GridFSBucket
app.post("/api/files/upload", upload.single("file"), async (req, res) => {
  console.log("POST /api/files/upload endpoint hit!");
  console.log("req.file:", req.file);

  if (!req.file) {
    console.error("No file uploaded via multer.");
    return res.status(400).json({ msg: "No file uploaded" });
  }

  if (!bucket) {
    console.error("GridFSBucket not initialized yet for upload.");
    return res.status(500).json({ err: "GridFS not ready for upload" });
  }

  try {
    // Generate a unique filename for GridFS
    const uniqueFilename =
      crypto.randomBytes(16).toString("hex") +
      path.extname(req.file.originalname);

    // Create upload stream
    const uploadStream = bucket.openUploadStream(uniqueFilename, {
      chunkSizeBytes: 1024 * 255,
      metadata: {
        originalName: req.file.originalname,
        contentType: req.file.mimetype,
        uploadDate: new Date(),
      },
    });

    // Create a readable stream from the file buffer
    const readableStream = new Readable();
    readableStream.push(req.file.buffer);
    readableStream.push(null);

    // Handle upload completion
    uploadStream.on("error", (err) => {
      console.error("Error during GridFS upload stream:", err);
      return res
        .status(500)
        .json({ msg: "File upload failed", error: err.message });
    });

    uploadStream.on("finish", (file) => {
      console.log("File uploaded to GridFS successfully:", file);
      res.status(201).json({
        _id: file._id,
        fileName: file.filename,
        fileType: file.metadata.contentType,
        size: file.length,
        uploadDate: file.uploadDate,
        msg: "File uploaded successfully",
      });
    });

    // Pipe the readable stream into the GridFS upload stream
    readableStream.pipe(uploadStream);
  } catch (error) {
    console.error("Unhandled error in POST /api/files/upload:", error);
    res
      .status(500)
      .json({
        msg: "Server error during upload process",
        error: error.message,
      });
  }
});

// @route GET /api/files/download/:id
// @desc Download a single file by ID
app.get("/api/files/download/:id", async (req, res) => {
  console.log(`GET /api/files/download/${req.params.id} endpoint hit!`);

  if (!bucket) {
    console.error("GridFSBucket not initialized yet for download.");
    return res.status(500).json({ err: "GridFS not ready for download" });
  }

  try {
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ err: "Invalid file ID format" });
    }

    const fileId = new mongoose.Types.ObjectId(req.params.id);

    // Find the file first
    const files = await bucket.find({ _id: fileId }).toArray();

    if (!files || files.length === 0) {
      console.log(`File with ID ${req.params.id} not found.`);
      return res.status(404).json({ err: "No file exists" });
    }

    const file = files[0];

    // Set headers
    res.set(
      "Content-Type",
      file.contentType ||
        file.metadata?.contentType ||
        "application/octet-stream"
    );
    res.set("Content-Disposition", `inline; filename="${file.filename}"`);

    // Create download stream
    const downloadStream = bucket.openDownloadStream(file._id);

    downloadStream.on("error", (streamErr) => {
      console.error("Error in download stream:", streamErr);
      if (!res.headersSent) {
        res.status(500).json({ err: "Error streaming file" });
      }
    });

    downloadStream.pipe(res);
  } catch (error) {
    console.error("Unhandled error in GET /api/files/download:", error);
    if (!res.headersSent) {
      res
        .status(500)
        .json({
          msg: "Server error during download process",
          error: error.message,
        });
    }
  }
});

// @route DELETE /api/files/:id
// @desc Delete a file by ID
app.delete("/api/files/:id", async (req, res) => {
  console.log(`DELETE /api/files/${req.params.id} endpoint hit!`);

  if (!bucket) {
    console.error("GridFSBucket not initialized yet for delete.");
    return res.status(500).json({ err: "GridFS not ready for delete" });
  }

  try {
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ err: "Invalid file ID format" });
    }

    const fileId = new mongoose.Types.ObjectId(req.params.id);

    // Check if file exists first
    const files = await bucket.find({ _id: fileId }).toArray();

    if (!files || files.length === 0) {
      return res.status(404).json({ msg: "File not found for deletion" });
    }

    // Delete the file
    await bucket.delete(fileId);

    res.json({ msg: "File deleted successfully" });
  } catch (error) {
    console.error("Unhandled error in DELETE /api/files/:id:", error);
    res
      .status(500)
      .json({
        msg: "Server error during delete process",
        error: error.message,
      });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error("Global error handler:", error);
  res.status(500).json({ msg: "Internal server error", error: error.message });
});

app.listen(port, () => console.log(`Server started on port ${port}`));
