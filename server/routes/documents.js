const { Router } = require('express')
const { getMyDocuments, uploadDocument, deleteDocument, downloadDocument } = require('../controllers/documentController')
const authenticate = require('../middlewares/auth')
const upload = require('../config/multer')

const router = Router()

router.use(authenticate)

router.get('/', getMyDocuments)
router.post('/', upload.single('file'), uploadDocument)
router.delete('/:id', deleteDocument)
router.get('/:id/download', downloadDocument)


module.exports = router