import type { NextFunction, Request, Response } from "express";

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(`HTTP REQUEST: `, {
      method: req.method,
      url: req.originalUrl,
      responseTime: duration + "ms",
      statusCode: res.statusCode
    });
  });

  next();
};
