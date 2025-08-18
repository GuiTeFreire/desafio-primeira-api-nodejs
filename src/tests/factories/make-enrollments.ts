import { faker } from "@faker-js/faker";
import { db } from "../../database/client.ts";
import { courses, enrollments, users } from "../../database/schema.ts";

export async function makeEnrollment(courseId?: string) {
    const usersInsert = await db.insert(users).values([
        { name: faker.person.fullName(), email: faker.internet.email() },
    ]).returning()

    const coursesInsert = await db.insert(courses).values([
        { title: faker.lorem.words(4) },
    ]).returning()

    const result = await db.insert(enrollments).values([
        { courseId: courseId ?? coursesInsert[0].id, userId: usersInsert[0].id },
    ]).returning()

    return result[0]
}