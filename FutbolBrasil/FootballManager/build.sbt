name := """FootballManager"""

version := "1.0-SNAPSHOT"

lazy val root = (project in file(".")).enablePlugins(PlayJava)

scalaVersion := "2.10.1"

libraryDependencies ++= Seq(
  javaJdbc,
  javaEbean,
  cache,
  javaWs,
  "com.typesafe.akka" %% "akka-actor" % "2.3.3",
  "com.typesafe.akka" %% "akka-contrib" % "2.3.3",
  "com.typesafe.akka" %% "akka-remote" % "2.3.4",
  "com.rabbitmq" % "amqp-client" % "3.0.1",
  "mysql" % "mysql-connector-java" % "5.1.26",
   "com.google.guava" % "guava" % "15.0",
  "com.jolbox" % "bonecp-spring" % "0.8.0.RELEASE",
  "org.reflections" % "reflections" % "0.9.7.RC1",
  "javax.activation" % "activation" % "1.1",
  "javax.mail" % "mail" % "1.4.7",
  "com.sun.xml.messaging.saaj" % "saaj-impl" % "1.3",
  "net.jodah" % "lyra" % "0.4.1",
  "bouncycastle" % "bcprov-jdk15" % "140",
  "commons-net" % "commons-net" % "3.3",
  "org.apache.sanselan" % "sanselan" %"0.97-incubator",
  "net.vz.mongodb.jackson" %% "play-mongo-jackson-mapper" % "1.1.0",
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
  "org.apache.jclouds" % "jclouds-compute" % "1.8.0",
  "org.reflections" % "reflections" % "0.9.7.RC1",
  "javax.activation" % "activation" % "1.1",
  "javax.mail" % "mail" % "1.4.7",
  "com.sun.xml.messaging.saaj" % "saaj-impl" % "1.3"
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


