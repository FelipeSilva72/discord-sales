interface SystemSales {
    roleSalesId: string;
    channelSalesPublicId: string;
    channelSalesPrivateId: string;
}

export interface GuildDocument {
    sales?: SystemSales
}