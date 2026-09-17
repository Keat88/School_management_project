<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;

use App\Models\Academic_years;
use App\Models\BookCategory;
use App\Models\Books;
use App\Models\ClassRoom;
use App\Models\Course;
use App\Models\Students;
use App\Models\Subjects;
use App\Models\Teachers;
use App\Models\TimeTables;
use CourseSeeder;
use Illuminate\Database\Eloquent\Factories\Sequence;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */


    // public function run()
    // {

    // // 1. Create an Academic Year
    // $academicYearId = DB::table('academic_years')->insertGetId([
    //     'name' => '2026-2027',
    //     'start_date' => '2026-08-01',
    //     'end_date' => '2027-06-30',
    //     'created_at' => now(),
    //     'updated_at' => now(),
    // ]);

    // // 2. Create a Class Room
    // $classId = DB::table('class_rooms')->insertGetId([
    //     'academic_year_id' => $academicYearId,
    //     'grade' => '10',
    //     'section' => 'A',
    //     'created_at' => now(),
    //     'updated_at' => now(),
    // ]);

    // // 3. Create a Subject
    // $subjectId = DB::table('subjects')->insertGetId([
    //     'subject_name' => 'Mathematics',
    //     'code' => 'MATH101',
    //     'created_at' => now(),
    //     'updated_at' => now(),
    // ]);

    // // 4. Create an Exam
    // $examId = DB::table('exams')->insertGetId([
    //     'class_id' => $classId,
    //     'subject_id' => $subjectId,
    //     'exam_name' => 'Midterm Exam',
    //     'exam_date' => '2026-08-18',
    //     'created_at' => now(),
    //     'updated_at' => now(),
    // ]);

    // // 5. Create a Parent
    // $parentId = DB::table('parents')->insertGetId([
    //     'father_name' => 'John Doe Sr.',
    //     'mother_name' => 'Jane Doe',
    //     'parent_phone' => '123456789',
    //     'email' => 'parent@example.com',
    //     'occupation' => 'Engineer',
    //     'created_at' => now(),
    //     'updated_at' => now(),
    // ]);

    // // 6. Create a Student with all required fields
    // $studentId = DB::table('students')->insertGetId([
    //     'student_name' => 'John Doe',
    //     'class_id' => $classId,
    //     'parent_id' => $parentId,
    //     'roll_number' => 'R001',
    //     'email' => 'john@example.com',
    //     'date_of_birth' => '2010-05-15',
    //     'gender' => 'male',
    //     'address' => '123 Main St',
    //     'created_at' => now(),
    //     'updated_at' => now(),
    // ]);

    // // 7. Create Attendance records (Added 'message' since the column is NOT NULL)
    // DB::table('attendances')->insert([
    //     ['student_id' => $studentId, 'class_id' => $classId, 'date' => '2026-08-15', 'status' => 'present', 'message' => 'On time', 'created_at' => now(), 'updated_at' => now()],
    //     ['student_id' => $studentId, 'class_id' => $classId, 'date' => '2026-08-16', 'status' => 'present', 'message' => 'On time', 'created_at' => now(), 'updated_at' => now()],
    //     ['student_id' => $studentId, 'class_id' => $classId, 'date' => '2026-08-17', 'status' => 'absent', 'message' => 'Excused', 'created_at' => now(), 'updated_at' => now()],
    // ]);

    // // 8. Create Exam Results
    // DB::table('resultes')->insert([
    //     [
    //         'exam_id' => $examId,
    //         'student_id' => $studentId,
    //         'marks_obtained' => 85.00,
    //         'total_marks' => 100.00,
    //         'grade' => 'A',
    //         'created_at' => '2026-08-20 10:00:00',
    //         'updated_at' => now()
    //     ]
    // ]);

    // // 9. Create Payment records
    // DB::table('payments')->insert([
    //     [
    //         'student_id' => $studentId,
    //         'amount' => 150.00,
    //         'status' => 'paid',
    //         'due_date' => '2026-08-10',
    //         'created_at' => now(),
    //         'updated_at' => now()
    //     ]
    // ]);
    // for academic year 
    // $academicYear = Academic_years::first() ?? Academic_years::factory()->create();

    // ClassRoom::factory()->count(5)->create([
    //     'academic_year_id' => $academicYear->id,
    // ]);
    //    Teachers::factory()->count(5)->create();
    // \App\Models\User::factory(10)->create();

    // \App\Models\User::factory()->create([
    //     'name' => 'Test User',
    //     'email' => 'test@example.com',
    // ]);

    // 1. Create classrooms, subjects, and multiple teachers
    // $classrooms = ClassRoom::factory()->count(3)->create();
    // $subjects = Subjects::factory()->count(6)->create();
    // $teachers = Teachers::factory()->count(5)->create();

    // $days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

    // $timeSlots = [
    //     ['start_time' => '08:00:00', 'end_time' => '09:30:00'],
    //     ['start_time' => '09:45:00', 'end_time' => '11:15:00'],
    //     ['start_time' => '13:00:00', 'end_time' => '14:30:00'],
    //     ['start_time' => '14:45:00', 'end_time' => '16:15:00'],
    // ];

    // // Assign 1 or 2 specific subjects to each teacher
    // $teacherSubjects = $teachers->mapWithKeys(function ($teacher) use ($subjects) {
    //     return [$teacher->id => $subjects->random(rand(1, 2))];
    // });

    // foreach ($classrooms as $classroom) {
    //     foreach ($days as $day) {
    //         // Shuffle slots or pick a subset so a class doesn't have 4 classes every single day if preferred
    //         foreach ($timeSlots as $slot) {
    //             // Pick a random teacher
    //             $teacher = $teachers->random();

    //             // Pick one of the subjects assigned to this specific teacher
    //             $subject = $teacherSubjects[$teacher->id]->random();

    //             // Check if teacher is already booked at this exact day and time slot to prevent conflicts
    //             $teacherBusy = TimeTables::where('teacher_id', $teacher->id)
    //                 ->where('day', $day)
    //                 ->where('start_time', $slot['start_time'])
    //                 ->exists();

    //             if (!$teacherBusy) {
    //                 TimeTables::create([
    //                     'class_id'   => $classroom->id,
    //                     'subject_id' => $subject->id,
    //                     'teacher_id' => $teacher->id,
    //                     'day'        => $day,
    //                     'start_time' => $slot['start_time'],
    //                     'end_time'   => $slot['end_time'],
    //                 ]);
    //             }
    //         }
    //     }
    // }
    // for student 
    // Students::factory()->count(10)->create();


    // for book category 
    // BookCategory::factory()->count(5)->create();

    // for books 
    // Books::factory()->count(15)->create();
    // }

    // for class
    // public function run(): void
    // {
    //     $this->call([
    //         SubjectSeeder::class,
    //     ]);
    // ClassRoom::factory()->count(10)->create();
    // public function run(): void
    // {
    //     $this->call([
    //         CourseSeeder::class,
    //     ]);
    // }
}
