name := "TVMaxPolla"

version := "1.0-SNAPSHOT"

packageArchetype.java_server

scalaVersion := "2.11.1"

libraryDependencies ++= Seq(
  	javaJdbc,
  	javaEbean,
  	cache,
  	javaWs,
	"mysql" % "mysql-connector-java" % "5.1.26",
	"org.mindrot" % "jbcrypt" % "0.3m"
)     

lazy val root = (project in file(".")).enablePlugins(play.PlayJava)
