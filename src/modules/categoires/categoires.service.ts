import { appError } from "../../common/error/AppError.ts";
import { removeProjectUpload } from "../../common/utils/uploadFile.ts";
import { categoiresRepository } from "./categoires.repository.ts";
import type {
  Categoires,
  CreateCategoiresInput,
  UpdateCategoiresInput,
} from "./categoires.type.ts";

export const categoiresService = {
  async getAllCategories(home_id: number): Promise<Categoires[]> {
    return categoiresRepository.findAll(home_id);
  },

  async getCategoryById(id: number, homeId: number): Promise<Categoires> {
    const item = await categoiresRepository.findById(id, homeId);
    if (!item) throw appError.notFound("Categoires not found");
    return item;
  },

  async create(data: CreateCategoiresInput): Promise<Categoires> {
    const created = await categoiresRepository.create(data);
    if (!created) throw appError.internal("Failed to create categoires");
    return created;
  },

  async update(
    id: number,
    homeId: number,
    data: UpdateCategoiresInput,
  ): Promise<Categoires> {
    const item = await this.getCategoryById(id, homeId);
    // ถ้าไม่มี icon ใหม่ ให้ใช้ค่าเดิมไปก่อน
    const nextIcon = data.icon ?? item.icon;
    const updated = await categoiresRepository.update(id, {
      name: data.name,
      home_id: item.home_id,
      icon: nextIcon,
    });
    if (!updated) throw appError.internal("Failed to update categoires");
    // ลบไฟล์เก่าหลังจากบันทึก path ใหม่ลงฐานข้อมูลสำเร็จแล้วเท่านั้น
    if (nextIcon !== item.icon) await removeProjectUpload(item.icon);

    return updated;
  },

  async remove(id: number, homeId: number): Promise<Categoires> {
    await this.getCategoryById(id, homeId);
    const removed = await categoiresRepository.remove(id);
    if (!removed) {
      throw appError.internal("Failed to remove categoires");
    }
    await removeProjectUpload(removed.icon);
    return removed;
  },
};
