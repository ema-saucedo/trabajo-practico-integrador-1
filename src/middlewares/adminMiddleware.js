export const adminMiddleware = (req, res, next) => {
    //esto es lo que mencione en el otro middleware donde podiamos acceder a req.user.role mas facilmente, aca dice que si el rol no es igual a admin va a tirar un error 403 que es por falta de autorizacion y el 401 que hice anteriormente era por falta de autenticacion
    if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "No tenés permisos para realizar esta acción",
    });
  }
  next();
};
