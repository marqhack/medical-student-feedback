# Medical Student Feedback
_Helping medical educators provide feedback to their students_ 

## What to do 


*Make sure you have git installed!* You can check by typing 

    git --version 

into your terminal. If it does anything other than spit out the version, then you'll need to install git. 

Copy the following commands into your terminal:

* Getting started

    git clone https://github.com/tylerklose/medical-student-feedback.git
    cd medical-student-feedback
    git branch marquis 

This makes a local copy of the code on your machine, changes you to the root of the repository/directory, and switches to a "branch" called marquis. (Name yours something different for now). We work in a different branch so that when we break everything and nothing works, we still have a working copy of our code.

    <make some changes to files locally>


* After you've made some changes, and want to save them, you *_stage_* and _*commit*_ your changes:

    git add --all
    git commit -m "<type up a descriptive message of the changes you made>"


* When you're ready to push things up to our repository (so that we can all see the local changes you've been making, stage and commit your changes, then:

    git push origin develop
    <here, you'll probably have to type in your username and password for github>

There are a few other things you'll need to know, but let's start here. 




