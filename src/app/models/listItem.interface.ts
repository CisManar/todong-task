export interface listItem {
    taskId : number,
    title :string,
    description:string,
    dueDate:Date,
    tags?:string,
    catId:number;
  }