"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const document_controller_1 = require("../controllers/document/document.controller");
const document_validator_1 = require("../validators/document.validator");
const share_validator_1 = require("../validators/share.validator");
const share_controller_1 = require("../controllers/document/share/share.controller");
const router = (0, express_1.Router)();
router.get("/:id", auth_1.authenticate, document_controller_1.documentController.getOne);
router.get("/", auth_1.authenticate, document_controller_1.documentController.getAll);
router.put("/:id", auth_1.authenticate, document_validator_1.documentValidator.update, document_controller_1.documentController.update);
router.post("/", auth_1.authenticate, document_controller_1.documentController.create);
router.delete("/", auth_1.authenticate, document_controller_1.documentController.delete);
router.post("/:id/share", auth_1.authenticate, share_validator_1.shareValidator.create, share_controller_1.shareController.create);
router.delete("/:documentId/share/:userId", auth_1.authenticate, share_controller_1.shareController.delete);
exports.default = router;
