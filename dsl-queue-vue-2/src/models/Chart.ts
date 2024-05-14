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
