# OperatingSystems415

# Summary
 Created by Team Interrobang, this operating system is built using barebones Javascript for users to play around with from their browser. This project utilizes multithreading and multiprocessing through the usage of web workers. Each process and "threads" that are created are initialized as web workers, allowing them to work in a background thread. This allows the user to continue to interact with the UI even when a process is running. Our task scheduler is based on first come first server rather than a more sophisticated task scheduling algortihm such as round robin. The OS serves as a middleman, a layer of abstraction, between the various devices and processes. 
 
 The Operating System, of course, also supports file structures: creating and changing directories. The file structure, unlike in Linux which uses files as directories, utilizes IndexedDb to be the file structure. Each directory made is a new table; and to link to the directory, an element is inserted to the root directory table with the label "Folder". 
 
 The Operating System also supports a naive level of security. There is a login screen where you cannot enter any CLI commands until you login as the SuperUser or a regular user. Once logged in, if you're the SuperUser, you can add and delete new users, add and delete users from a group, and see/change the permissions of various files and processes.
 
# Team Members
 1. David Chau
 2. Tony Tran
 3. Hin Vong
 4. Andrew Goff
 5. Benson Zheng
