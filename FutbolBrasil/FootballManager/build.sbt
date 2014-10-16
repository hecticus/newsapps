name := """FootballManager"""

version := "1.0-SNAPSHOT"

lazy val root = (project in file(".")).enablePlugins(PlayJava)

scalaVersion := "2.11.1"

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
  "org.apache.sanselan" % "sanselan" %"0.97-incubator"
)


