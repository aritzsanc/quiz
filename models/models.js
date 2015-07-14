var path = require('path');

var temas = ["Otro", "Humanidades", "Ocio", "Ciencia", "Tecnología"]

exports.temas = temas;

// Postgres DATABASE_URL = postgres://user:passwd@host:port/database
// SQLite   DATABASE_URL = sqlite://:@:/
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name  = (url[6]||null);
var user     = (url[2]||null);
var pwd      = (url[3]||null);
var protocol = (url[1]||null);
var dialect  = (url[1]||null);
var port     = (url[5]||null);
var host     = (url[4]||null);
var storage  = process.env.DATABASE_STORAGE;


// Cargar Modelo ORM
var Sequelize = require('sequelize');

// Usar BBDD SQLite o Postgres
var sequelize = new Sequelize(DB_name, user, pwd,
  { dialect:  protocol,
    protocol: protocol,
    port:     port,
    host:     host,
    storage:  storage,  // solo SQLite (.env)
    omitNull: true      // solo Postgres
  }
);

// Importar definicion de la tabla Quiz
var quiz_path = path.join(__dirname,'quiz');
var Quiz = sequelize.import(quiz_path);

//Importamos la deficnión de la tabla de comentarios
var comment_path = path.join(__dirname, 'comment');
var Comment = sequelize.import(comment_path);

//Definimos las relaciones entre las tablas
Comment.belongsTo(Quiz);
Quiz.hasMany(Comment);

// exportar tablas
exports.Quiz = Quiz;
exports.Comment = Comment;

// sequelize.sync() inicializa tabla de preguntas en DB
sequelize.sync().then(function() {
  // success(..) ejecuta el manejador una vez creada la tabla
	Quiz.count().then(function (count){
		console.log("count = " + count);
	  if(count === 0) {   // la tabla se inicializa solo si está vacía
		Quiz.create({pregunta: '¿Capital de Italia?',
					respuesta: 'Roma',
          tema: temas[1]
					}); //
		Quiz.create({pregunta: '¿Capital de Portugal?',
					respuesta: 'Lisboa',
          tema: temas[1]
					}) //
		.then(function(){console.log('Base de datos inicializada')});
	  };
	});
});
