var models = require('../models/models.js');

exports.index = function(req, res){
  var estadisticas = {};
  models.Quiz.findAll({include:[{model:models.Comment}]})
    .then(function(quiz){
      estadisticas.comentarios = 0;
      estadisticas.con_comentarios = 0;
      estadisticas.sin_comentarios = 0;
      for (var i = 0; i < quiz.length; i++) {
        if (quiz[i].comments.length === 0){
          estadisticas.sin_comentarios++;
        }else {
          estadisticas.con_comentarios++;
        }
        estadisticas.comentarios += quiz[i].comments.length;
      }
      estadisticas.preguntas = quiz.length;
      estadisticas.media_comentarios = estadisticas.preguntas/estadisticas.comentarios;
      res.render('estadisticas/index', { estadisticas : estadisticas, errors: []});
    });
}
