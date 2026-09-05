<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;

use App\Models\Academic_years;
use App\Models\BookCategory;
use App\Models\Books;
use App\Models\ClassRoom;
use App\Models\Students;
use App\Models\Subjects;
use App\Models\Teachers;
use App\Models\TimeTables;
use Illuminate\Database\Eloquent\Factories\Sequence;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
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
        Students::factory()->count(10)->create();


        // for book category 
        // BookCategory::factory()->count(5)->create();

        // for books 
        // Books::factory()->count(15)->create();
    }
}
