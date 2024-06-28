interface SystemSales {
    roleId: string;
    channelSalesPublicId: string;
    channelSalesPrivateId: string;
}

export interface GuildDocument {
    sales?: SystemSales
}