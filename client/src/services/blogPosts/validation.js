import { body } from "express-validator"

export const studentsValidationMiddleware = [
  body("title").exists().withMessage("Title is a mandatory field!"),
  body("category").exists().withMessage("Category is a mandatory field!"),
  body("readTime[name]").exists().withMessage("Reading Time is a mandatory field!"),
]
