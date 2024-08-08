export namespace main {
	
	export class Task {
	    id: number;
	    title: string;
	    dueDate: string;
	    priority: number;
	    done: boolean;
	
	    static createFrom(source: any = {}) {
	        return new Task(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.title = source["title"];
	        this.dueDate = source["dueDate"];
	        this.priority = source["priority"];
	        this.done = source["done"];
	    }
	}

}

