import { Router } from "express";
import { registerService } from "./register.service.ts";
import { RegisterSchema } from "./register.validator.ts";
import { apiResponse } from "../../common/response/ApiResponse.ts";

export const RegisterRouter = Router();

RegisterRouter.post("/register", async (req, res, next) => {
  try {
    const result = RegisterSchema.create.safeParse(req.body);


    // how to use message error validate 
    if (!result.success) {
      const message =
        result.error.issues[0]?.message || "Invalid register data";

      return res
        .status(400)
        .json(apiResponse.error(message));
    }

    const newUser = await registerService.save(result.data);

    return res
      .status(201)
      .json(apiResponse.ok(newUser));
  } catch (error) {
    next(error);
  }
});
