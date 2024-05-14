export interface Queue {
    queueid: number;
    datetime: Date;
    studentID: string;
    type: string;
    orders: number;
    channel: number;
    status: string;
    rate: number;
    comment: string;
}