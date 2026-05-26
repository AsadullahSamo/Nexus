const { Router } = require('express')
const { getMyDocuments, uploadDocument, deleteDocument, downloadDocument, saveSignature } = require('../controllers/documentController')
const authenticate = require('../middlewares/auth')
const upload = require('../config/multer')

const router = Router()

router.use(authenticate)

router.get('/', getMyDocuments)
router.post('/', upload.single('file'), uploadDocument)
router.delete('/:id', deleteDocument)
router.get('/:id/download', downloadDocument)
router.patch('/:id/signature', saveSignature);

module.exports = router