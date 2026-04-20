import { appError } from "../../common/error/AppError.ts";
import { removeProjectUpload } from "../../common/utils/uploadFile.ts";
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
    if (!item) throw appError.notFound("Categoires not found");
    return item;
  },

  async create(data: CreateCategoiresInput): Promise<Categoires> {
    const created = await categoiresRepository.create(data);
    if (!created) throw appError.internal("Failed to create categoires");
    return created;
  },

  async update(id: number, data: UpdateCategoiresInput): Promise<Categoires> {
    const item = await this.getCategoryById(id);
    // ถ้าไม่มี icon ใหม่ ให้ใช้ค่าเดิมไปก่อน
    const nextIcon = data.icon ?? item.icon;
    const updated = await categoiresRepository.update(id, {
      name: data.name ?? item.name,
      home_id: data.home_id !== undefined ? data.home_id : item.home_id,
      icon: nextIcon,
    });
    if (!updated) throw appError.internal("Failed to update categoires");
    // ลบไฟล์เก่าหลังจากบันทึก path ใหม่ลงฐานข้อมูลสำเร็จแล้วเท่านั้น
    if (nextIcon !== item.icon) await removeProjectUpload(item.icon);
    return updated;
  },

  async remove(id: number): Promise<Categoires> {
    await this.getCategoryById(id);
    const removed = await categoiresRepository.remove(id);
    if (!removed) {
      throw appError.internal("Failed to remove categoires");
    }
    await removeProjectUpload(removed.icon);
    return removed;
  },
};
