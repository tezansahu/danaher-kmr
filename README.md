# Danaher-KMR (Team ID: CO-208042)
Knowledge Management Repository for Danaher [Submission for CorpComp (Techfest 2020-21)]

## Problem Statement

Need for a digital repository to store documents, photos, and videos and allow ease of access by keywords / topic.

[Link to Detailed Problem Statement](assets/pdf/SmartUI.pdf)

---
### Usage:

Clone the Repository:

```console
> git clone https://github.com/tezansahu/danaher_kmr.git
> cd danaher_kmr/
```


Install the dependencies:
```console
> pip install requirements.txt
```
---
## Features Implemented

### User login and register
The landing page is the login page. A new user needs to first register by filling in some details. Login errors like  invalid username or password, and registration errors like already-existent user are appropriately displayed. Passwords are hashed using the SHA256 algorithm before sending to the server.

![Demo](demo/reg_login_logout.gif)

### User profile and password update
A user can change profile details and reset password via 'My Accounts' page. 

![Demo](demo/profile_passwd_update.gif)

### Folder create 
Folder can be created via the 'Create New Folder' button in the bottom right corner. Folders created on the Home page (no parent folder) will be directly added to the root folder of the specific month and year (Example - '2021-March' as shown in following GIF). The user can view all folders but can only edit the folders created by him. 

![Demo](demo/folder_create.gif)

### File upload/download 
Multiple files can be uploaded (only in the folder created by the user) using the 'Upload Files' button in the bottom right corner, either by dropping them in the dialog box or by clicking on 'Select Files' button. 

By clicking on the thumbnail of any file, the user can get the details such as file size and creator. The file can be downloaded via the 'Download' button in the dialog box.  

![Demo](demo/file_upload_download.gif)

### Search 
Files and folders can be searched throughout the database using a keyword for name. Advanced search option is also available to refine the results by filters like username and file type.

![Demo](demo/search.gif)

### File and folder delete/restore 
Any file or folder created by the user can be moved to 'Trash', where it stays for 10 days before being automatically deleted from the database. The user has an option to restore the file/folder within these 10 days to the original location or permanently delete them manually.

![Demo](demo/trash_restore_delete.gif)

### File and Folder rename
The files and folders created by user can be renamed using the 'Rename' option from the dropdown as shown in the following GIF.

![Demo](demo/folder_file_rename.gif)

### Dark theme

![Demo](demo/dark_theme.gif)

---

<p align="center">Created with ❤️ by <a href="https://rishabharya.site/" target="_blank">Rishabh Arya</a>, <a href="https://laddhashreya2000.github.io" target="_blank">Shreya Laddha</a> & <a href="https://tezansahu.github.io/" target="_blank">Tezan Sahu</a></p>
