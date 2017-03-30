# LebahAppTemplate

1.  This is a Java based web-application framework. You can use this framework to develop a web application. This framework comes with pre-setup portal's data where you can right away open it in the web browser, but first you need to open this as an Eclipse project.

    I am using Derby as database. You can find the derby data inside the derby folder (IMPORTANT: Don't modify or delete any files in this folder). You should copy this folder into your preferred location in your file system, and then set the url connection in the dbconnection.properties file to the location of your derby database.

    The database url value initially is pointing to my derby folder as below:

    url=jdbc:derby:/Users/Admin/Documents/workspace1/lebah4/derby/db;create=true

    Replace the "/Users/Admin/Documents/workspace1/lebah4/" to the location of where your derby folder located, for example if you are using Windows environment, and the you copied derby folder into "c:/MyData", then your database url connection should be like this:

    url=jdbc:derby:c:/MyData/derby/db;create=true

3. This repository contains example application that is using the LebahRecordTemplateModule to perform database driven web application, and this example is using the JAVA PERSISTENCE API to work with the database.


I will update this README again...

Thank You.<br/>
Shamsul Bahrin b Abd Mutalib

