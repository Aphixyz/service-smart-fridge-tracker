import { Router } from "express";
import { registerService } from "./register.service.ts";
import { RegisterSchema, validate } from "./register.validator.ts";
import { apiResponse } from "../../common/response/ApiResponse.ts";

export const RegisterRouter = Router();

RegisterRouter.post("/register", async (req, res, next) => {
  try {
    const data = validate(RegisterSchema.create)(req.body);
    const newUser = await registerService.save(data);
    res.status(201).json(apiResponse.ok(newUser));
  } catch (error) {
    console.log(error);
    next(error);
  }
});
