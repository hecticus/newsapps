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
    "securesocial" %% "securesocial" % "2.1.1" excludeAll(ExclusionRule(organization="org.ow2.spec.ee"), ExclusionRule(organization="com.cedarsoft")),
    "org.apache.jclouds" % "jclouds-allblobstore" % "1.7.2",
    "com.google.guava" % "guava" % "15.0",
    "com.jolbox" % "bonecp-spring" % "0.8.0.RELEASE",
    "org.apache.jclouds.driver" % "jclouds-slf4j" % "1.7.2",
    "org.apache.jclouds.driver" % "jclouds-sshj" % "1.7.2",
    "org.apache.jclouds.provider" % "rackspace-cloudservers-us" % "1.7.2",
    "org.apache.jclouds.provider" % "cloudfiles-us" % "1.7.2",
    "org.apache.jclouds.provider" % "rackspace-cloudblockstorage-us" % "1.7.2",
    "org.apache.jclouds.provider" % "rackspace-clouddns-us" % "1.7.2",
    "org.apache.jclouds.provider" % "rackspace-cloudloadbalancers-us" % "1.7.2",
    "org.apache.jclouds.provider" % "rackspace-cloudservers-uk" % "1.7.2",
    "org.apache.jclouds.provider" % "cloudfiles-uk" % "1.7.2",
    "org.apache.jclouds.provider" % "rackspace-cloudblockstorage-uk" % "1.7.2",
    "org.apache.jclouds.provider" % "rackspace-clouddns-uk" % "1.7.2",
    "org.apache.jclouds.provider" % "rackspace-cloudloadbalancers-uk" % "1.7.2",
    "org.jclouds" % "jclouds-compute" % "1.5.0-alpha.6",
    "org.reflections" % "reflections" % "0.9.7.RC1"
  )

  val main = play.Project(appName, appVersion, appDependencies).settings(
    // Add your own project settings here 
       ebeanEnabled := true,
      resolvers += "Maven1 Repository" at "http://repo1.maven.org/maven2/net/vz/mongodb/jackson/play-mongo-jackson-mapper_2.10/1.1.0/",
      resolvers += Resolver.url("sbt-plugin-releases", new URL("http://repo.scala-sbt.org/scalasbt/sbt-plugin-releases/"))(Resolver.ivyStylePatterns),
      resolvers += "Sonatype snapshots" at "https://oss.sonatype.org/content/repositories/snapshots"
  )

}
