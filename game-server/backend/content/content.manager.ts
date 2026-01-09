import { Server } from "../server";
import * as fs from "fs";
import { CONSOLE_FORMATTERS } from "../modules/logger";
import path from "path";
import { EntityType } from "../enums/types/entity.type";

export class ContentManager {
    private server: Server;

    constructor(server: Server) {
        this.server = server;
        this.loadPackages();
    }

    private softReadDir(dir: string) {
        const fullDir = path.join(__dirname, dir); // Use __dirname here
        if (!fs.existsSync(fullDir)) {
            this.server.logger.error(`[Content] ${CONSOLE_FORMATTERS.RED}${CONSOLE_FORMATTERS.BG_RED}Doesn't exist path: ${fullDir}`);
            return [];
        }
        return fs.readdirSync(fullDir);
    }

    private softReadFile(filePath: string, fileEncoding: BufferEncoding = "utf8") {
        const fullPath = path.join(__dirname, filePath); // Use __dirname here
        if (!fs.existsSync(fullPath)) {
            this.server.logger.error(`[Content] ${CONSOLE_FORMATTERS.RED}${CONSOLE_FORMATTERS.BG_RED}Doesn't exist path: ${fullPath}`);
            return null;
        }
        return fs.readFileSync(fullPath, { encoding: fileEncoding });
    }

    private readEntities(contentName: string, entitiesPath: string, paths: string[]) {
        for (const unParsedPath of paths) {
            const parsedPath = path.parse(unParsedPath);
            const name = parsedPath.name;

            if (parsedPath.ext === ".json") {
                const config = this.softReadFile(path.join(entitiesPath, unParsedPath), "utf8");
                if (!config) continue;

                try {
                    const buildingDef = JSON.parse(config);
                    const id = EntityType[name.toUpperCase()];
                    if (typeof id !== "number") {
                        this.server.logger.warn(`[Content] ${CONSOLE_FORMATTERS.RESET}${CONSOLE_FORMATTERS.BG_YELLOW}Skipped building ${name}: invalid entity type`);
                        continue;
                    }
                    this.server.content.entities[id] = buildingDef;
                } catch (e) {
                    this.server.logger.warn(`[Content] ${CONSOLE_FORMATTERS.RESET}${CONSOLE_FORMATTERS.BG_YELLOW}Skipped building ${name}: invalid JSON`);
                }
            } else if (parsedPath.ext === "") {
                const newPath = path.join(entitiesPath, name); // path to subfolder
                const newPaths = this.softReadDir(newPath);
                this.readEntities(contentName, newPath, newPaths);
            }
        }
    }

    public loadPackages() {
        const fileNames = this.softReadDir("../../../content"); // adjust relative to this file
        for (const fileName of fileNames) {
            this.server.logger.log(`[Content] ${CONSOLE_FORMATTERS.MAGENTA}Loading ${fileName} content-pack`);

            const entitiesFolder = this.softReadDir(path.join("../../../content", fileName, "entities"));

            if (entitiesFolder.length !== 0) {
                this.server.logger.log(`[Content]${CONSOLE_FORMATTERS.GREEN} Loaded ${entitiesFolder.length} entities`);
            }

            this.readEntities(fileName, path.join("../../../content", fileName, "entities"), entitiesFolder);
        }
    }
}
