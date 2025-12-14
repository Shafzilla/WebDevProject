# WebDevProject


# How to set up project


##  Installation


* Run `git clone https://github.com/Shafzilla/WebDevProject.git`
* run 
``npm install
`` in the project root directory

---

##  Database

* Project uses PostgreSQL database
* run uploaded SQL statements / database dumps in DBeaver or another SQL editor
* copy and paste the contents from `Restaurant=database.sql` in an SQL editor script if there is any confusion


### Connect server to database

* Open sample.env
* add configuration values for your database such as the [host, port, username, password]
* leave the [JWT_SECRET] as it is.
* change file name to ".env"

---

## ⚙️ Running the Server


### Steps

* Open terminal at project directory
* enter `node server.js` or `npm run dev`


---