# WorkoutWizard

This is a React/Node.js web application designed to help gyms collect and maintain a repository of workouts for use during classes, personal training and more. 

As of yet, we have not created any "user login" functionality. However, you can create a variety of workouts with exercise associations. You can add additional exercises, muscle groups and associations between exercises and muscle groups. 

The Workout Exercise association contains "ordering". The ordering is maintained when adding or deleting exercises from a Workout. This is accomplished by looping through the remaining workout_exercise associations until either a hole is made or a hole is filled depending on the intended action. 

In the future, we would like to add additional search features, particularly on the homepage, that allow you to search by Exercise and Muscle Group. We would also like to add in "log in" features so each user can see their own workouts as well as other users' workouts. 

This was created as a final project for OSU CS 340 (Introduction to Databases).

https://workout-wizard.herokuapp.com/
