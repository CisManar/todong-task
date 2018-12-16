import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder ,Validators} from '@angular/forms';
import {SelectItem} from 'primeng/api';
import { category } from '../models/categories.interface'
import { listItem } from '../models/listItem.interface'



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  categories : category[];
  catarr = [];
  toDoArr : listItem[] = [];
  toDoArrDisplay : listItem[] = [];
  doneTasks = [];
  displayedListAccordingCategory : listItem[];
  listItem = <listItem>{};

 
  selectedCategory : category = null;
  selectedCat : category = null;

  catDisplay: boolean = false;
  taskDisplay: boolean = false;
  catformSubmitted = false;
  maxId : number;
  categoryId : number = null;
  itemId : number = null;
  duedate : Date;

  categoriesForm = this.formbuilder.group({
    catName:['',[Validators.required]]
  })
  
  toDoListForm = this.formbuilder.group({
    title:['',[Validators.required]],
    description:['',[Validators.required]],
    dueDate:['',[Validators.required]],
    tags:[''],
    selectedCat:['',[Validators.required]]
  })

  constructor( private formbuilder : FormBuilder) { 
    this.categories = [
       {id:1,name:"Daily"},
       {id:2,name:"Monthly"},
       {id:3,name:"Yearly"},
    ];

    this.toDoArr  = [
      {taskId:2, title:"DOOO",description:"DOOO description",dueDate:new Date(),tags:'',catId:1  },
      {taskId:1, title:"Eat",description:"Eat description",dueDate:new Date(),tags:'',catId:2  },
      {taskId:3, title:"Sport",description:"Sport description",dueDate:new Date(),tags:'',catId:3  },
      {taskId:5, title:"DOOO2",description:"DOOO2 description",dueDate:new Date(),tags:'',catId:1  },
      {taskId:6, title:"Eat2",description:"Eat2 description",dueDate:new Date(),tags:'',catId:2  },
      {taskId:4, title:"Sport2",description:"Sport2 description",dueDate:new Date(),tags:'',catId:3  },
   ];
  }

  ngOnInit() {
    this.toDoArrDisplay = this.toDoArr;
  }
  resetCat() {
    this.toDoArrDisplay = this.toDoArr;
  }
  viewList(catId) {
    this.toDoArrDisplay = this.toDoArr;
    console.log(this.toDoArr)
   var displayByCat = this.findItemByCategoryId(catId);
   this.toDoArrDisplay = displayByCat;
   
  }
 /// category..
  showCatDialog(cateid : number) {
    this.categoryId = null;
    this.categoriesForm.controls['catName'].setValue("title");

    cateid == null ? 0 : this.categoryId=cateid;
    if(this.categoryId!=null) {
      
      var selectedCatItem = this.findCategoryById(this.categoryId);

      this.categoriesForm.controls['catName'].setValue("title");

    }

    cateid !=null ? this.categoryId = cateid : 0;

    this.categoriesForm.reset();
    this.catDisplay = true;
    this.taskDisplay = false;
  }
   // categories functions

  onSubmitCat() {

    this.catarr = this.categories;
    this.catformSubmitted = true;
    if (this.categoriesForm.invalid) {
      return;
    } else{
      var savedCatName = this.categoriesForm.controls['catName'].value;
      this.categoryId == null ? this.addCat(savedCatName) : this.editCat(this.categoryId,savedCatName);
      this.catDisplay = false;
    }
    this.categories = this.catarr;
  }

  addCat(categoryname : string) {
    this.maxId =  this.getMax(this.categories);
      this.categories.push({id:this.maxId,name:categoryname});
  }
  editCat(id : number ,category:string) {
    var index = this.findCategoryIndexById(id);
   this.categories[index].name = category;
  }
  
  deleteCat(deletedCategory) {
    this.categories.splice(deletedCategory,1);
    console.log(this.categories)
    
  }
  // to do ..
  
  showTaskDialog(task) {
   
    if(task!=null) {
      this.itemId = task.taskId;
      var selectedCatItem = this.findCategoryById(task.catId);
      this.toDoListForm.controls['title'].setValue(task.title);
      this.toDoListForm.controls['description'].setValue(task.description);
      this.toDoListForm.controls['dueDate'].setValue(task.dueDate);
      this.toDoListForm.controls['selectedCat'].setValue(selectedCatItem);
     
    }
    this.categoriesForm.reset();
    this.taskDisplay = true;
    this.catDisplay = false
 
  }
  //add new Task
  onSubmitListItem() {
    this.listItem.title = this.toDoListForm.controls['title'].value;
    this.listItem.description = this.toDoListForm.controls['description'].value;
    this.listItem.dueDate = this.toDoListForm.controls['dueDate'].value;
    this.listItem.catId = this.toDoListForm.controls['selectedCat'].value['id'];

    this.itemId == null ? this.addTask() : this.editTask(this.itemId,this.listItem);this.itemId=null;
    

      this.taskDisplay = false;
      this.toDoListForm.reset();

      console.log("before",this.toDoArr)
    
  }

  
  // to do list functions
  doneTask(task) {
    this.toDoArr.splice(task,1);
    this.doneTasks.push(task);
  }
  addTask() {
    this.listItem.taskId = this.getMax(this.toDoArr);
     
      this.toDoArr.push(this.listItem);
  }
  editTask(id,task) {

    var index = this.findTaskIndexById(id);
    console.log('index:',index)
   this.toDoArr[index].title = task.title;
   this.toDoArr[index].description = task.description;
   this.toDoArr[index].dueDate = task.dueDate;
   this.toDoArr[index].catId = task.catId;

  }
  deleteTask(task) {
    this.toDoArr.splice(task,1);
  }
 
  //search on cat by id
  findCategoryById(id:number) 
  {
    for(var i = 0 ; i < this.categories.length;i++)
    {
      if(this.categories[i].id == id)
      {
         return this.categories[i];
      }
    }
  }
  backToDo(taskToBack) {
    this.doneTasks.splice(taskToBack,1);
    this.toDoArr.push(taskToBack);
  }
  // find category by id
  findCategoryIndexById(id:number) {

    for(var i = 0 ; i < this.categories.length;i++)
    {
      if(this.categories[i].id == id)
      {
         return i;
      }
    }
  }
  // find task by id
  findTaskIndexById(id:number) {

    for(var i = 0 ; i < this.toDoArr.length;i++)
    {
      if(this.toDoArr[i].taskId == id)
      {
         return i;
      }
    }
  }
  findItemByCategoryId(catid : number) {
    var arr = [];
    for(var i = 0 ; i < this.toDoArr.length;i++)
    {
      if(this.toDoArr[i].catId == catid)
      {
        arr.push(this.toDoArr[i]);
         // this.displayedListAccordingCategory.push(this.toDoArr[i])
        //Object.assign(this.displayedListAccordingCategory,this.toDoArr[i]);
      }
    }
    return arr;
  }

  ///
  getMax(arr){
    var counter;
    var max;
    if(arr.length==0){
      max = 0;
    }
    else {
      max = arr[0].id;
       for(counter=1;counter<arr.length;counter++) {
        if(arr[counter].id>max) {
          max = arr[counter].id;
        }
       }
    }
   return max+1;
  }
}
