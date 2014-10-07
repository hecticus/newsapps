name := "web"

version := "1.0-SNAPSHOT"

packageArchetype.java_server

scalaVersion := "2.11.1"

libraryDependencies ++= Seq(
  javaJdbc,
  javaEbean,
  cache,
  javaWs,  
  "mysql" % "mysql-connector-java" % "5.1.18"
)

lazy val root = (project in file(".")).enablePlugins(PlayJava)