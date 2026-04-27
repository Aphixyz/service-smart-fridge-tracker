import { Router } from "express";
import { registerService } from "./register.service.ts";
import { RegisterSchema } from "./register.validator.ts";
import { apiResponse } from "../../common/response/ApiResponse.ts";
import { appError } from "../../common/error/AppError.ts";

export const RegisterRouter = Router();

RegisterRouter.post("/register", async (req, res, next) => {
  try {
    const result = RegisterSchema.create.safeParse(req.body);
    if (!result.success) {
      throw appError.badRequest();
    }
    const newUser = await registerService.save(result.data);
    res.status(201).json(apiResponse.ok(newUser));
  } catch (error) {
    console.log(error);
    next(error);
  }
});
