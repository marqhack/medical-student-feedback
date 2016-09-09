# Feedback
_Helping medical educators provide feedback to their students_ 

## What to do 

Get yourself in front of a terminal, and *make sure you have git installed!* You can check by typing 

    git --version 

into your terminal. If it does anything other than spit out the version, then you'll need to install git. 

### Getting started

    git clone https://github.com/tylerklose/medical-student-feedback.git
    cd medical-student-feedback
    git branch marquis 

This makes a local copy of the code on your machine, changes you to the root of the repository/directory, and switches to a "branch" called marquis. (Name yours something different for now). We work in a different branch so that when we break everything and nothing works, we still have a working copy of our code.

### Saving your changes 

After you've made some changes to files locally, and want to save them, you **_stage_** and _**commit**_ your changes:

    git add --all
    git commit -m "<type up a descriptive message of the changes you made>"

### Uploading your changes 

When you're ready to push up to the repo, **stage** and **commit** your changes, then:  

    git push origin develop
   
You might need to enter your github username and passowrd. There are a few other things you'll need to know, but let's start here. 




