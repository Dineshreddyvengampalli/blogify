import express, { Router } from "express";
import routeControllerMapper from "../helpers/routeControllerMapper";

const universalRouter: Router = express.Router();

universalRouter.all("/:resource/:id?", async (req: any, res: any) => {
    const { resource } = req.params;

    const controller = routeControllerMapper(resource);

    if (!controller) {
        return res.status(404).json({
            success: false,
            message: `Resource '${resource}' not found.`,
        });
    }

    try {
        const { method } = req;

        switch (method.toUpperCase()) {
            case "GET":
                return controller.read(req, res)
            case "POST":
                return controller.create(req, res);
            default:
                return res.status(405).json({
                    success: false,
                    message: `Method '${method}' not allowed for resource '${resource}'.`,
                });
        }
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: "An unexpected error occurred.",
            error: error.message,
        });
    }
});

export default universalRouter;
