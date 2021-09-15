/**
 * Pages Controller
 */

/* Imports */
import { Request, Response } from "express";

/* Home page */
export let index = (req: Request, res: Response) => {
    res.render("pages/home", {
        title: "Home"
    });
};

/* Docs page */ // Removed
/*
export let docs = (req: Request, res: Response) => {
    res.render("pages/docs", {
        title: "Documentation"
    });
};*/

/* App */
export let app = (req: Request, res: Response) => {
    res.render("app", {
        title: "Subify"
    });
};

/* About page */
export let about = (req: Request, res: Response) => {
    res.render("pages/about", {
        title: "About"
    });
};

/* 404 page */
export let error = (req: Request, res: Response) => {
    res.status(404);
    res.render("pages/404", {
        title: "Page not found"
    });
};