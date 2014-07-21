import com.typesafe.sbt.SbtNativePackager._
//import NativePackagerKeys._

name := "TvnAdmin"

version := "1.0-SNAPSHOT"

scalaVersion := "2.10.1"

libraryDependencies ++= Seq(
  	javaJdbc,
  	javaEbean,
  	cache,
  	//javaWs,
	"mysql" % "mysql-connector-java" % "5.1.26",	
	"org.apache.jclouds" % "jclouds-allblobstore" % "1.7.3",
	"com.google.guava" % "guava" % "15.0",
	"com.jolbox" % "bonecp-spring" % "0.8.0.RELEASE",
  "org.apache.jclouds.driver" % "jclouds-slf4j" % "1.7.3",
	"org.apache.jclouds.driver" % "jclouds-sshj" % "1.7.3",
	"org.apache.jclouds.provider" % "rackspace-cloudservers-us" % "1.7.3",
	"org.apache.jclouds.provider" % "cloudfiles-us" % "1.7.3",
	"org.apache.jclouds.provider" % "rackspace-cloudblockstorage-us" % "1.7.3",
	"org.apache.jclouds.provider" % "rackspace-clouddns-us" % "1.7.3",
	"org.apache.jclouds.provider" % "rackspace-cloudloadbalancers-us" % "1.7.3",
	"org.apache.jclouds.provider" % "rackspace-cloudservers-uk" % "1.7.3",
	"org.apache.jclouds.provider" % "cloudfiles-uk" % "1.7.3",
	"org.apache.jclouds.provider" % "rackspace-cloudblockstorage-uk" % "1.7.3",
	"org.apache.jclouds.provider" % "rackspace-clouddns-uk" % "1.7.3",
	"org.apache.jclouds.provider" % "rackspace-cloudloadbalancers-uk" % "1.7.3",
	"org.jclouds" % "jclouds-compute" % "1.5.0-alpha.6",
	"org.reflections" % "reflections" % "0.9.7.RC1",
	"org.mindrot" % "jbcrypt" % "0.3m"
)     

//lazy val root = (project in file(".")).enablePlugins(PlayJava)

play.Project.playJavaSettings

resolvers ++= Seq(   			
	Resolver.url("sbt-plugin-releases", new URL("http://repo.scala-sbt.org/scalasbt/sbt-plugin-releases/"))(Resolver.ivyStylePatterns),
	"Sonatype snapshots" at "https://oss.sonatype.org/content/repositories/snapshots"
)