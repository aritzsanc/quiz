//Definición del modelo de Comment con validación

module.exports = function(sequelize, DataTypes){
  return sequelize.define(
    { texto: {
        type: DataTypes.STRING,
        validate: { notEmpty:{msg: "-> Falta Comentario"}}
      }
    }
  );
}
