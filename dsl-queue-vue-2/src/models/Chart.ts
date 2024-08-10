export enum Charttype {
    Bar,
    Bubble,
    Doughnut,
    Line,
    Pie,
    PolarArea,
    Radar,
    Scatter,
  }
export interface ChartData {
  type:Charttype;
  title?:string;
  subtitle?:string;
  actions?:object
  labels: string[];
  datasets: { data: number[],label:string,backgroundColor:string[] }[];
  chartOption?:object;
}
export interface Ratedata{
    "type":string;
    "count": number,
    "totalRate": number,
    "averageRate": number
}
export interface Countdata{
  "allQueuesCount": number,
  "finishedCount": number,
  "notFinishedCount": number
}
export interface CountdatabyHour{
  "hour": string,
  "count": number
}
export interface CountdatabyChannel{
  "channel": number,
        "count": number
}