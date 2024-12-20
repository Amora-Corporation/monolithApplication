import { Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventService {
  create(createEventDto: CreateEventDto) {
    return `This action adds a new event ${createEventDto}`;
  }

  findAll() {
    return `This action returns all event`;
  }

  findOne(id: number) {
    return `This action returns a #${id} event`;
  }

  update(id: number, updateEventDto: UpdateEventDto) {
    return `This action updates a #${updateEventDto} event ${id}`;
  }

  remove(id: number) {
    return `This action removes a #${id} event`;
  }
}
