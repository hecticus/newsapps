import sbt._
import Keys._
import play.Project._

object ApplicationBuild extends Build {

  val appName         = "TvnAdmin"
  val appVersion      = "1.0-SNAPSHOT"

  val appDependencies = Seq(
    // Add your project dependencies here,
    javaCore,
    javaJdbc,
    javaEbean,
     "mysql" % "mysql-connector-java" % "5.1.26",
    "net.vz.mongodb.jackson" %% "play-mongo-jackson-mapper" % "1.1.0",
     "securesocial" %% "securesocial" % "2.1.1"
  )

  val main = play.Project(appName, appVersion, appDependencies).settings(
    // Add your own project settings here 
       ebeanEnabled := true,
      resolvers += "Maven1 Repository" at "http://repo1.maven.org/maven2/net/vz/mongodb/jackson/play-mongo-jackson-mapper_2.10/1.1.0/",
      resolvers += Resolver.url("sbt-plugin-releases", new URL("http://repo.scala-sbt.org/scalasbt/sbt-plugin-releases/"))(Resolver.ivyStylePatterns)
  )

}
