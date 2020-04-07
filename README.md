# educationPortal

The educationPortal API consists of three types of users (Admin, teacher, student). Only the admin user has access to create new admins, teachers, and students. The API provides different access levels to users. 

## Admin

An admin can create new user accounts i.e admin account, teacher and student.
An admin can perform various operations on teacher user such as:- 
  Create a new teacher user
  Get all the teachers stored in the database
  Get a particular teacher profile as per their id field
  Update the profile of an existing teacher
  Delete the profile of an existing teacher
An admin can also perform similar functions on student user as well
  Create a new student user
  Get all the students enrolled in the system
  Get an individual student profile
  Update the profile of an existing user
  Delete a student from a system and making sure the student will delete from other associated collections

## Teacher 

A teacher can update their password
A teacher can create a new course and also post new notifications or updates regarding their courses.
A teacher has the functionality to get all the students enrolled in their courses.
A teacher has the option to update the course and notifications as per their requirements and the student will get the email if there is any update to the course.

## Studnet

A student can see their profile as well as can look for their enrolled courses on the dashboard
The enrolled courses notifications feature provides the ability to get all the notifications from enrolled courses
A student has the login feature as well as  can update their password
A student can enroll in a course created by a student. At the moment there is no restriction on the student while registering for a course

## Logger
A custom logger 

New fetures will be added to this educationPortal API

