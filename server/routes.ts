import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth, hashPassword } from "./auth";
import { storage } from "./storage";

export const registerRoutes = (app: Express): Server => {
  setupAuth(app);

  // Project Routes
  app.get("/api/projects", async (_req, res) => {
    try {
      const allProjects = await storage.getProjects();
      res.json(allProjects);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  app.post("/api/projects", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    try {
      const project = await storage.createProject(req.body);
      res.status(201).json(project);
    } catch (error) {
      res.status(400).json({ message: "Failed to create project" });
    }
  });

  app.patch("/api/projects/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    try {
      const project = await storage.updateProject(parseInt(req.params.id), req.body);
      res.json(project);
    } catch (error) {
      res.status(400).json({ message: "Failed to update project" });
    }
  });

  app.delete("/api/projects/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    try {
      await storage.deleteProject(parseInt(req.params.id));
      res.sendStatus(204);
    } catch (error) {
      res.status(400).json({ message: "Failed to delete project" });
    }
  });

  // Marketplace Routes
  app.get("/api/marketplace", async (_req, res) => {
    try {
      const items = await storage.getMarketplace();
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch marketplace items" });
    }
  });

  app.post("/api/marketplace", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    try {
      const item = await storage.createMarketplaceItem(req.body);
      res.status(201).json(item);
    } catch (error) {
      res.status(400).json({ message: "Failed to create marketplace item" });
    }
  });

  app.patch("/api/marketplace/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    try {
      const item = await storage.updateMarketplaceItem(parseInt(req.params.id), req.body);
      res.json(item);
    } catch (error) {
      res.status(400).json({ message: "Failed to update marketplace item" });
    }
  });

  app.delete("/api/marketplace/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    try {
      await storage.deleteMarketplaceItem(parseInt(req.params.id));
      res.sendStatus(204);
    } catch (error) {
      res.status(400).json({ message: "Failed to delete marketplace item" });
    }
  });

  // Tools Routes
  app.get("/api/tools", async (_req, res) => {
    try {
      const allTools = await storage.getTools();
      res.json(allTools);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tools" });
    }
  });

  app.post("/api/tools", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    try {
      const tool = await storage.createTool(req.body);
      res.status(201).json(tool);
    } catch (error) {
      res.status(400).json({ message: "Failed to create tool" });
    }
  });

  app.patch("/api/tools/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    try {
      const tool = await storage.updateTool(parseInt(req.params.id), req.body);
      res.json(tool);
    } catch (error) {
      res.status(400).json({ message: "Failed to update tool" });
    }
  });

  app.delete("/api/tools/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    try {
      await storage.deleteTool(parseInt(req.params.id));
      res.sendStatus(204);
    } catch (error) {
      res.status(400).json({ message: "Failed to delete tool" });
    }
  });

  // FAQ Routes
  app.get("/api/faq", async (_req, res) => {
    try {
      const allFAQ = await storage.getFAQ();
      res.json(allFAQ);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch FAQ" });
    }
  });

  app.post("/api/faq", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    try {
      const item = await storage.createFAQ(req.body);
      res.status(201).json(item);
    } catch (error) {
      res.status(400).json({ message: "Failed to create FAQ item" });
    }
  });

  app.patch("/api/faq/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    try {
      const item = await storage.updateFAQ(parseInt(req.params.id), req.body);
      res.json(item);
    } catch (error) {
      res.status(400).json({ message: "Failed to update FAQ item" });
    }
  });

  app.delete("/api/faq/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    try {
      await storage.deleteFAQ(parseInt(req.params.id));
      res.sendStatus(204);
    } catch (error) {
      res.status(400).json({ message: "Failed to delete FAQ item" });
    }
  });

  // Experience Routes
  app.get("/api/experience", async (_req, res) => {
    try {
      const allExp = await storage.getExperience();
      res.json(allExp);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch experience" });
    }
  });

  app.post("/api/experience", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    try {
      const item = await storage.createExperience(req.body);
      res.status(201).json(item);
    } catch (error) {
      res.status(400).json({ message: "Failed to create experience" });
    }
  });

  app.patch("/api/experience/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    try {
      const item = await storage.updateExperience(parseInt(req.params.id), req.body);
      res.json(item);
    } catch (error) {
      res.status(400).json({ message: "Failed to update experience" });
    }
  });

  app.delete("/api/experience/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    try {
      await storage.deleteExperience(parseInt(req.params.id));
      res.sendStatus(204);
    } catch (error) {
      res.status(400).json({ message: "Failed to delete experience" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
