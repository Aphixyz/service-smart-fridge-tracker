import { appError } from "../../common/error/AppError.ts";
import { categoiresRepository } from "./categoires.repository.ts";
import type {
  Categoires,
  CreateCategoiresInput,
  UpdateCategoiresInput,
} from "./categoires.type.ts";

export const categoiresService = {
  async getAllCategories(): Promise<Categoires[]> {
    return categoiresRepository.findAll();
  },

  async getCategoryById(id: number): Promise<Categoires> {
    const item = await categoiresRepository.findById(id);

    if (!item) {
      throw appError.notFound("Categoires not found");
    }

    return item;
  },

  async create(data: CreateCategoiresInput): Promise<Categoires> {
    const created = await categoiresRepository.create(data);

    if (!created) {
      throw appError.internal("Failed to create categoires");
    }

    return created;
  },

  async update(id: number, data: UpdateCategoiresInput): Promise<Categoires> {
    const item = await this.getCategoryById(id);

    const updated = await categoiresRepository.update(id, {
      name: data.name ?? item.name,
      home_id: data.home_id !== undefined ? data.home_id : item.home_id,
      icon: data.icon ?? item.icon,

    });

    if (!updated) {
      throw appError.internal("Failed to update categoires");
    }

    return updated;
  },

  async remove(id: number): Promise<Categoires> {
    await this.getCategoryById(id);

    const removed = await categoiresRepository.remove(id);

    if (!removed) {
      throw appError.internal("Failed to remove categoires");
    }

    return removed;
  },
};
