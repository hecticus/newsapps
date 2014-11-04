# Override default Play's validation messages

# --- Constraints
constraint.required=Obligatorio
constraint.min=Valor mínimo: {0}
constraint.max=Valor máximo: {0}
constraint.minLength=Longitud mínima: {0}
constraint.maxLength=Longitud máxima: {0}
constraint.email=Email

# --- Formats
format.date=Date (''{0}'')
format.numeric=Numérico
format.real=Real

# --- Errors
error.invalid=Valor incorrecto
error.required=Este campo es obligatorio
error.number=Se esperaba un valor numérico
error.real=Se esperaba un numero real
error.min=Debe ser mayor o igual que {0}
error.max=Debe ser menor o igual que {0}
error.minLength=La longitud mínima es de {0}
error.maxLength=La longitud máxima es de {0}
error.email=Se requiere un email válido
error.pattern=Debe satisfacer {0}

### --- play-authenticate START

# play-authenticate: Initial translations

playauthenticate.accounts.link.success=Cuenta enlazada correctamente
playauthenticate.accounts.merge.success=Cuentas unificadas correctamente

playauthenticate.verify_email.error.already_validated=Su email ya ha sido validado
playauthenticate.verify_email.error.set_email_first=Primero debe dar de alta un email.
playauthenticate.verify_email.message.instructions_sent=Las instrucciones para validar su cuenta han sido enviadas a {0}.
playauthenticate.verify_email.success=La dirección de email ({0}) ha sido verificada correctamente.

playauthenticate.reset_password.message.instructions_sent=Las instrucciones para restablecer su contraseña han sido enviadas a {0}.
playauthenticate.reset_password.message.email_not_verified=Su cuenta aún no ha sido validada. Se ha enviado un email incluyedo instrucciones para su validación. Intente restablecer la contraseña una vez lo haya recibido.
playauthenticate.reset_password.message.no_password_account=Su usuario todavía no ha sido configurado para utilizar contraseña.
playauthenticate.reset_password.message.success.auto_login=Su contraseña ha sido restablecida.
playauthenticate.reset_password.message.success.manual_login=Su contraseña ha sido restablecida. Intente volver a entrar utilizando su nueva contraseña.

playauthenticate.change_password.error.passwords_not_same=Las contraseñas no coinciden.
playauthenticate.change_password.success=La contraseña ha sido cambiada correctamente.

playauthenticate.password.signup.error.passwords_not_same=Las contraseñas no coinciden.
playauthenticate.password.login.unknown_user_or_pw=Usuario o contraseña incorrectos.
playauthenticate.email.signup.error.not_valid=Su cuenta de correo no es valida en este sitio

playauthenticate.password.verify_signup.subject=A Gata Do Dia: Complete su registro
playauthenticate.password.verify_email.subject=A Gata Do Dia: Confirme su dirección de email
playauthenticate.password.reset_email.subject=A Gata Do Dia: Cómo restablecer su contraseña

# play-authenticate: Additional translations

playauthenticate.login.email.placeholder=Su dirección de email
playauthenticate.login.password.placeholder=Elija una contraseña
playauthenticate.login.password.repeat=Repita la contraseña elegida
playauthenticate.login.title=Entrar
playauthenticate.login.password.placeholder=Contraseña
playauthenticate.login.now=Entrar
playauthenticate.login.forgot.password=¿Olvidó su contraseña?
playauthenticate.login.oauth=entre usando su cuenta con alguno de los siguientes proveedores:

playauthenticate.signup.title=Registrarse
playauthenticate.signup.name=Su nombre
playauthenticate.signup.now=Regístrese
playauthenticate.signup.oauth=regístrese usando su cuenta con alguno de los siguientes proveedores:

playauthenticate.verify.account.title=Es necesario validar su email
playauthenticate.verify.account.before=Antes de configurar una contraseña
playauthenticate.verify.account.first=valide su email

playauthenticate.change.password.title=Cambio de contraseña
playauthenticate.change.password.cta=Cambiar mi contraseña

playauthenticate.merge.accounts.title=Unir cuentas
playauthenticate.merge.accounts.question=¿Desea unir su cuenta ({0}) con su otra cuenta: {1}?
playauthenticate.merge.accounts.true=Sí, ¡une estas dos cuentas!
playauthenticate.merge.accounts.false=No, quiero abandonar esta sesión y entrar como otro usuario.
playauthenticate.merge.accounts.ok=OK

playauthenticate.link.account.title=Enlazar cuenta
playauthenticate.link.account.question=¿Enlazar ({0}) con su usuario?
playauthenticate.link.account.true=Sí, ¡enlaza esta cuenta!
playauthenticate.link.account.false=No, salir y crear un nuevo usuario con esta cuenta
playauthenticate.link.account.ok=OK

# play-authenticate: Signup folder translations

playauthenticate.verify.email.title=Verifique su email
playauthenticate.verify.email.requirement=Antes de usar A Gata Do Dia, debe validar su email.
playauthenticate.verify.email.cta=Se le ha enviado un email a la dirección registrada. Por favor, siga el link de este email para activar su cuenta.
playauthenticate.password.reset.title=Restablecer contraseña
playauthenticate.password.reset.cta=Restablecer mi contraseña

playauthenticate.password.forgot.title=Contraseña olvidada
playauthenticate.password.forgot.cta=Enviar instrucciones para restablecer la contraseña

playauthenticate.oauth.access.denied.title=Acceso denegado por OAuth
playauthenticate.oauth.access.denied.explanation=Si quiere usar A Gata Do Dia con OAuth, debe aceptar la conexión.
playauthenticate.oauth.access.denied.alternative=Si prefiere no hacerlo, puede también
playauthenticate.oauth.access.denied.alternative.cta=registrarse con un usuario y una contraseña.

playauthenticate.token.error.title=Error de token
playauthenticate.token.error.message=El token ha caducado o no existe.

playauthenticate.user.exists.title=El usuario existe
playauthenticate.user.exists.message=Otro usario ya está dado de alta con este identificador.

# play-authenticate: Navigation
playauthenticate.navigation.profile=Perfil
playauthenticate.navigation.link_more=Enlazar más proveedores
playauthenticate.navigation.logout=Salir
playauthenticate.navigation.login=Entrar
playauthenticate.navigation.home=Inicio
playauthenticate.navigation.restricted=Página restringida
playauthenticate.navigation.signup=Dárse de alta

# play-authenticate: Handler
playauthenticate.handler.loginfirst=Para ver ''{0}'', debe darse primero de alta.

# play-authenticate: Profile
playauthenticate.profile.title=Perfil de usuario
playauthenticate.profile.mail=Su nombre es {0} y su dirección de mail es {1}!
playauthenticate.profile.unverified=sin validar - haga click para validar
playauthenticate.profile.verified=validada
playauthenticate.profile.providers_many=Hay {0} proveedores enlazados con su cuenta:
playauthenticate.profile.providers_one = Hay un proveedor enlazado con su cuenta:
playauthenticate.profile.logged=Ha entrado con:
playauthenticate.profile.session=Su ID de usuario es {0}. Su sesión expirará el {1}.
playauthenticate.profile.session_endless=Su ID de usuario es {0}. Su sesión no expirará nunca porque no tiene caducidad.
playauthenticate.profile.password_change=Cambie/establezca una contraseña para su cuenta

# play-authenticate - sample: Index page
playauthenticate.index.title=Bienvenido Play Authenticate
playauthenticate.index.intro=Aplicación de ejemplo de Play Authenticate
playauthenticate.index.intro_2=Esto es una plantilla para una sencilla aplicación con autentificación y autorización
playauthenticate.index.intro_3=Mire la barra de navegación superior para ver ejemplos sencillos incluyendo las características soportadas de autentificación.
playauthenticate.index.heading=Cabecera
playauthenticate.index.details=Ver detalles

# play-authenticate - sample: Restricted page
playauthenticate.restricted.secrets=¡Secretos y más secretos!

### --- play-authenticate END

main.start=Inicio
main.women=Mujeres
main.posts=Publicaciones
main.languages=Idiomas
main.countries=Paises
main.categories=Categorias
main.configurations=Configuraciones
main.list=Listar
main.operations=Operaciones
main.create=Crear

generic.error.title=Error
generic.error.content=Revise los errores y haga la solicitud de nuevo
generic.cancel=Cancelar
generic.list.done=Hecho!
generic.list.apply=Aplicar
generic.list.empty=No hay nada que mostrar
generic.list.previous=Anterior
generic.list.next=Siguiente
generic.list.listing=Listando del
generic.list.through=al
generic.list.of=de

languages.list.head=Idiomas
languages.list.title={0,choice,0#No hay Idiomas|1#Un Idioma encontrado|1<{0,number,integer} Idiomas encontrados}
languages.list.filter.name=Filtrar por nombre del Idioma...
languages.list.new=Agregar nuevo Idioma

languages.create=Crear Idioma
languages.edit=Editar Idioma
languages.info=Informacion del Idioma

languages.name=Nombre
languages.name.help=Inserte un nombre valido

languages.shortname=Nombre corto
languages.shortname.help=Inserte un nombre valido

languages.active=Activo
languages.active.help=inserte 0 o 1

languages.submit.create=Crear este idioma
languages.submit.update=Actualizar este idioma
languages.submit.delete=Eliminar este idioma

languages.java.created= El idioma {0} ha sido creado!
languages.java.updated= El idioma {0} ha sido actualizado!
languages.java.deleted= El idioma {0} ha sido eliminado!

countries.list.head=Paises
countries.list.title={0,choice,0#No hay Paises|1#Un Pais encontrado|1<{0,number,integer} Paises encontrados}
countries.list.filter.name=Filtrar por nombre del Pais...
countries.list.new=Agregar nuevo Pais

countries.create=Crear Pais
countries.edit=Editar Pais
countries.info=Informacion del Pais

countries.name=Nombre
countries.name.help=Inserte un nombre valido

countries.shortname=Nombre corto
countries.shortname.help=Inserte un nombre valido

countries.active=Activo
countries.active.help=inserte 0 o 1

countries.language=Idioma

countries.submit.create=Crear este Pais
countries.submit.update=Actualizar este Pais
countries.submit.delete=Eliminar este Pais

countries.java.created= El pais {0} ha sido creado!
countries.java.updated= El pais {0} ha sido actualizado!
countries.java.deleted= El pais {0} ha sido eliminado!


configs.list.head=Configuraciones
configs.list.title={0,choice,0#No hay confguraciones|1#Una configuracion encontrada|1<{0,number,integer} configuraciones encontradas}
configs.list.filter.name=Filtrar por nombre de la configuracion...
configs.list.new=Agregar nuev a configuracion

configs.create=Crear configuracion
configs.edit=Editar configuracion
configs.info=Informacion de la configuracion

configs.key=Clave
configs.key.help=String para buscar la configuracion

configs.value=Valor
configs.value.help=Valor de la configuracion

configs.description=Descripcion
configs.description.help=utilidad de la configuracion

configs.submit.create=Crear esta configuracion
configs.submit.update=Actualizar esta configuracion
configs.submit.delete=Eliminar esta configuracion

configs.java.created= La configuracion {0} ha sido creada!
configs.java.updated= La configuracion {0} ha sido actualizada!
configs.java.deleted= La configuracion {0} ha sido eliminada!

categories.list.head=Categorias
categories.list.title={0,choice,0#No hay Categorias|1#Una categoria encontrada|1<{0,number,integer} categorias encontradas}
categories.list.filter.name=Filtrar por nombre de la categoria...
categories.list.new=Agregar nueva categoria

categories.create=Crear categoria
categories.edit=Editar categoria
categories.info=Informacion de la categoria

categories.name=Nombre
categories.name.help=Inserte un nombre valido

categories.submit.create=Crear esta categoria
categories.submit.update=Actualizar esta categoria
categories.submit.delete=Eliminar esta categoria

categories.java.created= La categoria {0} ha sido creada!
categories.java.updated= La categoria {0} ha sido actualizada!
categories.java.deleted= La categoria {0} ha sido eliminada!

women.list.head=Mujeres
women.list.title={0,choice,0#No hay Mujeres|1#Una Mujer encontrada|1<{0,number,integer} Mujeres encontradas}
women.list.filter.name=Filtrar por nombre de la Mujer...
women.list.new=Agregar nueva Mujer

women.create=Crear Mujer
women.edit=Editar Mujer
women.info=Informacion de la Mujer

women.category=Categoria
women.category.plural=Categorias
women.category.remove=Eliminar esta categoria
women.category.add=Agregar Categoria

women.socialnetwork=Red Social
women.socialnetwork.plural=Redes Sociales
women.socialnetwork.remove=Eliminar esta Red Social
women.socialnetwork.add=Agregar Red Social
women.socialnetwork.link=Enlace

women.name=Nombre
women.name.help=Inserte un nombre valido

women.image=Imagen
women.image.file=Archivo

women.submit.create=Crear esta Mujer
women.submit.update=Actualizar esta Mujer
women.submit.delete=Eliminar esta Mujer

women.java.created= La mujer {0} ha sido creada!
women.java.updated= La mujer {0} ha sido actualizada!
women.java.deleted= La mujer {0} ha sido eliminada!

post.list.head=Publicaciones
post.list.title={0,choice,0#No hay Publicaciones|1#Una publicacion encontrada|1<{0,number,integer} publicaciones encontradas}
post.list.filter.name=Filtrar por nombre de la publicacion...
post.list.new=Agregar nueva publicacion

post.create=Crear Publicacion
post.edit=Editar Publicacion
post.info=Informacion de la Publicacion

post.submit.create=Crear esta publicacion
post.submit.update=Actualizar esta publicacion
post.submit.delete=Eliminar esta publicacion

post.push.scheduled=Agendado para ser enviado en
post.push.scheduled.help=Ingrese un epoch, http://www.epochconverter.com/.
post.push.pushing=Enviando...
post.push.pushed=Enviado

post.date=Fecha
post.date.help=Ingrese una fecha en formato yyyyMMddhhmm.

post.source=Fuente
post.source.help=Inserte una URL valida

post.socialnetwork=Red Social

post.woman=Mujer

post.localization=Traducciones
post.localization.remove=Eliminar esta Traduccion
post.localization.add=Agregar Traduccion
post.localization.language=Idioma
post.localization.title=Titulo
post.localization.content=Contenido

post.country=Pais
post.country.plural=Paises
post.country.remove=Eliminar este Pais
post.country.add=Agregar Pais

post.media=Recursos
post.media.remove=Eliminar este Recurso
post.media.add=Agregar Recurso
post.media.file=Archivo
post.media.file.type=Tipo de archivo
post.media.file.final=Archivo - NO CAMBIAR
post.media.md5.final=MD5 - NO CAMBIAR
post.media.main=Activa para la Pantalla Principal?

post.java.created= La publicacion {0} ha sido creada!
post.java.updated= La publicacion {0} ha sido actualizada!
post.java.deleted= La publicacion {0} ha sido eliminada!


