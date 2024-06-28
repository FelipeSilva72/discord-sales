import { DatabaseSchema, db } from "#database";
import { Guild } from "discord.js";

type SetData = DatabaseSchema["guilds"]["AssignArg"];
type UpdateData = DatabaseSchema["guilds"]["UpdateData"];

export async function getGuildData(guild: Guild) {
    const guildDocument = await db.guilds.get(db.guilds.id(guild.id));
    return { data: guildDocument?.data };
}

export async function setGuildData(guild: Guild, data: SetData) {
    return await db.guilds.set(db.guilds.id(guild.id), data);
}

export async function updateGuildData(guild: Guild, data: UpdateData) {
    return await db.guilds.update(db.guilds.id(guild.id), data);
}