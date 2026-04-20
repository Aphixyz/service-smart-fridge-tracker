import { appError } from "../../common/error/AppError.ts";
import { removeProjectUpload } from "../../common/utils/uploadFile.ts";
import { categoriesRepository } from "./categories.repository.ts";
import type {
  categories,
  CreatecategoriesInput,
  UpdatecategoriesInput,
} from "./categories.type.ts";

export const categoriesService = {
  async getAllCategories(home_id: number): Promise<categories[]> {
    return categoriesRepository.findAll(home_id);
  },

  async getCategoryById(id: number, homeId: number): Promise<categories> {
    const item = await categoriesRepository.findById(id, homeId);
    if (!item) throw appError.notFound("categories not found");
    return item;
  },

  async create(data: CreatecategoriesInput): Promise<categories> {
    const created = await categoriesRepository.create(data);
    if (!created) throw appError.internal("Failed to create categories");
    return created;
  },

  async update(
    id: number,
    homeId: number,
    data: UpdatecategoriesInput,
  ): Promise<categories> {
    const item = await this.getCategoryById(id, homeId);
    // ถ้าไม่มี icon ใหม่ ให้ใช้ค่าเดิมไปก่อน
    const nextIcon = data.icon ?? item.icon;
    const updated = await categoriesRepository.update(id, {
      name: data.name,
      home_id: item.home_id,
      icon: nextIcon,
    });
    if (!updated) throw appError.internal("Failed to update categories");
    // ลบไฟล์เก่าหลังจากบันทึก path ใหม่ลงฐานข้อมูลสำเร็จแล้วเท่านั้น
    if (nextIcon !== item.icon) await removeProjectUpload(item.icon);

    return updated;
  },

  async remove(id: number, homeId: number): Promise<categories> {
    await this.getCategoryById(id, homeId);
    const removed = await categoriesRepository.remove(id);
    if (!removed) {
      throw appError.internal("Failed to remove categories");
    }
    await removeProjectUpload(removed.icon);
    return removed;
  },
};
