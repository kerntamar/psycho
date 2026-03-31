import { StudyPlanItem } from "@/types";

export function generateStudyPlan(answers: Record<string, string>, studentId: string): StudyPlanItem[] {
  const plan: StudyPlanItem[] = [];
  const startDate = new Date();

  // Logic based on target score and hours available
  const weeksToStudy = answers.testDate === "In 1 month" ? 4 :
                       answers.testDate === "In 2-3 months" ? 12 :
                       answers.testDate === "In 4-6 months" ? 24 : 12;

  // Simple generation: alternating subjects
  const subjects = ["Math", "English", "Hebrew", "Vocabulary"];

  for (let i = 0; i < weeksToStudy * 7; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);

    // Skip weekends if they only have 5-10 hours
    if (answers.hours === "5-10 hours" && (date.getDay() === 0 || date.getDay() === 6)) continue;

    plan.push({
      id: `plan-${i}`,
      studentId,
      date: date.toISOString().split('T')[0],
      lessonId: `lesson-${subjects[i % subjects.length].toLowerCase()}-${i % 5}`,
      practiceCount: 10,
      isCompleted: false
    });
  }

  return plan;
}
