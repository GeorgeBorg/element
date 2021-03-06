import { Habit } from "./habit.entity"
import { HabitInput } from "./habit.input"
import { ElementService } from "../element/element.service"

import { Service } from "typedi"

@Service()
export class HabitService {
  constructor(private readonly elementService: ElementService) {}

  async findById(habitId: string): Promise<Habit> {
    const habit = await Habit.findOne(habitId)
    if (!habit) throw new Error("habit not found")
    return habit
  }

  async findAll(userId: string): Promise<Habit[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const habits = await Habit.find({ where: { userId } })
        resolve(habits)
      } catch (error) {
        reject(error)
      }
    })
  }

  create(data: HabitInput, userId: string): Promise<Habit> {
    return new Promise(async (resolve, reject) => {
      try {
        if (data.elementId) {
          const element = await this.elementService.findById(data.elementId)
          const habit = await Habit.create({
            ...data,
            element,
            userId,
          }).save()
          resolve(habit)
        }
      } catch (error) {
        reject(error)
      }
    })
  }

  update(habitId: string, data: HabitInput): Promise<Habit> {
    return new Promise(async (resolve, reject) => {
      try {
        const habit = await this.findById(habitId)
        if (!habit) throw new Error("habit not found")
        Object.assign(habit, data)
        await habit.save()
        resolve(habit)
      } catch (error) {
        reject(error)
      }
    })
  }

  archive(habitId: string, data: HabitInput): Promise<Habit> {
    return new Promise(async (resolve, reject) => {
      try {
        const habit = await Habit.findOne(habitId)
        if (!habit) throw new Error("not found")
        Object.assign(habit, { archived: true })
        Object.assign(habit, { archivedAt: data.archivedAt })
        await habit.save()
        resolve(habit)
      } catch (error) {
        reject(error)
      }
    })
  }
}
