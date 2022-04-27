import { Injectable } from '@nestjs/common';
// import { Bookmark, User } from '@prisma/client';

@Injectable()
export class BookmarkService {
  create() {
    return 'This action adds a new bookmark';
  }

  findAll() {
    return `This action returns all bookmark`;
  }

  findOne(id: string) {
    return `This action returns a #${id} bookmark`;
  }

  update(id: string) {
    return `This action updates a #${id} bookmark`;
  }

  remove(id: string) {
    return `This action removes a #${id} bookmark`;
  }
}
