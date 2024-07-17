# educationPortal

The educationPortal API consists of three types of users (Admin, teacher, and student). Only the admin user has access to create new admins, teachers, and students. The API provides different access levels to users. 

## How to use

1. Clone the repository to your local system. 
2. Open the folder in the IDE (visual code in my case)
3. Open the terminal and type npm install
4. Make sure the node and MongoDB are already installed on your system, otherwise install the node and MongoDB and follow the steps
5. Create a config folder to manage the environment variables, please refer to the config npm package

## Admin

An admin can create new user accounts i.e. admin account, teacher, and student.
An admin can perform various operations on teacher users such as, 
  create a new teacher user,
  get all the teachers stored in the database,
  get a particular teacher profile as per their ID field,
  update the profile of an existing teacher,
  delete the profile of an existing teacher
An admin can also perform similar functions on student users as well, 
  create a new student user,
  get all the students enrolled in the system,
  get an individual student profile,
  update the profile of an existing user,
  delete a student from a system and make sure the student will be deleted from other associated collections

## Teacher 

A teacher can log in to see the dashboard and can update the password.
A teacher can create a new course and also post new notifications or updates regarding their courses.
A teacher has the functionality to get all the students enrolled in their courses.
A teacher has the option to update the course and notifications as per their requirements and the student will get the email if there is any update to the course.

## Student

A student can see their profile as well as can look for their enrolled courses on the dashboard. 
The enrolled courses notifications feature provides the ability to get all the notifications from enrolled courses.
A student has the login feature as well as  can update their password.
A student can enroll in a course created by a student. At the moment there is no restriction on the student while registering for a course

## Logger
A custom logger 

New features will be added to this education portal API

