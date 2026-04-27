import { appError } from "../../common/error/AppError.ts";
import { profileRepository } from "./profile.repository.ts";
import type { Profile } from "./profile.type.ts";

export const profileService = {
  async findProfileByUserId(userId: number): Promise<Profile> {
    const profile = await profileRepository.findOneByUserId(userId);

    if (!profile) {
      throw appError.notFound("profile not found");
    }

    return profile;
  },
};
