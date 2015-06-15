import play.PlayJava
import com.typesafe.sbt.SbtNativePackager._
import NativePackagerKeys._

name := "futbolBrasil"

version := "1.0-SNAPSHOT"

//lazy val JobCore = file("/var/lib/jenkins/jobs/job_core_test/workspace/jobcore")
lazy val JobCore = file("/home/plessmann/Development/projects/JobCore")

lazy val root = (project.in(file("."))).enablePlugins(PlayJava)
                .aggregate(JobCore)
                .dependsOn(JobCore)

scalaVersion := "2.10.1"

libraryDependencies ++= Seq(
 	javaJdbc,
  javaEbean,
  cache,
  javaWs,
  "be.objectify"  %% "deadbolt-java"     % "2.3.0-RC1",
  "com.feth"      %% "play-authenticate" % "0.6.5-SNAPSHOT",
  "org.apache.commons" % "commons-io" % "1.3.2",
	"org.apache.jclouds.driver" % "jclouds-slf4j" % "1.8.0",
	"org.apache.jclouds.driver" % "jclouds-sshj" % "1.8.0",
	"org.apache.jclouds.provider" % "rackspace-cloudservers-us" % "1.8.0",
	"org.apache.jclouds.provider" % "cloudfiles-us" % "1.8.0",
	"org.apache.jclouds.provider" % "rackspace-cloudblockstorage-us" % "1.8.0",
	"org.apache.jclouds.provider" % "rackspace-clouddns-us" % "1.8.0",
	"org.apache.jclouds.provider" % "rackspace-cloudloadbalancers-us" % "1.8.0",
	"org.apache.jclouds.provider" % "rackspace-cloudservers-uk" % "1.8.0",
	"org.apache.jclouds.provider" % "cloudfiles-uk" % "1.8.0",
	"org.apache.jclouds.provider" % "rackspace-cloudblockstorage-uk" % "1.8.0",
	"org.apache.jclouds.provider" % "rackspace-clouddns-uk" % "1.8.0",
	"org.apache.jclouds.provider" % "rackspace-cloudloadbalancers-uk" % "1.8.0",
	"org.apache.jclouds" % "jclouds-compute" % "1.8.0"
)

resolvers ++= Seq(
  "Maven1 Repository" at "http://repo1.maven.org/maven2/net/vz/mongodb/jackson/play-mongo-jackson-mapper_2.10/1.1.0/",
  "Apache" at "http://repo1.maven.org/maven2/",
  "jBCrypt Repository" at "http://repo1.maven.org/maven2/org/",
  "play-easymail (release)" at "http://joscha.github.io/play-easymail/repo/releases/",
  "play-easymail (snapshot)" at "http://joscha.github.io/play-easymail/repo/snapshots/",
  Resolver.url("Objectify Play Repository", url("http://schaloner.github.io/releases/"))(Resolver.ivyStylePatterns),
  "play-authenticate (release)" at "http://joscha.github.io/play-authenticate/repo/releases/",
  "play-authenticate (snapshot)" at "http://joscha.github.io/play-authenticate/repo/snapshots/"
)

