name := "web"

version := "1.0-SNAPSHOT"

packageArchetype.java_server

scalaVersion := "2.11.1"

val appDependencies = Seq(	
	"be.objectify"  %% "deadbolt-java"     % "2.3.0-RC1",
  	"com.feth"      %% "play-authenticate" % "0.6.5-SNAPSHOT",
 	javaCore,
  	javaJdbc,
  	javaEbean,
  	cache,
  	javaWs,  
  	"mysql" % "mysql-connector-java" % "5.1.18"
)

//lazy val root = (project in file(".")).enablePlugins(PlayJava)

resolvers ++= Seq(
  "Apache" at "http://repo1.maven.org/maven2/",
  "jBCrypt Repository" at "http://repo1.maven.org/maven2/org/",
  "play-easymail (release)" at "http://joscha.github.io/play-easymail/repo/releases/",
  "play-easymail (snapshot)" at "http://joscha.github.io/play-easymail/repo/snapshots/",
  Resolver.url("Objectify Play Repository", url("http://schaloner.github.io/releases/"))(Resolver.ivyStylePatterns),
  "play-authenticate (release)" at "http://joscha.github.io/play-authenticate/repo/releases/",
  "play-authenticate (snapshot)" at "http://joscha.github.io/play-authenticate/repo/snapshots/"
)

lazy val root = project.in(file("."))
  .enablePlugins(PlayJava)
  .settings(
    libraryDependencies ++= appDependencies
  )