import { db } from "../../database/client.ts";
import { enrollments } from "../../database/schema.ts";
import { makeUser } from "./make-user.ts";
import { makeCourse } from "./make-course.ts";

export async function makeEnrollment(courseId?: string) {
	const { user } = await makeUser()

	const selectedCourseId = courseId ?? (await makeCourse()).id

	const result = await db.insert(enrollments).values([
		{ courseId: selectedCourseId, userId: user.id },
	]).returning()

	return result[0]
}