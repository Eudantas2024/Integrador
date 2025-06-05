const multer = require("multer");
const path = require("path");

// Armazena o arquivo na memória em buffer
const storage = multer.memoryStorage();

// Filtro de tipos permitidos
function fileFilter(req, file, cb) {
  const allowedTypes = /jpeg|jpg|png|gif|webp|pdf/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error("Tipo de arquivo não permitido."), false);
  }
}

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter,
});

module.exports = upload;
