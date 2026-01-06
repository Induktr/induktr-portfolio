import type { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

export default function handler(req: Request, res: Response) {
  try {
    const listDir = (dir: string): any => {
      const files = fs.readdirSync(dir);
      return files.map(file => {
        const fullPath = path.join(dir, file);
        const stats = fs.statSync(fullPath);
        if (stats.isDirectory()) {
          return { name: file, type: 'dir', children: listDir(fullPath) };
        }
        return { name: file, type: 'file', size: stats.size };
      });
    };

    const tree = listDir(process.cwd());
    res.json({
      cwd: process.cwd(),
      tree
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message, stack: err.stack });
  }
}
