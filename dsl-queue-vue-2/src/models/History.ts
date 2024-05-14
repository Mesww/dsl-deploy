export interface History{
    historyid:number;
    queueid: number;
    studentid: string;
    datetime:Date
    type: string;
    rate: number;
    comment: string;
    orders: number;
    channel: number;
    status: string;
}