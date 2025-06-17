const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directories exist
const ensureDirectoryExists = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// Create upload directories
ensureDirectoryExists('public/uploads/images');
ensureDirectoryExists('public/uploads/pdfs');

// IMAGE STORAGE
const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/images');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const timestamp = Date.now();
    const randomNum = Math.floor(Math.random() * 1000);
    cb(null, `${timestamp}-${randomNum}-img${ext}`);
  }
});

// PDF STORAGE
const pdfStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/pdfs');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const timestamp = Date.now();
    const randomNum = Math.floor(Math.random() * 1000);
    cb(null, `${timestamp}-${randomNum}-book${ext}`);
  }
});

// FILTER IMAGE MIME TYPES
const imageFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG, PNG, JPG, and WebP images are allowed'), false);
  }
};

// FILTER PDF MIME TYPES
const pdfFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed'), false);
  }
};

// UPLOAD CONFIGURATIONS
const uploadImage = multer({
  storage: imageStorage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit for images
    files: 1
  }
});

const uploadPDF = multer({
  storage: pdfStorage,
  fileFilter: pdfFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit for PDFs
    files: 1
  }
});

// COMBINED UPLOADER FOR MULTIPLE FILE TYPES
const uploadBookFiles = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      if (file.fieldname === 'coverImage') {
        cb(null, 'public/uploads/images');
      } else if (file.fieldname === 'pdfFile') {
        cb(null, 'public/uploads/pdfs');
      } else {
        cb(new Error('Invalid field name'), false);
      }
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const timestamp = Date.now();
      const randomNum = Math.floor(Math.random() * 1000);
      const prefix = file.fieldname === 'coverImage' ? 'img' : 'book';
      cb(null, `${timestamp}-${randomNum}-${prefix}${ext}`);
    }
  }),
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'coverImage') {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
      if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Only JPEG, PNG, JPG, and WebP images are allowed for cover image'), false);
      }
    } else if (file.fieldname === 'pdfFile') {
      if (file.mimetype === 'application/pdf') {
        cb(null, true);
      } else {
        cb(new Error('Only PDF files are allowed for book file'), false);
      }
    } else {
      cb(new Error('Invalid field name'), false);
    }
  },
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB max file size
    files: 2 // Max 2 files (1 image + 1 PDF)
  }
});

module.exports = {
  uploadImage,
  uploadPDF,
  uploadBookFiles
};